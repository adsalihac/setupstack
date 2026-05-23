import type { OSId, OSOption, Stack, StackId, Tool, ToolId } from "./types";

export const stacks: Stack[] = [
  {
    id: "expo",
    name: "Expo",
    description: "Rapid React Native workflows with managed tooling.",
    short: "EX",
    estimate: 18,
  },
  {
    id: "react-native",
    name: "React Native",
    description: "Native apps with a flexible JS runtime.",
    short: "RN",
    estimate: 28,
  },
  {
    id: "flutter",
    name: "Flutter",
    description: "Multi-platform UI toolkit with Dart.",
    short: "FL",
    estimate: 24,
  },
  {
    id: "node",
    name: "Node.js",
    description: "TypeScript-ready backend and tooling runtime.",
    short: "ND",
    estimate: 16,
  },
  {
    id: "python",
    name: "Python",
    description: "Data, scripting, and backend foundations.",
    short: "PY",
    estimate: 14,
  },
  {
    id: "go",
    name: "Go",
    description: "Fast, compiled services with simple tooling.",
    short: "GO",
    estimate: 18,
  },
  {
    id: "rust",
    name: "Rust",
    description: "Safe systems development and CLI tooling.",
    short: "RS",
    estimate: 22,
  },
];

export const operatingSystems: OSOption[] = [
  {
    id: "macos",
    name: "macOS",
    description: "Apple silicon and Intel setups.",
    short: "MAC",
  },
  {
    id: "windows",
    name: "Windows",
    description: "Windows 11/10 with modern tooling.",
    short: "WIN",
  },
  {
    id: "linux",
    name: "Linux",
    description: "Ubuntu or Debian-based environments.",
    short: "LNX",
  },
];

export const tools: Tool[] = [
  {
    id: "vscode",
    name: "VSCode",
    description: "Primary editor with extensions and settings sync.",
    category: "Editor",
    estimate: 6,
    install: {
      macos: ["brew install --cask visual-studio-code"],
      windows: ["winget install Microsoft.VisualStudioCode"],
      linux: ["sudo apt install -y code"],
    },
  },
  {
    id: "android-studio",
    name: "Android Studio",
    description: "Android SDKs, emulators, and build tools.",
    category: "Mobile",
    estimate: 12,
    install: {
      macos: ["brew install --cask android-studio"],
      windows: ["winget install Google.AndroidStudio"],
      linux: ["sudo apt install -y android-studio"],
    },
  },
  {
    id: "xcode",
    name: "Xcode",
    description: "iOS toolchain, simulators, and SDKs.",
    category: "Mobile",
    estimate: 14,
    install: {
      macos: ["xcode-select --install"],
      windows: ["echo \"Xcode is only available on macOS\""],
      linux: ["echo \"Xcode is only available on macOS\""],
    },
  },
  {
    id: "postman",
    name: "Postman",
    description: "API testing with environments and collections.",
    category: "API",
    estimate: 5,
    install: {
      macos: ["brew install --cask postman"],
      windows: ["winget install Postman.Postman"],
      linux: ["sudo apt install -y postman"],
    },
  },
  {
    id: "docker",
    name: "Docker",
    description: "Container runtime for local services.",
    category: "Infrastructure",
    estimate: 10,
    install: {
      macos: ["brew install --cask docker"],
      windows: ["winget install Docker.DockerDesktop"],
      linux: ["sudo apt install -y docker.io"],
    },
  },
  {
    id: "git",
    name: "Git",
    description: "Version control, SSH, and commit signing.",
    category: "Core",
    estimate: 4,
    install: {
      macos: ["brew install git"],
      windows: ["winget install Git.Git"],
      linux: ["sudo apt install -y git"],
    },
  },
  {
    id: "expo-orbit",
    name: "Expo Orbit",
    description: "Device previews and streamlining Expo workflows.",
    category: "Mobile",
    estimate: 6,
    install: {
      macos: ["brew install --cask expo-orbit"],
      windows: ["winget install Expo.Orbit"],
      linux: ["echo \"Expo Orbit is currently macOS/Windows only\""],
    },
  },
  {
    id: "warp",
    name: "Warp",
    description: "Modern terminal with smart workflows.",
    category: "Terminal",
    estimate: 4,
    install: {
      macos: ["brew install --cask warp"],
      windows: ["winget install Warp.Warp"],
      linux: ["sudo apt install -y warp-terminal"],
    },
  },
  {
    id: "github-desktop",
    name: "GitHub Desktop",
    description: "Visual Git client for managing repos, branches, and PRs.",
    category: "Core",
    estimate: 4,
    install: {
      macos: ["brew install --cask github"],
      windows: ["winget install GitHub.GitHubDesktop"],
      linux: [
        "wget -qO - https://apt.packages.shiftkey.dev/gpg.key | gpg --dearmor | sudo tee /usr/share/keyrings/shiftkey-packages.gpg > /dev/null",
        'echo "deb [arch=amd64 signed-by=/usr/share/keyrings/shiftkey-packages.gpg] https://apt.packages.shiftkey.dev/ubuntu/ any main" | sudo tee /etc/apt/sources.list.d/shiftkey-packages.list',
        "sudo apt update && sudo apt install github-desktop",
      ],
    },
  },
];

