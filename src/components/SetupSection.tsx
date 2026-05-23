import { useEffect, useState } from "react";
import { Button } from "./Button";
import { Card } from "./Card";
import { CommandBlock } from "./CommandBlock";
import { copyToClipboard } from "@/lib/utils";
import type { SetupSection as SetupSectionType } from "@/lib/types";

type SetupSectionProps = {
  section: SetupSectionType;
  index: number;
  total: number;
  id: string;
};

export function SetupSection({ section, index, total, id }: SetupSectionProps) {
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
    </Card>
  );
}
