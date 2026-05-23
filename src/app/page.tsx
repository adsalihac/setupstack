"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { CommandBlock } from "@/components/CommandBlock";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { OSCard } from "@/components/OSCard";
import { ProgressTracker } from "@/components/ProgressTracker";
import { SearchBar } from "@/components/SearchBar";
import { SetupSection } from "@/components/SetupSection";
import { StackCard } from "@/components/StackCard";
import { ToolCard } from "@/components/ToolCard";
import { TroubleshootingSection } from "@/components/TroubleshootingSection";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  caseTemplates as caseTemplateLibrary,
  operatingSystems,
  stackToolMap,
  stacks,
  toolLookup,
  troubleshootingGuides,
} from "@/lib/data";
import type { CaseTemplate, OSId, RepoProfile, RuntimeChannel, StackId, ToolId } from "@/lib/types";
import {
  buildGuideCopy,
  buildInstallScripts,
  buildMarkdownExport,
  buildPreflightChecks,
  buildSetupSections,
  copyToClipboard,
  detectOS,
  detectShell,
  formatMinutes,
  getBaseEstimate,
  sumEstimates,
} from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Stack" },
  { id: 2, label: "OS" },
  { id: 3, label: "Tools" },
  { id: 4, label: "Setup Guide" },
] as const;

const INSTALL_OPTIONS = [
  { id: "macos", label: "Brew" },
  { id: "windows", label: "Winget" },
  { id: "linux", label: "Apt" },
] as const;

const RUNTIME_CHANNELS: Array<{ id: RuntimeChannel; label: string; hint: string }> = [
  { id: "lts", label: "LTS", hint: "Stable versions recommended for teams." },
  { id: "latest", label: "Latest", hint: "Newest releases for early adopters." },
];

const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 48 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -48 }),
};
const STEP_SECTION_IDS = {
  1: "stacks",
  2: "step-2",
  3: "step-3",
  4: "step-4",
} as const;

type Preset = {
  id: string;
  name: string;
  stackId: StackId;
  osId: OSId;
  tools: ToolId[];
  runtimeChannel: RuntimeChannel;
  createdAt: number;
};

