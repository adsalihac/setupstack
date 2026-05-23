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

export type TroubleshootingItem = {
  issue: string;
  cause: string;
  fix: string[];
};

export const troubleshootingGuides: Record<StackId, TroubleshootingItem[]> = {
  expo: [
    {
      issue: "Metro bundler won't start or hangs",
      cause: "Stale cache or conflicting process on port 8081.",
      fix: [
        "npx expo start --clear",
        "npx react-native start --reset-cache",
        "lsof -ti:8081 | xargs kill -9",
      ],
    },
    {
      issue: "Expo Go can't connect to dev server",
      cause: "Phone and computer are on different networks, or firewall is blocking.",
      fix: [
        "# Ensure both devices are on the same Wi-Fi network",
        "npx expo start --tunnel",
        "# Or use USB connection: npx expo start --localhost",
      ],
    },
    {
      issue: "iOS build fails: CocoaPods error",
      cause: "Pods not installed or out of date after adding a new native module.",
      fix: [
        "cd ios && pod install --repo-update",
        "# If still failing, clean and reinstall",
        "cd ios && rm -rf Pods Podfile.lock && pod install",
      ],
    },
    {
      issue: "Android emulator not detected",
      cause: "ANDROID_HOME not set or emulator not running.",
      fix: [
        'export ANDROID_HOME=$HOME/Library/Android/sdk',
        'export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools',
        "# Start an emulator from Android Studio first",
        "adb devices",
      ],
    },
    {
      issue: "EAS build fails with missing credentials",
      cause: "Not logged in to Expo or missing app.json configuration.",
      fix: [
        "eas login",
        "eas credentials",
        "# Ensure app.json has a valid 'slug' and 'owner' field",
      ],
    },
    {
      issue: "Watchman error: too many files to watch",
      cause: "Default inotify limit too low on Linux.",
      fix: [
        "echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf",
        "sudo sysctl -p",
        "watchman watch-del-all",
      ],
    },
  ],
  "react-native": [
    {
      issue: "Metro bundler fails to resolve module",
      cause: "Broken node_modules or missing package.",
      fix: [
        "rm -rf node_modules && npm install",
        "npx react-native start --reset-cache",
      ],
    },
    {
      issue: "iOS build: 'Unable to boot simulator'",
      cause: "Xcode simulator runtime not installed.",
      fix: [
        "# Open Xcode → Preferences → Platforms and install the iOS runtime",
        "xcrun simctl list devices",
        "npx react-native run-ios --simulator='iPhone 15'",
      ],
    },
    {
      issue: "Android build: SDK location not found",
      cause: "ANDROID_HOME or local.properties missing.",
      fix: [
        'echo "sdk.dir=$HOME/Library/Android/sdk" > android/local.properties',
        'export ANDROID_HOME=$HOME/Library/Android/sdk',
        'export PATH=$PATH:$ANDROID_HOME/platform-tools',
      ],
    },
    {
      issue: "Gradle build fails: Java version mismatch",
      cause: "React Native requires Java 17 for newer versions.",
      fix: [
        "java -version",
        "# macOS: brew install openjdk@17",
        "# Set JAVA_HOME: export JAVA_HOME=$(/usr/libexec/java_home -v 17)",
      ],
    },
    {
      issue: "Red screen: 'Invariant Violation'",
      cause: "Native module not linked or app not rebuilt after native change.",
      fix: [
        "cd ios && pod install && cd ..",
        "npx react-native run-ios",
        "# For Android: cd android && ./gradlew clean && cd .. && npx react-native run-android",
      ],
    },
  ],
  flutter: [
    {
      issue: "flutter doctor reports issues",
      cause: "Missing dependencies, licenses not accepted, or SDK paths incorrect.",
      fix: [
        "flutter doctor -v",
        "flutter doctor --android-licenses",
        "# Accept all licenses with 'y'",
        "sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer",
      ],
    },
    {
      issue: "iOS build: CocoaPods not installed",
      cause: "CocoaPods is required for Flutter iOS builds.",
      fix: [
        "sudo gem install cocoapods",
        "cd ios && pod install",
        "pod --version",
      ],
    },
    {
      issue: "Android license not accepted",
      cause: "Android SDK licenses must be accepted before building.",
      fix: [
        "flutter doctor --android-licenses",
        "# If that fails:",
        "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses",
      ],
    },
    {
      issue: "'No devices found' when running flutter run",
      cause: "No emulator running or physical device not detected.",
      fix: [
        "flutter devices",
        "flutter emulators --launch <emulator_id>",
        "# For physical device: enable USB debugging in Developer Options",
        "adb devices",
      ],
    },
    {
      issue: "Pub get fails: SSL certificate error",
      cause: "Corporate proxy or VPN interfering with pub.dev.",
      fix: [
        "flutter pub cache clean",
        "flutter pub get",
        "# Behind a proxy: set PUB_HOSTED_URL and FLUTTER_STORAGE_BASE_URL",
      ],
    },
  ],
  node: [
    {
      issue: "nvm command not found after install",
      cause: "Shell profile not reloaded after nvm installation.",
      fix: [
        "source ~/.zshrc   # or source ~/.bashrc",
        "# Verify nvm in your shell profile:",
        'grep -n "nvm" ~/.zshrc',
        "nvm --version",
      ],
    },
    {
      issue: "EACCES: permission denied on npm install -g",
      cause: "npm global prefix points to a system directory.",
      fix: [
        "# Fix: use nvm (recommended) or change npm prefix",
        'mkdir ~/.npm-global',
        'npm config set prefix ~/.npm-global',
        'echo \'export PATH=~/.npm-global/bin:$PATH\' >> ~/.zshrc',
        "source ~/.zshrc",
      ],
    },
    {
      issue: "Port 3000 already in use",
      cause: "Another process is using the same port.",
      fix: [
        "lsof -ti:3000 | xargs kill -9",
        "# Or change your app port:",
        "PORT=3001 node server.js",
      ],
    },
    {
      issue: "node_modules/.bin not found / scripts not running",
      cause: "Corrupted node_modules or wrong Node version.",
      fix: [
        "rm -rf node_modules package-lock.json",
        "nvm use --lts",
        "npm install",
      ],
    },
    {
      issue: "TypeScript: Cannot find module or type declarations",
      cause: "Missing @types package or tsconfig path not configured.",
      fix: [
        "npm install -D @types/node @types/express",
        "# Verify tsconfig.json has 'moduleResolution: node'",
        "npx tsc --noEmit",
      ],
    },
  ],
  python: [
    {
      issue: "pyenv: command not found",
      cause: "pyenv not added to shell PATH or profile not reloaded.",
      fix: [
        'export PYENV_ROOT="$HOME/.pyenv"',
        'export PATH="$PYENV_ROOT/bin:$PATH"',
        'eval "$(pyenv init -)"',
        "source ~/.zshrc",
        "pyenv --version",
      ],
    },
    {
      issue: "pip SSL: certificate verify failed",
      cause: "macOS system Python has broken SSL certificates.",
      fix: [
        "# Run the certificate installer (macOS):",
        "open /Applications/Python*/Install\\ Certificates.command",
        "# Or upgrade pip:",
        "python3 -m pip install --upgrade pip certifi",
      ],
    },
    {
      issue: "Virtual environment not activating",
      cause: "Wrong activation command for your shell/OS.",
      fix: [
        "# macOS / Linux:",
        "python3 -m venv .venv && source .venv/bin/activate",
        "# Windows CMD:",
        ".venv\\Scripts\\activate.bat",
        "# Windows PowerShell:",
        ".venv\\Scripts\\Activate.ps1",
      ],
    },
    {
      issue: "Poetry: command not found after install",
      cause: "Poetry installs to ~/.local/bin which may not be in PATH.",
      fix: [
        'export PATH="$HOME/.local/bin:$PATH"',
        "source ~/.zshrc",
        "poetry --version",
      ],
    },
    {
      issue: "ModuleNotFoundError despite pip install",
      cause: "Installed into wrong Python environment or virtualenv not active.",
      fix: [
        "which python3   # verify you're in the right venv",
        "pip list | grep <package-name>",
        "# Activate venv first, then reinstall:",
        "source .venv/bin/activate && pip install <package>",
      ],
    },
  ],
  go: [
    {
      issue: "go: command not found",
      cause: "Go binary not in PATH after installation.",
      fix: [
        'export PATH=$PATH:/usr/local/go/bin',
        "source ~/.zshrc",
        "go version",
      ],
    },
    {
      issue: "go get: module lookup disabled by GONOSUMCHECK",
      cause: "Private module or GONOSUMCHECK/GONOSUMDB misconfigured.",
      fix: [
        "go env GONOSUMCHECK",
        "go env -w GONOSUMCHECK='*'",
        "# For private repos:",
        "go env -w GOPRIVATE='github.com/your-org/*'",
      ],
    },
    {
      issue: "Air: live reload not triggering",
      cause: "Air config not found or watching wrong directory.",
      fix: [
        "air init   # generate .air.toml",
        "# Edit .air.toml to set correct root and tmp_dir",
        "air -c .air.toml",
      ],
    },
    {
      issue: "CGO_ENABLED build error on Linux",
      cause: "CGO requires gcc which may not be installed.",
      fix: [
        "sudo apt install -y build-essential gcc",
        "CGO_ENABLED=1 go build ./...",
        "# To build without CGO: CGO_ENABLED=0 go build ./...",
      ],
    },
    {
      issue: "go test fails: database connection refused",
      cause: "Test requires a running database service.",
      fix: [
        "# Start PostgreSQL:",
        "brew services start postgresql@16   # macOS",
        "sudo systemctl start postgresql     # Linux",
        "# Use Docker for test databases:",
        "docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=test postgres:16",
      ],
    },
  ],
  rust: [
    {
      issue: "rustup: command not found",
      cause: "Cargo/rustup not added to PATH after installation.",
      fix: [
        "source $HOME/.cargo/env",
        'echo \'source $HOME/.cargo/env\' >> ~/.zshrc',
        "rustc --version && cargo --version",
      ],
    },
    {
      issue: "Linking error: linker 'cc' not found (Linux)",
      cause: "gcc/build-essential not installed.",
      fix: [
        "sudo apt install -y build-essential",
        "cargo build",
      ],
    },
    {
      issue: "Slow compile times",
      cause: "Incremental compilation cache cold or too many dependencies.",
      fix: [
        "# Use sccache to cache builds:",
        "cargo install sccache",
        'export RUSTC_WRAPPER=sccache',
        "# Use mold linker (Linux) for faster linking:",
        "sudo apt install mold",
        "# In .cargo/config.toml: [target.x86_64-unknown-linux-gnu] linker = 'clang' rustflags = [\"-C\", \"link-arg=-fuse-ld=mold\"]",
      ],
    },
    {
      issue: "error[E0597]: does not live long enough (borrow checker)",
      cause: "Lifetime issue — a reference outlives the value it points to.",
      fix: [
        "# Common fix: clone the value instead of borrowing",
        "let owned = borrowed_value.to_owned();",
        "# Or restructure to ensure the owner lives long enough",
        "# Read: https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html",
      ],
    },
    {
      issue: "cargo test: thread panicked",
      cause: "Test assertion failed or unwrap on None/Err.",
      fix: [
        "cargo test -- --nocapture   # show println! output",
        "cargo test -- --test-threads=1   # run tests serially",
        "RUST_BACKTRACE=1 cargo test   # full backtrace",
      ],
    },
  ],
};

