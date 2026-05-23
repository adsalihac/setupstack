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
  operatingSystems,
  stackToolMap,
  stacks,
  toolLookup,
  troubleshootingGuides,
} from "@/lib/data";
import type { OSId, RuntimeChannel, StackId, ToolId } from "@/lib/types";
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
  const { value: presets, setValue: setPresets } = useLocalStorage<Preset[]>(
    "setupstack-presets",
    []
  );
  const searchRef = useRef<HTMLInputElement | null>(null);

  const detectedOS = useMemo(() => detectOS(), []);
  const detectedShell = useMemo(() => detectShell(detectedOS), [detectedOS]);

  const stack = stacks.find((s) => s.id === selectedStackId) ?? null;
  const os = operatingSystems.find((o) => o.id === selectedOS) ?? null;

  const stackTools = useMemo(
    () => (stack ? stackToolMap[stack.id].map((id) => toolLookup[id]) : []),
    [stack]
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

  const goToStep = (next: 1 | 2 | 3 | 4) => {
    setDirection(next > currentStep ? 1 : -1);
    setCurrentStep(next);
  };

  const handleSelectStack = (id: StackId) => {
    setSelectedStackId(id);
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

  const handleApplyPreset = (preset: Preset) => {
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
               <Button className="mt-8" onClick={() => {
                document.getElementById("stacks")?.scrollIntoView({ behavior: "smooth" });
                searchRef.current?.focus();
              }}>
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
          <AnimatePresence mode="wait" custom={direction}>

            {currentStep === 1 && (
              <motion.section
                key="step1"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                className="pb-12"
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
                key="step2"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                className="py-12"
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
                key="step3"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                className="py-12"
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
                key="step4"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                className="py-12"
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
      </main>
      <Footer />
    </div>
  );
}
