import type { TroubleshootingItem } from "./data";
import type {
  CaseChecklistItem,
  OSId,
  PreflightCheck,
  RepoProfile,
  RuntimeChannel,
  SetupSection,
  Stack,
  TemplateNotes,
  Tool,
} from "./types";
import {
  androidEnvCommands,
  baseSystemCommands,
  stackCommands,
  stackLatestCommands,
  verificationCommands,
  zuluJdkCommands,
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

function getRuntimeCommands(stack: Stack, osId: OSId, channel: RuntimeChannel) {
  if (channel === "latest") {
    const latest = stackLatestCommands[stack.id];
    if (latest?.[osId]) return latest[osId];
  }
  return stackCommands[stack.id][osId];
}

function getSectionTips(stack: Stack, osId: OSId) {
  const systemTips: string[] = [];
  if (osId === "macos") {
    systemTips.push("If Homebrew is missing, install it from https://brew.sh first.");
  }
  if (osId === "windows") {
    systemTips.push("If Winget is missing, update App Installer from the Microsoft Store.");
  }
  if (osId === "linux") {
    systemTips.push("If apt is locked, re-run the command after any package updates finish.");
  }

  const stackTips: string[] = [];
  if (stack.id === "node" || stack.id === "expo" || stack.id === "react-native") {
    stackTips.push("If npm global installs fail with EACCES, use nvm or change your npm prefix.");
  }
  if (stack.id === "python") {
    stackTips.push("If venv creation fails, ensure the python-venv package is installed.");
  }
  if (stack.id === "flutter") {
    stackTips.push("If flutter doctor reports missing licenses, re-run flutter doctor --android-licenses.");
    stackTips.push("Run `flutter doctor` after Android env setup to confirm Android toolchain is detected.");
  }

  return {
    system: systemTips,
    stack: stackTips,
    tools: ["If a tool install fails, re-run the command with administrator permissions."],
    environment: ["If env changes don’t apply, restart the terminal or source your shell profile."],
    verify: ["If a version command fails, confirm the binary is on your PATH."],
  };
}

const ANDROID_ENV_STACKS = new Set(["expo", "react-native", "flutter"]);

export function buildSetupSections({
  stack,
  osId,
  tools,
  runtimeChannel,
}: {
  stack: Stack;
  osId: OSId;
  tools: Tool[];
  runtimeChannel: RuntimeChannel;
}): SetupSection[] {
  const toolCommands = tools.flatMap((tool) => tool.install[osId]);
  const uniqueToolCommands = Array.from(new Set(toolCommands));
  const tips = getSectionTips(stack, osId);

  const sections: SetupSection[] = [
    {
      id: "system",
      title: "System foundations",
      description: "Install base dependencies, shell tooling, and workspace.",
      commands: baseSystemCommands[osId],
      tips: tips.system,
    },
    {
      id: "stack",
      title: `${stack.name} runtime`,
      description: "Install the core SDKs, runtimes, and scaffolding.",
      commands: getRuntimeCommands(stack, osId, runtimeChannel),
      tips: tips.stack,
    },
    {
      id: "tools",
      title: "Developer tools",
      description: "Install selected editors, CLIs, and supporting apps.",
      commands: uniqueToolCommands.length
        ? uniqueToolCommands
        : ["echo \"Select tools to generate install commands\""],
      tips: tips.tools,
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
      tips: tips.environment,
    },
  ];

  if (ANDROID_ENV_STACKS.has(stack.id)) {
    const jdkCmds = (stack.id === "expo" || stack.id === "react-native")
      ? zuluJdkCommands[osId]
      : [];

    sections.push({
      id: "android",
      title: "Android environment",
      description: "Configure Android SDK paths and Java (JDK 17) for device/emulator builds.",
      commands: [...jdkCmds, ...androidEnvCommands[osId]],
      tips: [
        "Add the export lines to ~/.zshrc (macOS/zsh), ~/.bash_profile (macOS/bash), or ~/.bashrc (Linux).",
        "Run `source ~/.zshrc` (or your shell profile) to apply changes without reopening the terminal.",
        "ANDROID_HOME must point to your Android SDK location — install it via Android Studio if missing.",
        "Run `adb devices` to confirm platform-tools are on your PATH after reloading.",
      ],
    });
  }

  sections.push({
    id: "verify",
    title: "Verify setup",
    description: "Confirm versions and validate the install.",
    commands: verificationCommands[stack.id],
    tips: tips.verify,
  });

  return sections;
}

function formatNotesMarkdown(title: string, notes?: TemplateNotes) {
  if (!notes) return "";
  const summary = notes.summary.trim() || "Notes and references.";
  const links = notes.links ?? [];
  const linksBlock = links.length
    ? `\n\n${links.map((link) => `- [${link.label}](${link.url})`).join("\n")}`
    : "";
  return `## ${title}\n${summary}${linksBlock}`;
}

function formatNotesPlain(title: string, notes?: TemplateNotes) {
  if (!notes) return "";
  const summary = notes.summary.trim() || "Notes and references.";
  const links = notes.links ?? [];
  const linksBlock = links.length
    ? `\n${links.map((link) => `- ${link.label}: ${link.url}`).join("\n")}`
    : "";
  return `## ${title}\n${summary}${linksBlock}`;
}

function formatChecklistMarkdown(title: string, items?: CaseChecklistItem[]) {
  if (!items || !items.length) return "";
  return `## ${title}\n${items
    .map((item) => {
      const commands = item.commands.join("\n");
      return `### ${item.title}\n${item.description}\n\n\`\`\`bash\n${commands}\n\`\`\``;
    })
    .join("\n\n")}`;
}

function formatChecklistPlain(title: string, items?: CaseChecklistItem[]) {
  if (!items || !items.length) return "";
  return `## ${title}\n${items
    .map((item) => {
      const commands = item.commands.join("\n");
      return `### ${item.title}\n${item.description}\n\n\`\`\`bash\n${commands}\n\`\`\``;
    })
    .join("\n\n")}`;
}

function formatRepoProfileMarkdown(profile?: RepoProfile) {
  if (!profile) return "";
  const sources = profile.sources.length ? profile.sources.join(", ") : "repo files";
  const services = profile.services.length
    ? `\n\n**Services:** ${profile.services.join(", ")}`
    : "";
  const envKeys = profile.envKeys.length
    ? `\n\n**Env vars:**\n${profile.envKeys.map((key) => `- ${key}`).join("\n")}`
    : "";
  const notes = profile.notes.length
    ? `\n\n**Notes:**\n${profile.notes.map((note) => `- ${note}`).join("\n")}`
    : "";
  return `## Repo profile\nAuto-detected from ${sources}.${services}${envKeys}${notes}`;
}

