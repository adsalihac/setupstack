export type OSId = "macos" | "windows" | "linux";

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
  | "docker"
  | "git"
  | "expo-orbit"
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
