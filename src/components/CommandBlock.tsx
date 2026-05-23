import { useEffect, useState } from "react";
import { Button } from "./Button";
import { copyToClipboard } from "@/lib/utils";

type CommandBlockProps = {
  commands: string[];
  label?: string;
};

export function CommandBlock({ commands, label }: CommandBlockProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    if (copyStatus === "idle") return;
    const timeout = window.setTimeout(() => setCopyStatus("idle"), 1500);
    return () => window.clearTimeout(timeout);
  }, [copyStatus]);

  const copyAll = async () => {
    try {
      await copyToClipboard(commands.join("\n"));
      setCopyStatus("copied");
    } catch (error) {
      console.error("Failed to copy commands", error);
      setCopyStatus("error");
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800/40 bg-zinc-950 text-zinc-100 shadow-[0_8px_24px_rgba(15,23,42,0.24)]">
      <div className="flex items-center justify-between border-b border-zinc-800/70 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
          {label ?? "Terminal"}
        </p>
        <Button
          type="button"
          onClick={copyAll}
          size="sm"
          variant="ghost"
          className="text-zinc-200 hover:text-white hover:bg-white/10"
        >
          {copyStatus === "copied" ? "Copied" : copyStatus === "error" ? "Copy failed" : "Copy"}
        </Button>
      </div>
      <div className="space-y-2 px-4 py-4 font-mono text-[13px] leading-6 text-zinc-100">
        {commands.map((command, index) => (
          <div key={`${command}-${index}`} className="flex gap-3">
            <span className="text-zinc-500">$</span>
            <span className="whitespace-pre-wrap">{command}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