function formatRepoProfilePlain(profile?: RepoProfile) {
  if (!profile) return "";
  const sources = profile.sources.length ? profile.sources.join(", ") : "repo files";
  const services = profile.services.length ? `\n\nServices: ${profile.services.join(", ")}` : "";
  const envKeys = profile.envKeys.length
    ? `\n\nEnv vars:\n${profile.envKeys.map((key) => `- ${key}`).join("\n")}`
    : "";
  const notes = profile.notes.length
    ? `\n\nNotes:\n${profile.notes.map((note) => `- ${note}`).join("\n")}`
    : "";
  return `## Repo profile\nAuto-detected from ${sources}.${services}${envKeys}${notes}`;
}

export function buildMarkdownExport({
  stackName,
  osName,
  tools,
  sections,
  estimatedTime,
  runtimeLabel,
  preflightChecks,
  caseNotes,
  caseChecklist,
  repoProfile,
}: {
  stackName: string;
  osName: string;
  tools: Tool[];
  sections: SetupSection[];
  estimatedTime: string;
  runtimeLabel?: string;
  preflightChecks?: PreflightCheck[];
  caseNotes?: TemplateNotes;
  caseChecklist?: CaseChecklistItem[];
  repoProfile?: RepoProfile;
}) {
  const toolList = tools.length
    ? tools.map((tool) => `- ${tool.name}`).join("\n")
    : "- No tools selected";

  const sectionMarkdown = sections
    .map((section) => {
      const commands = section.commands.join("\n");
      const tips = section.tips?.length ? `\n\n**Tips**\n${section.tips.map((tip) => `- ${tip}`).join("\n")}` : "";
      return `## ${section.title}\n${section.description}\n\n\`\`\`bash\n${commands}\n\`\`\`${tips}`;
    })
    .join("\n\n");

  const preflightMarkdown =
    preflightChecks && preflightChecks.length
      ? `## Preflight checklist\n${preflightChecks
          .map((check) => {
            const commands = check.commands.join("\n");
            return `### ${check.title}\n${check.description}\n\n\`\`\`bash\n${commands}\n\`\`\``;
          })
          .join("\n\n")}`
      : "";

  const caseNotesBlock = formatNotesMarkdown("Case notes", caseNotes);
  const caseChecklistBlock = formatChecklistMarkdown("Case checklist", caseChecklist);
  const repoProfileBlock = formatRepoProfileMarkdown(repoProfile);
  const guideBody = [
    repoProfileBlock,
    caseNotesBlock,
    caseChecklistBlock,
    preflightMarkdown,
    sectionMarkdown,
  ]
    .filter(Boolean)
    .join("\n\n");
  const runtimeLine = runtimeLabel ? `\n**Runtime channel:** ${runtimeLabel}` : "";
  return `# SetupStack Guide\n\n**Stack:** ${stackName}\n**OS:** ${osName}${runtimeLine}\n**Estimated setup time:** ${estimatedTime}\n\n## Selected tools\n${toolList}\n\n${guideBody}\n`;
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
  runtimeLabel,
  preflightChecks,
  caseNotes,
  caseChecklist,
  repoProfile,
}: {
  stackName: string;
  osName: string;
  tools: Tool[];
  sections: SetupSection[];
  estimatedTime: string;
  installLabel?: string;
  installCommands?: string[];
  troubleshooting?: TroubleshootingItem[] | null;
  runtimeLabel?: string;
  preflightChecks?: PreflightCheck[];
  caseNotes?: TemplateNotes;
  caseChecklist?: CaseChecklistItem[];
  repoProfile?: RepoProfile;
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
      const tips = section.tips?.length ? `\n\nTips:\n${section.tips.map((tip) => `- ${tip}`).join("\n")}` : "";
      return `## ${section.title}\n${section.description}\n\n\`\`\`bash\n${commands}\n\`\`\`${tips}`;
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

  const preflightBlock =
    preflightChecks && preflightChecks.length
      ? `## Preflight checklist\n\n${preflightChecks
          .map((check) => {
            const commands = check.commands.join("\n");
            return `### ${check.title}\n${check.description}\n\n\`\`\`bash\n${commands}\n\`\`\``;
          })
          .join("\n\n")}`
      : "";

  const caseNotesBlock = formatNotesPlain("Case notes", caseNotes);
  const caseChecklistBlock = formatChecklistPlain("Case checklist", caseChecklist);
  const repoProfileBlock = formatRepoProfilePlain(repoProfile);
  return [
    "# SetupStack Guide",
    `**Stack:** ${stackName}\n**OS:** ${osName}${
      runtimeLabel ? `\n**Runtime channel:** ${runtimeLabel}` : ""
    }\n**Estimated setup time:** ${estimatedTime}`,
    `## Selected tools\n${toolList}`,
    repoProfileBlock,
    caseNotesBlock,
    caseChecklistBlock,
    installBlock,
    preflightBlock,
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