export const stackToolMap: Record<StackId, ToolId[]> = {
  expo: [
    "vscode",
    "android-studio",
    "xcode",
    "expo-orbit",
    "postman",
    "git",
    "github-desktop",
    "warp",
  ],
  "react-native": [
    "vscode",
    "android-studio",
    "xcode",
    "postman",
    "git",
    "github-desktop",
    "warp",
  ],
  flutter: ["vscode", "android-studio", "xcode", "postman", "git", "github-desktop", "warp"],
  node: ["vscode", "postman", "docker", "git", "github-desktop", "warp"],
  python: ["vscode", "postman", "docker", "git", "github-desktop", "warp"],
  go: ["vscode", "postman", "docker", "git", "github-desktop", "warp"],
  rust: ["vscode", "git", "github-desktop", "warp"],
};

export const stackCommands: Record<StackId, Record<OSId, string[]>> = {
  expo: {
    macos: [
      "brew install node@20",
      "npm create expo@latest my-expo-app",
      "cd my-expo-app",
    ],
    windows: [
      "winget install OpenJS.NodeJS.LTS",
      "npm create expo@latest my-expo-app",
      "cd my-expo-app",
    ],
    linux: [
      "curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -",
      "sudo apt install -y nodejs",
      "npm create expo@latest my-expo-app",
      "cd my-expo-app",
    ],
  },
  "react-native": {
    macos: [
      "brew install node@20 watchman",
      "npx react-native@latest init MyApp",
      "cd MyApp",
    ],
    windows: [
      "winget install OpenJS.NodeJS.LTS",
      "npx react-native@latest init MyApp",
      "cd MyApp",
    ],
    linux: [
      "sudo apt install -y nodejs npm",
      "npx react-native@latest init MyApp",
      "cd MyApp",
    ],
  },
  flutter: {
    macos: ["brew install --cask flutter", "flutter doctor"],
    windows: ["winget install Google.Flutter", "flutter doctor"],
    linux: ["sudo snap install flutter --classic", "flutter doctor"],
  },
  node: {
    macos: ["brew install node@20", "node -v"],
    windows: ["winget install OpenJS.NodeJS.LTS", "node -v"],
    linux: [
      "curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -",
      "sudo apt install -y nodejs",
      "node -v",
    ],
  },
  python: {
    macos: ["brew install python", "python3 -m venv .venv"],
    windows: ["winget install Python.Python.3.12", "py -3 -m venv .venv"],
    linux: ["sudo apt install -y python3 python3-venv", "python3 -m venv .venv"],
  },
  go: {
    macos: ["brew install go", "go env GOPATH"],
    windows: ["winget install GoLang.Go", "go env GOPATH"],
    linux: ["sudo apt install -y golang-go", "go env GOPATH"],
  },
  rust: {
    macos: [
      "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh",
      "rustc --version",
    ],
    windows: ["winget install Rustlang.Rustup", "rustc --version"],
    linux: [
      "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh",
      "rustc --version",
    ],
  },
};

export const baseSystemCommands: Record<OSId, string[]> = {
  macos: [
    "xcode-select --install",
    "brew update",
    "brew install git",
    "mkdir -p ~/Developer",
  ],
  windows: [
    "winget install Git.Git",
    "winget install Microsoft.PowerShell",
    "mkdir %USERPROFILE%\\Developer",
  ],
  linux: [
    "sudo apt update",
    "sudo apt install -y git curl build-essential",
    "mkdir -p ~/Developer",
  ],
};

export const verificationCommands: Record<StackId, string[]> = {
  expo: ["node -v", "npm -v", "npx expo --version"],
  "react-native": ["node -v", "npm -v", "npx react-native --version"],
  flutter: ["flutter --version", "dart --version"],
  node: ["node -v", "npm -v"],
  python: ["python3 --version", "pip3 --version"],
  go: ["go version"],
  rust: ["rustc --version", "cargo --version"],
};

export const toolLookup: Record<ToolId, Tool> = tools.reduce((acc, tool) => {
  acc[tool.id] = tool;
  return acc;
}, {} as Record<ToolId, Tool>);
