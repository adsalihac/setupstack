import type { TroubleshootingItem } from "./data";
import type { OSId, SetupSection, Stack, Tool } from "./types";
import {
  baseSystemCommands,
  stackCommands,
  verificationCommands,
} from "./data";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatMinutes(total: number) {
  const rounded = Math.max(5, Math.round(total));
  return `${rounded} minutes`;
}

export function buildInstallScripts(selectedTools: Tool[]) {
  const scripts: Record<OSId, string[]> = {
    macos: [],
    windows: [],
    linux: [],
  };

  (Object.keys(scripts) as OSId[]).forEach((os) => {
    const commands = selectedTools.flatMap((tool) => tool.install[os]);
    scripts[os] = Array.from(new Set(commands));
  });

  return scripts;
}

export function buildSetupSections({
  stack,
  osId,
  tools,
}: {
  stack: Stack;
  osId: OSId;
  tools: Tool[];
}): SetupSection[] {
  const toolCommands = tools.flatMap((tool) => tool.install[osId]);
  const uniqueToolCommands = Array.from(new Set(toolCommands));

  return [
    {
      id: "system",
      title: "System foundations",
      description: "Install base dependencies, shell tooling, and workspace.",
      commands: baseSystemCommands[osId],
    },
    {
      id: "stack",
      title: `${stack.name} runtime`,
      description: "Install the core SDKs, runtimes, and scaffolding.",
      commands: stackCommands[stack.id][osId],
    },
    {
      id: "tools",
      title: "Developer tools",
      description: "Install selected editors, CLIs, and supporting apps.",
      commands: uniqueToolCommands.length
        ? uniqueToolCommands
        : ["echo \"Select tools to generate install commands\""],
    },
    {
      id: "environment",
      title: "Environment configuration",
      description: "Prepare environment variables, shells, and defaults.",
      commands: [
        "mkdir -p ~/.config/setupstack",
        "echo \"export EDITOR=code\" >> ~/.config/setupstack/env",
        "source ~/.config/setupstack/env",
      ],
    },
    {
      id: "verify",
      title: "Verify setup",
      description: "Confirm versions and validate the install.",
      commands: verificationCommands[stack.id],
    },
  ];
}

export function buildMarkdownExport({
  stackName,
  osName,
  tools,
  sections,
  estimatedTime,
}: {
  stackName: string;
  osName: string;
  tools: Tool[];
  sections: SetupSection[];
  estimatedTime: string;
}) {
  const toolList = tools.length
    ? tools.map((tool) => `- ${tool.name}`).join("\n")
    : "- No tools selected";

  const sectionMarkdown = sections
    .map((section) => {
      const commands = section.commands.join("\n");
      return `## ${section.title}\n${section.description}\n\n\`\`\`bash\n${commands}\n\`\`\``;
    })
    .join("\n\n");

  return `# SetupStack Guide\n\n**Stack:** ${stackName}\n**OS:** ${osName}\n**Estimated setup time:** ${estimatedTime}\n\n## Selected tools\n${toolList}\n\n${sectionMarkdown}\n`;
}

export function buildGuideCopy({
  stackName,
  osName,
  tools,
  sections,
  estimatedTime,
  installLabel,
  installCommands,
  troubleshooting,
}: {
  stackName: string;
  osName: string;
  tools: Tool[];
  sections: SetupSection[];
  estimatedTime: string;
  installLabel?: string;
  installCommands?: string[];
  troubleshooting?: TroubleshootingItem[] | null;
}) {
  const toolList = tools.length
    ? tools.map((tool) => `- ${tool.name}`).join("\n")
    : "- No tools selected";

  const installBlock =
    installCommands && installCommands.length
      ? `## Install script (${installLabel ?? "Install"})\n\n\`\`\`bash\n${installCommands.join(
          "\n"
        )}\n\`\`\``
      : "";

  const sectionMarkdown = sections
    .map((section) => {
      const commands = section.commands.join("\n");
      return `## ${section.title}\n${section.description}\n\n\`\`\`bash\n${commands}\n\`\`\``;
    })
    .join("\n\n");

  const troubleshootingBlock =
    troubleshooting && troubleshooting.length
      ? `## Troubleshooting\n\n${troubleshooting
          .map((item) => {
            const commands = item.fix.join("\n");
            return `### ${item.issue}\nCause: ${item.cause}\n\n\`\`\`bash\n${commands}\n\`\`\``;
          })
          .join("\n\n")}`
      : "";

  return [
    "# SetupStack Guide",
    `**Stack:** ${stackName}\n**OS:** ${osName}\n**Estimated setup time:** ${estimatedTime}`,
    `## Selected tools\n${toolList}`,
    installBlock,
    sectionMarkdown,
    troubleshootingBlock,
  ]
    .filter(Boolean)
    .join("\n\n")
    .concat("\n");
}

export async function copyToClipboard(text: string) {
  if (typeof window === "undefined") {
    throw new Error("Clipboard is unavailable in this environment.");
  }

  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  if (typeof document.execCommand !== "function") {
    throw new Error("Clipboard API is unavailable.");
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-1000px";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  const success = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!success) {
    throw new Error("Clipboard copy failed.");
  }
}

export function sumEstimates(stack: Stack, tools: Tool[], base: number) {
  return stack.estimate + tools.reduce((acc, tool) => acc + tool.estimate, 0) + base;
}

export function getBaseEstimate(osId: OSId) {
  switch (osId) {
    case "macos":
      return 8;
    case "windows":
      return 10;
    case "linux":
      return 7;
  }
}
