"use client";

import { useMemo, useRef, useState } from "react";
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
import {
  operatingSystems,
  stackToolMap,
  stacks,
  toolLookup,
} from "@/lib/data";
import type { OSId, StackId, ToolId } from "@/lib/types";
import {
  buildInstallScripts,
  buildMarkdownExport,
  buildSetupSections,
  formatMinutes,
  getBaseEstimate,
  sumEstimates,
} from "@/lib/utils";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25, ease: "easeOut" as const },
};

export default function Home() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedStackId, setSelectedStackId] = useState<StackId | null>(null);
  const [selectedOS, setSelectedOS] = useState<OSId | null>(null);
  const [selectedTools, setSelectedTools] = useState<ToolId[]>([]);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [installOS, setInstallOS] = useState<OSId>("macos");
  const searchRef = useRef<HTMLInputElement | null>(null);

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
        ? buildSetupSections({ stack, osId: os.id, tools: selectedToolObjects })
        : [],
    [os, selectedToolObjects, stack]
  );

  const installScripts = useMemo(
    () => buildInstallScripts(selectedToolObjects),
    [selectedToolObjects]
  );

  const estimatedTime = useMemo(() => {
    if (!stack || !os) return "—";
    const base = getBaseEstimate(os.id);
    return formatMinutes(sumEstimates(stack, selectedToolObjects, base));
  }, [os, selectedToolObjects, stack]);

  const handleSelectStack = (id: StackId) => {
    setSelectedStackId(id);
    setSelectedOS(null);
    setSelectedTools([]);
    setCompletedSteps([]);
    setSearch("");
    setCurrentStep(2);
  };

  const handleSelectOS = (id: OSId) => {
    setSelectedOS(id);
    setInstallOS(id);
    setSelectedTools([]);
    setCompletedSteps([]);
    setCurrentStep(3);
  };

  const toggleTool = (toolId: ToolId) => {
    setSelectedTools((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSelectedStackId(null);
    setSelectedOS(null);
    setSelectedTools([]);
    setCompletedSteps([]);
    setSearch("");
  };

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) =>
      prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]
    );
  };

  const handleExport = (type: "markdown" | "pdf") => {
    if (!stack || !os) return;
    if (type === "pdf") {
      window.print();
      return;
    }
    const markdown = buildMarkdownExport({
      stackName: stack.name,
      osName: os.name,
      tools: selectedToolObjects,
      sections: setupSections,
      estimatedTime,
    });
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `setupstack-${stack.id}-${os.id}.md`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-24 lg:px-8">

        {/* Hero */}
        <section className="relative pb-20 pt-16">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#f4f4f5,transparent_60%)]" />
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
                SetupStack
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
                Set Up Your Developer Machine Faster
              </h1>
              <p className="mt-5 text-lg leading-7 text-zinc-600">
                Generate clean setup guides for your development stack, operating
                system, and tools.
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

        {/* Step progress bar */}
        <div className="mb-12 flex items-center gap-2">
          {([1, 2, 3, 4] as const).map((step) => {
            const reached = step <= 3 ? currentStep >= step : currentStep >= 3 && selectedTools.length > 0;
            return (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    reached
                      ? "bg-zinc-900 text-white"
                      : "border border-zinc-200 text-zinc-400"
                  }`}
                >
                  {step}
                </div>
                <span
                  className={`hidden text-xs sm:block transition-colors ${
                    reached ? "text-zinc-700 font-medium" : "text-zinc-400"
                  }`}
                >
                  {step === 1 ? "Stack" : step === 2 ? "OS" : step === 3 ? "Tools" : "Setup Guide"}
                </span>
                {step < 4 && (
                  <div
                    className={`mx-1 h-px w-8 transition-colors ${
                      (step < 3 ? currentStep > step : currentStep >= 3) ? "bg-zinc-400" : "bg-zinc-200"
                    }`}
                  />
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

        {/* Step 1 — Stack */}
        <AnimatePresence mode="wait">
          {currentStep >= 1 && (
            <motion.section key="step1" id="stacks" className="scroll-mt-24 pb-12" {...fadeUp}>
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">Step 1</p>
                <h2 className="text-2xl font-semibold text-zinc-900">Select your stack</h2>
                <p className="text-sm text-zinc-600">
                  Choose the developer stack you want to configure. Selecting a stack reveals the next step.
                </p>
              </div>
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
        </AnimatePresence>

        {/* Step 2 — OS */}
        <AnimatePresence>
          {currentStep >= 2 && (
            <motion.section key="step2" id="os" className="scroll-mt-24 py-12" {...fadeUp}>
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">Step 2</p>
                <h2 className="text-2xl font-semibold text-zinc-900">Select your OS</h2>
                <p className="text-sm text-zinc-600">
                  SetupStack adapts install scripts for your operating system. Selecting an OS reveals your tools.
                </p>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {operatingSystems.map((item) => (
                  <OSCard
                    key={item.id}
                    os={item}
                    selected={item.id === selectedOS}
                    onSelect={handleSelectOS}
                  />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Step 3 — Tools */}
        <AnimatePresence>
          {currentStep >= 3 && (
            <motion.section key="step3" id="tools" className="scroll-mt-24 py-12" {...fadeUp}>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">Step 3</p>
                  <h2 className="text-2xl font-semibold text-zinc-900">Select development tools</h2>
                  <p className="text-sm text-zinc-600">
                    Pick the tools for your stack, then generate your personalised guide.
                  </p>
                </div>
                <div className="w-full max-w-sm">
                  <SearchBar
                    ref={searchRef}
                    placeholder="Search tools"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
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
            </motion.section>
          )}
        </AnimatePresence>

        {/* Step 4 — Setup Guide */}
        <AnimatePresence>
          {currentStep >= 3 && stack && os && selectedTools.length > 0 && (
            <motion.section key="step4" id="setup" className="scroll-mt-24 py-12" {...fadeUp}>
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">Step 4</p>
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
                        <Button variant="secondary" size="sm" onClick={() => handleExport("markdown")}>
                          Export Markdown
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleExport("pdf")}>
                          Export PDF
                        </Button>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Install script generator</p>
                        <p className="mt-2 text-lg font-semibold text-zinc-900">Brew, Winget, and Apt scripts</p>
                      </div>
                      <div className="flex gap-2 rounded-full border border-zinc-200 bg-white p-1">
                        {(
                          [
                            { id: "macos", label: "Brew" },
                            { id: "windows", label: "Winget" },
                            { id: "linux", label: "Apt" },
                          ] as const
                        ).map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setInstallOS(item.id)}
                            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                              installOS === item.id
                                ? "bg-zinc-900 text-white"
                                : "text-zinc-500 hover:text-zinc-900"
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
                        commands={
                          installScripts[installOS].length
                            ? installScripts[installOS]
                            : ['echo "Select tools to generate scripts"']
                        }
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
                      />
                    ))}
                  </div>
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
                </aside>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
