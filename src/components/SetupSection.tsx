import { useEffect, useState } from "react";
import { Button } from "./Button";
import { Card } from "./Card";
import { CommandBlock } from "./CommandBlock";
import { copyToClipboard } from "@/lib/utils";
import type { TroubleshootingItem } from "@/lib/data";
import type { SetupSection as SetupSectionType } from "@/lib/types";

type SetupSectionProps = {
  section: SetupSectionType;
  index: number;
  total: number;
  id: string;
  inlineIssues?: TroubleshootingItem[];
};

export function SetupSection({ section, index, total, id, inlineIssues }: SetupSectionProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    if (copyStatus === "idle") return;
    const timeout = window.setTimeout(() => setCopyStatus("idle"), 1500);
    return () => window.clearTimeout(timeout);
  }, [copyStatus]);

  const handleCopySection = async () => {
    const commands = section.commands.join("\n");
    const payload = `## Step ${index} of ${total}: ${section.title}\n${section.description}\n\n\`\`\`bash\n${commands}\n\`\`\``;
    try {
      await copyToClipboard(payload);
      setCopyStatus("copied");
    } catch (error) {
      console.error("Failed to copy section", error);
      setCopyStatus("error");
    }
  };

  return (
    <Card id={id} className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
            Step {index} of {total}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-zinc-900">
            {section.title}
          </h3>
          <p className="mt-2 text-sm text-zinc-600">{section.description}</p>
          {section.tips?.length ? (
            <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-700">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-700">
                Tips
              </p>
              <ul className="mt-2 space-y-1">
                {section.tips.map((tip) => (
                  <li key={tip}>• {tip}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={handleCopySection}
          className="text-zinc-500 hover:text-zinc-900"
        >
          {copyStatus === "copied"
            ? "Copied"
            : copyStatus === "error"
            ? "Copy failed"
            : "Copy section"}
        </Button>
      </div>
      <div className="mt-5">
        <CommandBlock commands={section.commands} label="Commands" />
      </div>
      {inlineIssues && inlineIssues.length ? (
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Common issues
            </p>
            <a href="#troubleshooting" className="text-xs text-zinc-500 hover:text-zinc-900">
              View all →
            </a>
          </div>
          <div className="mt-4 space-y-4">
            {inlineIssues.map((issue) => (
              <div key={issue.issue} className="space-y-2">
                <p className="text-sm font-semibold text-zinc-900">{issue.issue}</p>
                <p className="text-xs text-zinc-600">{issue.cause}</p>
                <CommandBlock label="Fix" commands={issue.fix} />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </Card>
  );
}
