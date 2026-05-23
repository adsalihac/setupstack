"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
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
import { useLocalStorage } from "@/hooks/useLocalStorage";
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

export default function Home() {
  const { value: selectedStackId, setValue: setSelectedStackId } =
    useLocalStorage("setupstack.stack", stacks[0].id);
  const { value: selectedOS, setValue: setSelectedOS } = useLocalStorage<OSId>(
    "setupstack.os",
    "macos"
  );
  const { value: selectedTools, setValue: setSelectedTools } =
    useLocalStorage<ToolId[]>("setupstack.tools", []);
  const { value: completedSteps, setValue: setCompletedSteps } =
    useLocalStorage<string[]>("setupstack.progress", []);

  const [search, setSearch] = useState("");
  const [installOS, setInstallOS] = useState<OSId>(selectedOS);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const stack = stacks.find((item) => item.id === selectedStackId) ?? stacks[0];
  const os =
    operatingSystems.find((item) => item.id === selectedOS) ??
    operatingSystems[0];

  const stackTools = useMemo(
    () => stackToolMap[stack.id].map((id) => toolLookup[id]),
    [stack.id]
  );

  const filteredTools = useMemo(() => {
    if (!search.trim()) return stackTools;
    const query = search.toLowerCase();
    return stackTools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query)
    );
  }, [search, stackTools]);

  const selectedToolObjects = useMemo(
    () => stackTools.filter((tool) => selectedTools.includes(tool.id)),
    [selectedTools, stackTools]
  );

  const setupSections = useMemo(
    () =>
      buildSetupSections({
        stack,
        osId: os.id,
        tools: selectedToolObjects,
      }),
    [os.id, selectedToolObjects, stack]
  );

  const installScripts = useMemo(
    () => buildInstallScripts(selectedToolObjects),
    [selectedToolObjects]
  );

  const estimatedTime = useMemo(() => {
    const base = getBaseEstimate(os.id);
    return formatMinutes(sumEstimates(stack, selectedToolObjects, base));
  }, [os.id, selectedToolObjects, stack]);

  const toggleTool = (toolId: ToolId) => {
    setSelectedTools((current) =>
      current.includes(toolId)
        ? current.filter((id) => id !== toolId)
        : [...current, toolId]
    );
  };

  const handleSelectStack = (id: StackId) => {
    if (id === stack.id) return;
    setSelectedStackId(id);
    setSelectedTools([]);
    setCompletedSteps([]);
    setSearch("");
  };

  const handleSelectOS = (id: OSId) => {
    setSelectedOS(id);
    setInstallOS(id);
  };

  const toggleStep = (stepId: string) => {
    setCompletedSteps((current) =>
      current.includes(stepId)
        ? current.filter((id) => id !== stepId)
        : [...current, stepId]
    );
  };

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const handleExport = (type: "markdown" | "pdf") => {
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
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                    Trusted by
                  </p>
                  <p className="mt-1 font-medium text-zinc-700">
                    Platform teams, studios, and agencies
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                    Coverage
                  </p>
                  <p className="mt-1 font-medium text-zinc-700">
                    40+ tools and modern stacks
                  </p>
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
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                        Dashboard
                      </p>
                      <p className="mt-1 text-sm font-semibold text-zinc-900">
                        Setup overview
                      </p>
                    </div>
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                      {estimatedTime}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3">
                    <div className="flex items-center justify-between rounded-xl border border-zinc-200 px-3 py-2 text-xs text-zinc-600">
                      <span>Stack</span>
                      <span className="font-medium text-zinc-900">{stack.name}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-zinc-200 px-3 py-2 text-xs text-zinc-600">
                      <span>Operating system</span>
                      <span className="font-medium text-zinc-900">{os.name}</span>
                    </div>
                  </div>
                </Card>
                <CommandBlock
                  label="Install preview"
                  commands={[
                    "brew install node@20",
                    "npm create expo@latest",
                    "code .",
                  ]}
                />
              </div>
            </motion.div>
          </div>
        </section>

        <section id="stacks" className="scroll-mt-24 py-12">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
              Step 1
            </p>
            <h2 className="text-2xl font-semibold text-zinc-900">
              Select your stack
            </h2>
            <p className="text-sm text-zinc-600">
              Choose the developer stack you want to configure. Each stack comes
              with tailored SDKs, runtimes, and verification steps.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {stacks.map((item) => (
              <StackCard
                key={item.id}
                stack={item}
                selected={item.id === stack.id}
                onSelect={handleSelectStack}
              />
            ))}
          </div>
        </section>

        <section id="os" className="scroll-mt-24 py-12">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
              Step 2
            </p>
            <h2 className="text-2xl font-semibold text-zinc-900">
              Select your OS
            </h2>
            <p className="text-sm text-zinc-600">
              SetupStack adapts scripts for your operating system with minimal
              variation between environments.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {operatingSystems.map((item) => (
              <OSCard
                key={item.id}
                os={item}
                selected={item.id === os.id}
                onSelect={handleSelectOS}
              />
            ))}
          </div>
        </section>

        <section id="tools" className="scroll-mt-24 py-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
                Step 3
              </p>
              <h2 className="text-2xl font-semibold text-zinc-900">
                Select development tools
              </h2>
              <p className="text-sm text-zinc-600">
                Add editors, SDKs, and productivity apps. Your selections are
                saved locally.
              </p>
            </div>
            <div className="w-full max-w-sm">
              <SearchBar
                ref={searchRef}
                placeholder="Search tools"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
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
        </section>

        <section id="setup" className="scroll-mt-24 py-12">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
              Step 4
            </p>
            <h2 className="text-2xl font-semibold text-zinc-900">
              Generated setup guide
            </h2>
            <p className="text-sm text-zinc-600">
              Export a clean, production-ready setup guide with progress
              tracking and install scripts.
            </p>
          </div>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                      Estimated setup time
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-zinc-900">
                      {estimatedTime}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleExport("markdown")}
                    >
                      Export Markdown
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport("pdf")}
                    >
                      Export PDF
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                      Install script generator
                    </p>
                    <p className="mt-2 text-lg font-semibold text-zinc-900">
                      Brew, Winget, and Apt scripts
                    </p>
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
                        : ["echo \"Select tools to generate scripts\""]
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
                <p className="text-sm font-semibold text-zinc-900">
                  Setup navigation
                </p>
                <div className="mt-4 space-y-2 text-sm text-zinc-600">
                  {setupSections.map((section) => (
                    <a
                      key={section.id}
                      href={`#section-${section.id}`}
                      className="flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 transition hover:border-zinc-300 hover:text-zinc-900"
                    >
                      <span>{section.title}</span>
                      <span className="text-xs text-zinc-400">-&gt;</span>
                    </a>
                  ))}
                </div>
              </Card>
              <ProgressTracker
                steps={setupSections.map((section) => ({
                  id: section.id,
                  title: section.title,
                }))}
                completed={completedSteps}
                onToggle={toggleStep}
              />
              <Card className="p-5">
                <p className="text-sm font-semibold text-zinc-900">
                  Selected stack
                </p>
                <p className="mt-2 text-sm text-zinc-600">
                  {stack.name} on {os.name}
                </p>
                <div className="mt-4 text-xs uppercase tracking-[0.2em] text-zinc-400">
                  Tools selected
                </div>
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
                    <span className="text-xs text-zinc-400">
                      Add tools to personalize this guide.
                    </span>
                  )}
                </div>
              </Card>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
