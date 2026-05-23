export type OSId = "macos" | "windows" | "linux";
export type RuntimeChannel = "lts" | "latest";

export type StackId =
  | "expo"
  | "react-native"
  | "flutter"
  | "node"
  | "python"
  | "go"
  | "rust";

export type ToolId =
  | "vscode"
  | "android-studio"
  | "xcode"
  | "postman"
  | "insomnia"
  | "docker"
  | "postgres"
  | "redis"
  | "git"
  | "expo-orbit"
  | "eslint-prettier"
  | "tailwind"
  | "storybook"
  | "vitest"
  | "playwright"
  | "warp"
  | "github-desktop";

export type Stack = {
  id: StackId;
  name: string;
  description: string;
  short: string;
  estimate: number;
};

export type OSOption = {
  id: OSId;
  name: string;
  description: string;
  short: string;
};

export type Tool = {
  id: ToolId;
  name: string;
  description: string;
  category: string;
  estimate: number;
  install: Record<OSId, string[]>;
};

export type SetupSection = {
  id: string;
  title: string;
  description: string;
  commands: string[];
  tips?: string[];
};

export type PreflightCheck = {
  id: string;
  title: string;
  description: string;
  commands: string[];
};

export type TroubleshootingIssue = {
  id: string;
  title: string;
  symptom: string;
  fix: string;
  commands?: string[];
};

export type TroubleshootingGuide = {
  stackId: StackId;
  issues: TroubleshootingIssue[];
};

export type TemplateLink = {
  label: string;
  url: string;
};

export type TemplateNotes = {
  summary: string;
  links?: TemplateLink[];
};

export type CaseChecklistItem = {
  id: string;
  title: string;
  description: string;
  commands: string[];
};

export type CaseTemplate = {
  id: string;
  name: string;
  description: string;
  category: "Frontend" | "Backend" | "Full-stack" | "App-based";
  stackId: StackId;
  osId: OSId;
  tools: ToolId[];
  runtimeChannel: RuntimeChannel;
  notes?: TemplateNotes;
  checklist?: CaseChecklistItem[];
};