export function detectOS(): OSId | null {
  if (typeof navigator === "undefined") return null;
  const platform = navigator.platform ?? "";
  const ua = navigator.userAgent ?? "";

  if (/Mac/i.test(platform)) return "macos";
  if (/Win/i.test(platform)) return "windows";
  if (/Linux/i.test(platform)) return "linux";
  if (/Android/i.test(ua)) return "linux";
  return null;
}

export function detectShell(osId: OSId | null) {
  if (!osId) return null;
  if (osId === "windows") return "PowerShell";
  if (osId === "macos") return "zsh";
  return "bash";
}

export function buildPreflightChecks({
  osId,
  stackId,
  tools,
}: {
  osId: OSId;
  stackId: Stack["id"];
  tools: Tool[];
}): PreflightCheck[] {
  const checks: PreflightCheck[] = [];

  const diskCommand =
    osId === "windows"
      ? "Get-PSDrive -PSProvider FileSystem"
      : "df -h /";

  checks.push({
    id: "disk-space",
    title: "Disk space",
    description: "Confirm you have enough free space for SDKs and emulators.",
    commands: [diskCommand],
  });

  const needsXcode =
    osId === "macos" && (stackId === "expo" || stackId === "react-native" || stackId === "flutter");
  if (needsXcode) {
    checks.push({
      id: "xcode-cli",
      title: "Xcode command line tools",
      description: "Required for iOS tooling and native builds.",
      commands: ["xcode-select -p", "xcode-select --install"],
    });
  }

  const needsVirtualization =
    tools.some((tool) => tool.id === "android-studio" || tool.id === "docker") ||
    stackId === "react-native" ||
    stackId === "expo";

  if (needsVirtualization) {
    const virtualizationCommand =
      osId === "windows"
        ? "systeminfo | findstr /i \"Virtualization\""
        : osId === "macos"
        ? "sysctl -a | grep -i hypervisor"
        : "egrep -c '(vmx|svm)' /proc/cpuinfo";

    checks.push({
      id: "virtualization",
      title: "Virtualization support",
      description: "Needed for Android emulators and Docker Desktop.",
      commands: [virtualizationCommand],
    });
  }

  return checks;
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