export default function Home() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [selectedStackId, setSelectedStackId] = useState<StackId | null>(null);
  const [selectedOS, setSelectedOS] = useState<OSId | null>(null);
  const [selectedTools, setSelectedTools] = useState<ToolId[]>([]);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [installOS, setInstallOS] = useState<OSId>("macos");
  const [runtimeChannel, setRuntimeChannel] = useState<RuntimeChannel>("lts");
  const [prefilledOS, setPrefilledOS] = useState(false);
  const [guideCopyStatus, setGuideCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const [markdownExportStatus, setMarkdownExportStatus] = useState<"idle" | "done" | "error">(
    "idle"
  );
  const [presetName, setPresetName] = useState("");
  const [presetStatus, setPresetStatus] = useState<"idle" | "saved" | "error">("idle");
  const [activeCaseTemplateId, setActiveCaseTemplateId] = useState<string | null>(null);
  const [repoPackageJson, setRepoPackageJson] = useState("");
  const [repoDockerCompose, setRepoDockerCompose] = useState("");
  const [repoEnvExample, setRepoEnvExample] = useState("");
  const [repoProfileStatus, setRepoProfileStatus] = useState<"idle" | "applied" | "error">("idle");
  const [repoProfile, setRepoProfile] = useState<RepoProfile | null>(null);
  const { value: presets, setValue: setPresets } = useLocalStorage<Preset[]>(
    "setupstack-presets",
    []
  );
  const searchRef = useRef<HTMLInputElement | null>(null);
  const pendingScrollStepRef = useRef<1 | 2 | 3 | 4 | null>(null);

  const detectedOS = useMemo(() => detectOS(), []);
  const detectedShell = useMemo(() => detectShell(detectedOS), [detectedOS]);

  const stack = stacks.find((s) => s.id === selectedStackId) ?? null;
  const os = operatingSystems.find((o) => o.id === selectedOS) ?? null;

  const stackTools = useMemo(
    () => (stack ? stackToolMap[stack.id].map((id) => toolLookup[id]) : []),
    [stack]
  );

  const activeCaseTemplate = useMemo(
    () => caseTemplateLibrary.find((template) => template.id === activeCaseTemplateId) ?? null,
    [activeCaseTemplateId]
  );

  const repoProfileStack = useMemo(
    () => (repoProfile ? stacks.find((item) => item.id === repoProfile.stackId) ?? null : null),
    [repoProfile]
  );

  const filteredTools = useMemo(() => {
    if (!search.trim()) return stackTools;
    const q = search.toLowerCase();
    return stackTools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }, [search, stackTools]);

  const selectedToolObjects = useMemo(
    () => stackTools.filter((t) => selectedTools.includes(t.id)),
    [selectedTools, stackTools]
  );

  const setupSections = useMemo(
    () =>
      stack && os
        ? buildSetupSections({
            stack,
            osId: os.id,
            tools: selectedToolObjects,
            runtimeChannel,
          })
        : [],
    [os, runtimeChannel, selectedToolObjects, stack]
  );

  const troubleshooting = useMemo(
    () => (stack ? troubleshootingGuides[stack.id] : null),
    [stack]
  );

  const installScripts = useMemo(
    () => buildInstallScripts(selectedToolObjects),
    [selectedToolObjects]
  );

  const preflightChecks = useMemo(
    () =>
      stack && os
        ? buildPreflightChecks({ osId: os.id, stackId: stack.id, tools: selectedToolObjects })
        : [],
    [os, selectedToolObjects, stack]
  );

  const caseChecklist = activeCaseTemplate?.checklist ?? [];

  const installLabel =
    INSTALL_OPTIONS.find((item) => item.id === installOS)?.label ?? "Install";
  const installCommands = installScripts[installOS].length
    ? installScripts[installOS]
    : ['echo "Select tools to generate scripts"'];

  const estimatedTime = useMemo(() => {
    if (!stack || !os) return "—";
    const base = getBaseEstimate(os.id);
    return formatMinutes(sumEstimates(stack, selectedToolObjects, base));
  }, [os, selectedToolObjects, stack]);

  const runtimeLabel = runtimeChannel === "latest" ? "Latest" : "LTS";
  const searchHint = detectedOS === "macos" ? "⌘ K" : "CTRL K";
  const inlineIssues = troubleshooting?.slice(0, 2) ?? [];

  useEffect(() => {
    if (guideCopyStatus === "idle") return;
    const timeout = window.setTimeout(() => setGuideCopyStatus("idle"), 1500);
    return () => window.clearTimeout(timeout);
  }, [guideCopyStatus]);

  useEffect(() => {
    if (markdownExportStatus === "idle") return;
    const timeout = window.setTimeout(() => setMarkdownExportStatus("idle"), 1500);
    return () => window.clearTimeout(timeout);
  }, [markdownExportStatus]);

  useEffect(() => {
    if (presetStatus === "idle") return;
    const timeout = window.setTimeout(() => setPresetStatus("idle"), 1500);
    return () => window.clearTimeout(timeout);
  }, [presetStatus]);

  useEffect(() => {
    if (repoProfileStatus === "idle") return;
    const timeout = window.setTimeout(() => setRepoProfileStatus("idle"), 2000);
    return () => window.clearTimeout(timeout);
  }, [repoProfileStatus]);

  const scrollToStepSection = (step: 1 | 2 | 3 | 4) => {
    globalThis.requestAnimationFrame(() => {
      document
        .getElementById(STEP_SECTION_IDS[step])
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const goToStep = (next: 1 | 2 | 3 | 4) => {
    if (next === currentStep) {
      scrollToStepSection(next);
      return;
    }
    pendingScrollStepRef.current = next;
    setDirection(next > currentStep ? 1 : -1);
    setCurrentStep(next);
  };

  const handleSelectStack = (id: StackId) => {
    setSelectedStackId(id);
    setActiveCaseTemplateId(null);
    setRepoProfile(null);
    setRepoProfileStatus("idle");
    const autoOS = detectedOS ?? null;
    setSelectedOS(autoOS);
    setInstallOS(autoOS ?? "macos");
    setPrefilledOS(Boolean(autoOS));
    setSelectedTools([]);
    setCompletedSteps([]);
    setSearch("");
    goToStep(2);
  };

  const handleSelectOS = (id: OSId) => {
    setSelectedOS(id);
    setActiveCaseTemplateId(null);
    setRepoProfile(null);
    setRepoProfileStatus("idle");
    setInstallOS(id);
    setPrefilledOS(false);
    setSelectedTools([]);
    setCompletedSteps([]);
    goToStep(3);
  };

  const toggleTool = (toolId: ToolId) => {
    setSelectedTools((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );
    setActiveCaseTemplateId(null);
    setRepoProfile(null);
    setRepoProfileStatus("idle");
  };

  const handleReset = () => {
    setDirection(-1);
    setCurrentStep(1);
    setSelectedStackId(null);
    setSelectedOS(null);
    setSelectedTools([]);
    setCompletedSteps([]);
    setSearch("");
    setRuntimeChannel("lts");
    setPrefilledOS(false);
    setPresetName("");
    setActiveCaseTemplateId(null);
    setRepoProfile(null);
    setRepoProfileStatus("idle");
    setRepoPackageJson("");
    setRepoDockerCompose("");
    setRepoEnvExample("");
  };

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) =>
      prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]
    );
  };

  const handleExport = () => {
    window.print();
  };

  const handleExportMarkdown = () => {
    if (!stack || !os) return;
    const markdown = buildMarkdownExport({
      stackName: stack.name,
      osName: os.name,
      tools: selectedToolObjects,
      sections: setupSections,
      estimatedTime,
      runtimeLabel,
      preflightChecks,
      caseNotes: activeCaseTemplate?.notes,
      caseChecklist,
      repoProfile: repoProfile ?? undefined,
    });

    try {
      const blob = new Blob([markdown], { type: "text/markdown" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "setupstack-guide.md";
      link.click();
      window.URL.revokeObjectURL(url);
      setMarkdownExportStatus("done");
    } catch (error) {
      console.error("Failed to export markdown", error);
      setMarkdownExportStatus("error");
    }
  };

  const handleCopyGuide = async () => {
    if (!stack || !os) return;
    const payload = buildGuideCopy({
      stackName: stack.name,
      osName: os.name,
      tools: selectedToolObjects,
      sections: setupSections,
      estimatedTime,
      installLabel,
      installCommands,
      troubleshooting,
      runtimeLabel,
      preflightChecks,
      caseNotes: activeCaseTemplate?.notes,
      caseChecklist,
      repoProfile: repoProfile ?? undefined,
    });
    try {
      await copyToClipboard(payload);
      setGuideCopyStatus("copied");
    } catch (error) {
      console.error("Failed to copy guide", error);
      setGuideCopyStatus("error");
    }
  };

  const handleSavePreset = () => {
    if (!stack || !os) return;
    const fallbackName = `${stack.name} on ${os.name}`;
    const name = presetName.trim() || fallbackName;
    if (!name) {
      setPresetStatus("error");
      return;
    }
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}`;
    const newPreset: Preset = {
      id,
      name,
      stackId: stack.id,
      osId: os.id,
      tools: selectedTools,
      runtimeChannel,
      createdAt: Date.now(),
    };
    setPresets((prev) => [newPreset, ...prev]);
    setPresetName("");
    setPresetStatus("saved");
  };

  const parsePackageJson = (raw: string) => {
    const parsed = JSON.parse(raw) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      scripts?: Record<string, string>;
    };
    const dependencies = Object.keys(parsed.dependencies ?? {});
    const devDependencies = Object.keys(parsed.devDependencies ?? {});
    const scripts = Object.keys(parsed.scripts ?? {});
    return { deps: [...dependencies, ...devDependencies], scripts };
  };

  const parseEnvKeys = (raw: string) => {
    const keys = new Set<string>();
    raw.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const normalized = trimmed.startsWith("export ") ? trimmed.slice(7) : trimmed;
      const match = normalized.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=/);
      if (match?.[1]) keys.add(match[1]);
    });
    return Array.from(keys);
  };

  const handleAnalyzeRepo = () => {
    const packageText = repoPackageJson.trim();
    const composeText = repoDockerCompose.trim();
    const envText = repoEnvExample.trim();
    if (!packageText && !composeText && !envText) {
      setRepoProfileStatus("error");
      return;
    }

    const sources: string[] = [];
    const detectedTools = new Set<ToolId>();
    const notes = new Set<string>();
    const services = new Set<string>();
    let stackCandidate: StackId | null = selectedStackId;

    if (packageText) {
      sources.push("package.json");
      try {
        const parsed = parsePackageJson(packageText);
        const depSet = new Set(parsed.deps);
        if (depSet.has("expo")) stackCandidate = "expo";
        else if (depSet.has("react-native")) stackCandidate = "react-native";
        else if (depSet.size > 0) stackCandidate = "node";

        if (depSet.has("next")) notes.add("Next.js detected in package.json.");
        if (depSet.has("vite")) notes.add("Vite detected in package.json.");
        if (depSet.has("prisma")) notes.add("Prisma detected; run migrations before starting the API.");
        if (depSet.has("turbo") || depSet.has("nx")) {
          notes.add("Monorepo tooling detected (Turbo/Nx).");
        }

        if (depSet.has("eslint") || depSet.has("prettier") || depSet.has("eslint-config-prettier")) {
          detectedTools.add("eslint-prettier");
        }
        if (depSet.has("tailwindcss")) detectedTools.add("tailwind");
        if (depSet.has("vitest")) detectedTools.add("vitest");
        if (depSet.has("playwright") || depSet.has("@playwright/test")) detectedTools.add("playwright");
        if (depSet.has("storybook") || parsed.deps.some((dep) => dep.startsWith("@storybook/"))) {
          detectedTools.add("storybook");
        }
        if (depSet.has("pg") || depSet.has("pg-native")) detectedTools.add("postgres");
        if (depSet.has("redis") || depSet.has("ioredis")) detectedTools.add("redis");
      } catch (error) {
        console.error("Failed to parse package.json", error);
        setRepoProfileStatus("error");
        return;
      }
    }

    if (composeText) {
      sources.push("docker-compose.yml");
      detectedTools.add("docker");
      notes.add("docker-compose.yml detected; start services with `docker compose up -d`.");
      const lowerCompose = composeText.toLowerCase();
      if (lowerCompose.includes("postgres")) {
        detectedTools.add("postgres");
        services.add("Postgres");
      }
      if (lowerCompose.includes("redis")) {
        detectedTools.add("redis");
        services.add("Redis");
      }
      if (lowerCompose.includes("mongo")) services.add("MongoDB");
      if (lowerCompose.includes("mysql")) services.add("MySQL");
      if (lowerCompose.includes("kafka")) services.add("Kafka");
    }

    const envKeys = envText ? parseEnvKeys(envText) : [];
    if (envText) {
      sources.push(".env.example");
      if (envKeys.length) {
        notes.add(`Found ${envKeys.length} env vars in .env.example.`);
      }
    }

    if (!stackCandidate) {
      setRepoProfileStatus("error");
      return;
    }

    const availableTools = stackToolMap[stackCandidate];
    const mergedTools = Array.from(new Set([...availableTools, ...Array.from(detectedTools)])).filter(
      (toolId) => availableTools.includes(toolId)
    );

    const resolvedOS = detectedOS ?? selectedOS ?? "macos";
    setSelectedStackId(stackCandidate);
    setSelectedOS(resolvedOS);
    setInstallOS(resolvedOS);
    setSelectedTools(mergedTools);
    setRuntimeChannel("lts");
    setCompletedSteps([]);
    setSearch("");
    setPrefilledOS(Boolean(detectedOS));
    setActiveCaseTemplateId(null);

    setRepoProfile({
      stackId: stackCandidate,
      tools: mergedTools,
      notes: Array.from(notes),
      services: Array.from(services),
      envKeys,
      sources,
    });
    setRepoProfileStatus("applied");
    goToStep(4);
  };

  const handleApplyCaseTemplate = (template: CaseTemplate) => {
    const availableTools = stackToolMap[template.stackId];
    const filteredTools = template.tools.filter((toolId) => availableTools.includes(toolId));
    const resolvedOS = detectedOS ?? template.osId;
    setSelectedStackId(template.stackId);
    setSelectedOS(resolvedOS);
    setInstallOS(resolvedOS);
    setSelectedTools(filteredTools);
    setRuntimeChannel(template.runtimeChannel ?? "lts");
    setCompletedSteps([]);
    setSearch("");
    setPrefilledOS(false);
    setActiveCaseTemplateId(template.id);
    setRepoProfile(null);
    setRepoProfileStatus("idle");
    goToStep(4);
  };

  const handleApplyPreset = (preset: Preset) => {
    setActiveCaseTemplateId(null);
    setRepoProfile(null);
    setRepoProfileStatus("idle");
    setSelectedStackId(preset.stackId);
    setSelectedOS(preset.osId);
    setInstallOS(preset.osId);
    setSelectedTools(preset.tools);
    setRuntimeChannel(preset.runtimeChannel ?? "lts");
    setCompletedSteps([]);
    setSearch("");
    setPrefilledOS(false);
    goToStep(4);
  };

  const handleDeletePreset = (presetId: string) => {
    setPresets((prev) => prev.filter((preset) => preset.id !== presetId));
  };

  const maxUnlocked: number =
    selectedTools.length > 0 ? 4
    : selectedOS ? 3
    : selectedStackId ? 2
    : 1;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-24 lg:px-8">

        {/* Hero */}
        <section className="relative pb-20 pt-16">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#f4f4f5,transparent_60%)]" />
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">Setup Stack</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
                Set Up Your Developer Machine Faster
              </h1>
              <p className="mt-5 text-lg leading-7 text-zinc-600">
                Generate clean setup guides for your development stack, operating system, and tools.
              </p>
             
              <div className="mt-10 flex flex-wrap gap-6 text-sm text-zinc-500">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Trusted by</p>
                  <p className="mt-1 font-medium text-zinc-700">Platform teams, studios, and agencies</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Coverage</p>
                  <p className="mt-1 font-medium text-zinc-700">40+ tools and modern stacks</p>
                </div>
              </div>
               <Button className="mt-8" onClick={() => goToStep(1)}>
                Get Started
              </Button>
            </div>
            
            <motion.div
              className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_30px_60px_rgba(15,23,42,0.08)]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="grid gap-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Dashboard</p>
                      <p className="mt-1 text-sm font-semibold text-zinc-900">Setup overview</p>
                    </div>
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                      {estimatedTime}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3">
                    <div className="flex items-center justify-between rounded-xl border border-zinc-200 px-3 py-2 text-xs text-zinc-600">
                      <span>Stack</span>
                      <span className="font-medium text-zinc-900">{stack?.name ?? "—"}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-zinc-200 px-3 py-2 text-xs text-zinc-600">
                      <span>Operating system</span>
                      <span className="font-medium text-zinc-900">{os?.name ?? "—"}</span>
                    </div>
                  </div>
                </Card>
                <CommandBlock
                  label="Install preview"
                  commands={["brew install node@20", "npm create expo@latest", "code ."]}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stepper */}
        <div id="stacks" className="mb-8 flex scroll-mt-28 items-center gap-1">
          {STEPS.map((step, i) => {
            const unlocked = step.id <= maxUnlocked;
            const active = currentStep === step.id;
            return (
              <div key={step.id} className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={!unlocked}
                  onClick={() => unlocked ? goToStep(step.id) : undefined}
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                    active
                      ? "bg-zinc-900 text-white shadow-sm"
                      : unlocked
                      ? "border border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900"
                      : "border border-zinc-100 text-zinc-300 cursor-not-allowed"
                  }`}
                >
                  <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                    active ? "bg-white/20 text-white" : unlocked ? "bg-zinc-100 text-zinc-600" : "bg-zinc-50 text-zinc-300"
                  }`}>
                    {step.id}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`h-px w-6 transition-colors ${unlocked && step.id < maxUnlocked ? "bg-zinc-300" : "bg-zinc-100"}`} />
                )}
              </div>
            );
          })}
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleReset}
              className="ml-auto text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              Start over
            </button>
          )}
        </div>

        {/* Slider */}
        <div className="overflow-hidden">
          <AnimatePresence
            mode="wait"
            custom={direction}
            onExitComplete={() => {
              const nextStep = pendingScrollStepRef.current;
              if (!nextStep) return;
              pendingScrollStepRef.current = null;
              scrollToStepSection(nextStep);
            }}
          >

            {currentStep === 1 && (
              <motion.section
                id={STEP_SECTION_IDS[1]}
                key="step1"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                className="scroll-mt-28 py-12"
              >
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">Step 1 of 4</p>
                  <h2 className="text-2xl font-semibold text-zinc-900">Select your stack</h2>
                  <p className="text-sm text-zinc-600">
                    Choose the developer stack you want to configure. Selecting a stack moves to the next step.
                  </p>
                </div>
                {presets.length ? (
                  <Card className="mt-6 p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-zinc-900">Saved presets</p>
                      <span className="text-xs text-zinc-500">{presets.length} saved</span>
                    </div>
                    <div className="mt-4 space-y-3">
                      {presets.map((preset) => {
                        const presetStack = stacks.find((item) => item.id === preset.stackId);
                        const presetOS = operatingSystems.find((item) => item.id === preset.osId);
                        return (
                          <div
                            key={preset.id}
                            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 px-4 py-3 text-sm"
                          >
                            <div>
                              <p className="font-semibold text-zinc-900">{preset.name}</p>
                              <p className="text-xs text-zinc-500">
                                {presetStack?.name ?? preset.stackId} · {presetOS?.name ?? preset.osId} ·{" "}
                                {preset.tools.length} tools · {preset.runtimeChannel.toUpperCase()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleApplyPreset(preset)}>
                                Load
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleDeletePreset(preset.id)}>
                                Delete
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                ) : null}
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {stacks.map((item) => (
                    <StackCard
                      key={item.id}
                      stack={item}
                      selected={item.id === selectedStackId}
                      onSelect={handleSelectStack}
                    />
                  ))}
                </div>
              </motion.section>
            )}

            {currentStep === 2 && (
              <motion.section
                id={STEP_SECTION_IDS[2]}
                key="step2"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                className="scroll-mt-28 py-12"
              >
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">Step 2 of 4</p>
                  <h2 className="text-2xl font-semibold text-zinc-900">Select your OS</h2>
                  <p className="text-sm text-zinc-600">
                    Setup Stack adapts install scripts for your operating system.
                  </p>
                  {detectedOS && detectedShell ? (
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 font-semibold text-emerald-700">
                        Detected {operatingSystems.find((item) => item.id === detectedOS)?.name ?? detectedOS}
                      </span>
                      <span>Shell: {detectedShell}</span>
                    </div>
                  ) : null}
                </div>
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  {operatingSystems.map((item) => (
                    <OSCard
                      key={item.id}
                      os={item}
                      selected={item.id === selectedOS}
                      onSelect={handleSelectOS}
                      tag={prefilledOS && item.id === detectedOS ? "Detected" : undefined}
                    />
                  ))}
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => goToStep(1)}
                    className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
                  >
                    ← Back
                  </button>
                  {selectedOS ? (
                    <Button size="sm" variant="outline" onClick={() => goToStep(3)}>
                      Continue
                    </Button>
                  ) : null}
                </div>
              </motion.section>
            )}

            {currentStep === 3 && (
              <motion.section
                id={STEP_SECTION_IDS[3]}
                key="step3"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                className="scroll-mt-28 py-12"
              >
                <div className="flex flex-wrap items-end justify-between gap-6">
                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">Step 3 of 4</p>
                    <h2 className="text-2xl font-semibold text-zinc-900">Select development tools</h2>
                    <p className="text-sm text-zinc-600">
                      Pick the tools for your stack, then view your generated guide.
                    </p>
                  </div>
                  <div className="w-full max-w-sm">
                    <SearchBar
                      ref={searchRef}
                      hint={searchHint}
                      placeholder="Search tools"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
                {filteredTools.length ? (
                  <div className="mt-8 grid gap-4 md:grid-cols-2">
                    {filteredTools.map((tool) => (
                      <ToolCard
                        key={tool.id}
                        tool={tool}
                        selected={selectedTools.includes(tool.id)}
                        onToggle={toggleTool}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="mt-8 p-6">
                    <p className="text-sm font-semibold text-zinc-900">No tools match that search.</p>
                    <p className="mt-2 text-sm text-zinc-600">
                      Try searching for{" "}
                      {stackTools.slice(0, 3).map((tool, index) => (
                        <span key={tool.id} className="font-semibold text-zinc-800">
                          {tool.name}
                          {index < Math.min(2, stackTools.length - 1) ? ", " : ""}
                        </span>
                      ))}
                      .
                    </p>
                    <p className="mt-2 text-xs text-zinc-400">Tip: Press {searchHint} to focus search.</p>
                  </Card>
                )}
                <div className="mt-8 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => goToStep(2)}
                    className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
                  >
                    ← Back
                  </button>
                  {selectedTools.length > 0 && (
                    <Button onClick={() => goToStep(4)}>
                      View Setup Guide
                      <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                        {selectedTools.length} tools
                      </span>
                    </Button>
                  )}
                </div>
              </motion.section>
            )}

            {currentStep === 4 && stack && os && (
              <motion.section
                id={STEP_SECTION_IDS[4]}
                key="step4"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                className="scroll-mt-28 py-12"
              >
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">Step 4 of 4</p>
                  <h2 className="text-2xl font-semibold text-zinc-900">Generated setup guide</h2>
                  <p className="text-sm text-zinc-600">
                    Your personalised guide for <strong>{stack.name}</strong> on <strong>{os.name}</strong>.
                  </p>
                </div>
                <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
                  <div className="space-y-6">
                    <Card className="p-6">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Estimated setup time</p>
                          <p className="mt-2 text-2xl font-semibold text-zinc-900">{estimatedTime}</p>
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" size="sm" onClick={handleCopyGuide}>
                            {guideCopyStatus === "copied"
                              ? "Copied"
                              : guideCopyStatus === "error"
                              ? "Copy failed"
                              : "Copy guide"}
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleExportMarkdown}>
                            {markdownExportStatus === "done"
                              ? "Exported"
                              : markdownExportStatus === "error"
                              ? "Export failed"
                              : "Export Markdown"}
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleExport}>
                            Export PDF
                          </Button>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Runtime channel</p>
                          <p className="mt-2 text-lg font-semibold text-zinc-900">{runtimeLabel}</p>
                        </div>
                        <div className="flex gap-2 rounded-full border border-zinc-200 bg-white p-1">
                          {RUNTIME_CHANNELS.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setRuntimeChannel(item.id)}
                              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                                runtimeChannel === item.id
                                  ? "bg-zinc-900 text-white"
                                  : "text-zinc-500 hover:text-zinc-900"
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-zinc-500">
                        {RUNTIME_CHANNELS.find((item) => item.id === runtimeChannel)?.hint}
                      </p>
                    </Card>

                    {repoProfile ? (
                      <Card className="p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Repo profile</p>
                            <p className="mt-2 text-lg font-semibold text-zinc-900">
                              {repoProfileStack?.name ?? repoProfile.stackId} · {repoProfile.tools.length} tools
                            </p>
                          </div>
                          <span className="text-xs text-zinc-400">{repoProfile.sources.join(", ")}</span>
                        </div>
                        {repoProfile.notes.length ? (
                          <div className="mt-3 space-y-2 text-sm text-zinc-600">
                            {repoProfile.notes.map((note) => (
                              <p key={note}>• {note}</p>
                            ))}
                          </div>
                        ) : null}
                        {repoProfile.services.length ? (
                          <div className="mt-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Services</p>
                            <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-600">
                              {repoProfile.services.map((service) => (
                                <span
                                  key={service}
                                  className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1"
                                >
                                  {service}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : null}
                        {repoProfile.envKeys.length ? (
                          <div className="mt-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Env vars</p>
                            <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-600">
                              {repoProfile.envKeys.slice(0, 10).map((key) => (
                                <span
                                  key={key}
                                  className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1"
                                >
                                  {key}
                                </span>
                              ))}
                              {repoProfile.envKeys.length > 10 ? (
                                <span className="text-xs text-zinc-400">
                                  +{repoProfile.envKeys.length - 10} more
                                </span>
                              ) : null}
                            </div>
                          </div>
                        ) : null}
                      </Card>
                    ) : null}

                    {activeCaseTemplate?.notes ? (
                      <Card className="p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Case notes</p>
                            <p className="mt-2 text-lg font-semibold text-zinc-900">
                              {activeCaseTemplate.name}
                            </p>
                          </div>
                          <span className="text-xs text-zinc-400">{activeCaseTemplate.category}</span>
                        </div>
                        <p className="mt-3 text-sm text-zinc-600">
                          {activeCaseTemplate.notes.summary}
                        </p>
                        {activeCaseTemplate.notes.links?.length ? (
                          <div className="mt-4 space-y-2 text-sm text-zinc-600">
                            {activeCaseTemplate.notes.links.map((link) => (
                              <a
                                key={`${link.label}-${link.url}`}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 transition hover:border-zinc-300 hover:text-zinc-900"
                              >
                                <span className="font-semibold text-zinc-700">{link.label}</span>
                                <span className="text-xs text-zinc-400">↗</span>
                              </a>
                            ))}
                          </div>
                        ) : null}
                      </Card>
                    ) : null}

                    {caseChecklist.length ? (
                      <Card className="p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Case checklist</p>
                            <p className="mt-2 text-lg font-semibold text-zinc-900">
                              Validate the workflow
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 space-y-4">
                          {caseChecklist.map((item) => (
                            <div
                              key={item.id}
                              className="rounded-2xl border border-zinc-200 bg-white p-4"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-semibold text-zinc-900">{item.title}</p>
                                <span className="text-xs text-zinc-400">Case</span>
                              </div>
                              <p className="mt-1 text-xs text-zinc-500">{item.description}</p>
                              <div className="mt-3">
                                <CommandBlock label="Checklist" commands={item.commands} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ) : null}

                    {preflightChecks.length ? (
                      <Card className="p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Preflight checklist</p>
                            <p className="mt-2 text-lg font-semibold text-zinc-900">
                              Catch blockers before installs
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 space-y-4">
                          {preflightChecks.map((check) => (
                            <div
                              key={check.id}
                              className="rounded-2xl border border-zinc-200 bg-white p-4"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-semibold text-zinc-900">{check.title}</p>
                                <span className="text-xs text-zinc-400">Preflight</span>
                              </div>
                              <p className="mt-1 text-xs text-zinc-500">{check.description}</p>
                              <div className="mt-3">
                                <CommandBlock label="Check" commands={check.commands} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ) : null}
                    <Card className="p-6">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Install script generator</p>
                          <p className="mt-2 text-lg font-semibold text-zinc-900">Brew, Winget, and Apt scripts</p>
                        </div>
                        <div className="flex gap-2 rounded-full border border-zinc-200 bg-white p-1">
                          {INSTALL_OPTIONS.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setInstallOS(item.id)}
                              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                                installOS === item.id ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-900"
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4">
                        <CommandBlock
                          label="Install script"
                          commands={installCommands}
                        />
                      </div>
                    </Card>

                    <div className="space-y-6">
                      {setupSections.map((section, index) => (
                        <SetupSection
                          key={section.id}
                          section={section}
                          id={`section-${section.id}`}
                          index={index + 1}
                          total={setupSections.length}
                          inlineIssues={section.id === "stack" ? inlineIssues : undefined}
                        />
                      ))}
                    </div>

                    {troubleshooting && (
                      <div id="troubleshooting" className="border-t border-zinc-100 pt-10">
                        <div className="mb-6 flex flex-col gap-2">
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
                            Troubleshooting
                          </p>
                          <h3 className="text-xl font-semibold text-zinc-900">Common issues</h3>
                          <p className="text-sm text-zinc-500">
                            Known issues for {stack.name} with step-by-step fixes.
                          </p>
                        </div>
                        <TroubleshootingSection items={troubleshooting} />
                      </div>
                    )}
                  </div>

                  <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
                    <Card className="p-5">
                      <p className="text-sm font-semibold text-zinc-900">Setup navigation</p>
                      <div className="mt-4 space-y-2 text-sm text-zinc-600">
                        {setupSections.map((section) => (
                          <a
                            key={section.id}
                            href={`#section-${section.id}`}
                            className="flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 transition hover:border-zinc-300 hover:text-zinc-900"
                          >
                            <span>{section.title}</span>
                            <span className="text-xs text-zinc-400">→</span>
                          </a>
                        ))}
                      </div>
                    </Card>
                    <ProgressTracker
                      steps={setupSections.map((s) => ({ id: s.id, title: s.title }))}
                      completed={completedSteps}
                      onToggle={toggleStep}
                    />
                    <Card className="p-5">
                      <p className="text-sm font-semibold text-zinc-900">Presets</p>
                      <p className="mt-2 text-xs text-zinc-500">
                        Save this setup to reuse or share with your team.
                      </p>
                      <div className="mt-4 space-y-3">
                        <input
                          type="text"
                          placeholder={`${stack.name} on ${os.name}`}
                          value={presetName}
                          onChange={(event) => setPresetName(event.target.value)}
                          className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs text-zinc-700 outline-none focus:border-zinc-400"
                        />
                        <Button size="sm" variant="outline" onClick={handleSavePreset} className="w-full">
                          {presetStatus === "saved"
                            ? "Saved"
                            : presetStatus === "error"
                            ? "Name required"
                            : "Save preset"}
                        </Button>
                      </div>
                      {presets.length ? (
                        <div className="mt-4 space-y-2 text-xs text-zinc-600">
                          {presets.slice(0, 3).map((preset) => {
                            const presetStack = stacks.find((item) => item.id === preset.stackId);
                            const presetOS = operatingSystems.find((item) => item.id === preset.osId);
                            return (
                              <div
                                key={preset.id}
                                className="flex items-center justify-between gap-2 rounded-lg border border-zinc-200 px-3 py-2"
                              >
                                <div>
                                  <p className="text-sm font-semibold text-zinc-900">{preset.name}</p>
                                  <p className="text-[11px] text-zinc-500">
                                    {presetStack?.name ?? preset.stackId} · {presetOS?.name ?? preset.osId}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleApplyPreset(preset)}
                                    className="text-xs font-semibold text-zinc-600 hover:text-zinc-900"
                                  >
                                    Load
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeletePreset(preset.id)}
                                    className="text-xs text-zinc-400 hover:text-zinc-900"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="mt-4 text-xs text-zinc-400">No presets saved yet.</p>
                      )}
                    </Card>
                    <Card className="p-5">
                      <p className="text-sm font-semibold text-zinc-900">Selected stack</p>
                      <p className="mt-2 text-sm text-zinc-600">{stack.name} on {os.name}</p>
                      <div className="mt-4 text-xs uppercase tracking-[0.2em] text-zinc-400">Tools selected</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedToolObjects.length ? (
                          selectedToolObjects.map((tool) => (
                            <span
                              key={tool.id}
                              className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-600"
                            >
                              {tool.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-zinc-400">No tools selected.</span>
                        )}
                      </div>
                    </Card>
                    <button
                      type="button"
                      onClick={() => goToStep(3)}
                      className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-medium text-zinc-500 hover:border-zinc-300 hover:text-zinc-900 transition-colors"
                    >
                      ← Edit tools
                    </button>
                  </aside>
                </div>
              </motion.section>
            )}

          </AnimatePresence>
        </div>

        <section className="mt-16 space-y-4">
          {caseTemplateLibrary.length ? (
            <Card className="p-5">
              <details className="group" name="app-case-library">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-zinc-900">App case library</p>
                  <span className="text-xs text-zinc-500 transition-colors group-open:text-zinc-700">
                    {caseTemplateLibrary.length} templates · Expand
                  </span>
                </summary>
                <div className="mt-4 space-y-3">
                  {caseTemplateLibrary.map((template) => {
                    const templateStack = stacks.find((item) => item.id === template.stackId);
                    const templateOS = operatingSystems.find((item) => item.id === template.osId);
                    const hasNotes = Boolean(
                      template.notes?.summary || template.notes?.links?.length
                    );
                    return (
                      <div
                        key={template.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 px-4 py-3 text-sm"
                      >
                        <div>
                          <p className="font-semibold text-zinc-900">{template.name}</p>
                          <p className="text-xs text-zinc-500">{template.description}</p>
                          <p className="text-xs text-zinc-500">
                            {template.category} · {templateStack?.name ?? template.stackId} ·{" "}
                            {templateOS?.name ?? template.osId} · {template.tools.length} tools ·{" "}
                            {template.runtimeChannel.toUpperCase()}
                            {hasNotes ? " · Notes included" : ""}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApplyCaseTemplate(template)}
                          >
                            Use case
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </details>
            </Card>
          ) : null}

          <Card className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-zinc-900">Repo-aware profile</p>
                <p className="mt-1 text-xs text-zinc-500">
                  Paste repo files to auto-pick a stack, tools, and setup notes.
                </p>
              </div>
              <span className="text-xs text-zinc-400">Local-only analysis</span>
            </div>
            <div className="mt-4 grid gap-3">
              <textarea
                rows={4}
                placeholder="package.json (optional)"
                value={repoPackageJson}
                onChange={(event) => setRepoPackageJson(event.target.value)}
                className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs text-zinc-700 outline-none focus:border-zinc-400"
              />
              <textarea
                rows={3}
                placeholder="docker-compose.yml (optional)"
                value={repoDockerCompose}
                onChange={(event) => setRepoDockerCompose(event.target.value)}
                className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs text-zinc-700 outline-none focus:border-zinc-400"
              />
              <textarea
                rows={3}
                placeholder=".env.example (optional)"
                value={repoEnvExample}
                onChange={(event) => setRepoEnvExample(event.target.value)}
                className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs text-zinc-700 outline-none focus:border-zinc-400"
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button size="sm" variant="outline" onClick={handleAnalyzeRepo}>
                Analyze repo
              </Button>
              <span className="text-xs text-zinc-400">
                Nothing is uploaded. Everything stays in your browser.
              </span>
            </div>
            {repoProfileStatus === "error" ? (
              <p className="mt-3 text-xs text-rose-500">
                Add a valid package.json or select a stack before analyzing.
              </p>
            ) : repoProfileStatus === "applied" ? (
              <p className="mt-3 text-xs text-emerald-600">Repo profile applied.</p>
            ) : null}
            {repoProfile ? (
              <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-xs text-zinc-600">
                <p className="font-semibold text-zinc-800">
                  Detected {repoProfileStack?.name ?? repoProfile.stackId} · {repoProfile.tools.length} tools
                </p>
                <p className="mt-1 text-zinc-500">
                  Sources: {repoProfile.sources.join(", ")}
                  {repoProfile.services.length ? ` · Services: ${repoProfile.services.join(", ")}` : ""}
                  {repoProfile.envKeys.length ? ` · Env vars: ${repoProfile.envKeys.length}` : ""}
                </p>
              </div>
            ) : null}
          </Card>
        </section>

      </main>
      <Footer />
    </div>
  );
}
