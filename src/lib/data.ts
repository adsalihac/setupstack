import type { CaseTemplate, OSId, OSOption, Stack, StackId, Tool, ToolId } from "./types";

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
    id: "insomnia",
    name: "Insomnia",
    description: "REST and GraphQL API client for local testing.",
    category: "API",
    estimate: 4,
    install: {
      macos: ["brew install --cask insomnia"],
      windows: ["winget install Insomnia.Insomnia"],
      linux: ["sudo snap install insomnia"],
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
    id: "postgres",
    name: "PostgreSQL",
    description: "Relational database for backend and analytics workloads.",
    category: "Database",
    estimate: 8,
    install: {
      macos: ["brew install postgresql@16", "brew services start postgresql@16"],
      windows: ["winget install PostgreSQL.PostgreSQL"],
      linux: ["sudo apt install -y postgresql", "sudo systemctl enable --now postgresql"],
    },
  },
  {
    id: "redis",
    name: "Redis",
    description: "In-memory cache and queue for fast data access.",
    category: "Database",
    estimate: 6,
    install: {
      macos: ["brew install redis", "brew services start redis"],
      windows: ["echo \"Use WSL2 or Docker Desktop to run Redis on Windows\""],
      linux: ["sudo apt install -y redis-server", "sudo systemctl enable --now redis-server"],
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
    id: "eslint-prettier",
    name: "ESLint + Prettier",
    description: "Linting and formatting defaults for teams.",
    category: "Quality",
    estimate: 4,
    install: {
      macos: ["npm install -D eslint prettier eslint-config-prettier eslint-plugin-import"],
      windows: ["npm install -D eslint prettier eslint-config-prettier eslint-plugin-import"],
      linux: ["npm install -D eslint prettier eslint-config-prettier eslint-plugin-import"],
    },
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    description: "Utility-first styling with a shared design system.",
    category: "Frontend",
    estimate: 4,
    install: {
      macos: ["npm install -D tailwindcss postcss autoprefixer", "npx tailwindcss init -p"],
      windows: ["npm install -D tailwindcss postcss autoprefixer", "npx tailwindcss init -p"],
      linux: ["npm install -D tailwindcss postcss autoprefixer", "npx tailwindcss init -p"],
    },
  },
  {
    id: "storybook",
    name: "Storybook",
    description: "Component workbench for UI development.",
    category: "Frontend",
    estimate: 6,
    install: {
      macos: ["npx storybook@latest init"],
      windows: ["npx storybook@latest init"],
      linux: ["npx storybook@latest init"],
    },
  },
  {
    id: "vitest",
    name: "Vitest",
    description: "Fast unit tests for modern web projects.",
    category: "Testing",
    estimate: 4,
    install: {
      macos: ["npm install -D vitest", "npx vitest --run"],
      windows: ["npm install -D vitest", "npx vitest --run"],
      linux: ["npm install -D vitest", "npx vitest --run"],
    },
  },
  {
    id: "playwright",
    name: "Playwright",
    description: "End-to-end browser testing for critical flows.",
    category: "Testing",
    estimate: 6,
    install: {
      macos: ["npm install -D @playwright/test", "npx playwright install"],
      windows: ["npm install -D @playwright/test", "npx playwright install"],
      linux: ["npm install -D @playwright/test", "npx playwright install"],
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
  node: [
    "vscode",
    "postman",
    "insomnia",
    "docker",
    "postgres",
    "redis",
    "git",
    "github-desktop",
    "eslint-prettier",
    "tailwind",
    "storybook",
    "vitest",
    "playwright",
    "warp",
  ],
  python: [
    "vscode",
    "postman",
    "insomnia",
    "docker",
    "postgres",
    "redis",
    "git",
    "github-desktop",
    "warp",
  ],
  go: [
    "vscode",
    "postman",
    "insomnia",
    "docker",
    "postgres",
    "redis",
    "git",
    "github-desktop",
    "warp",
  ],
  rust: ["vscode", "git", "github-desktop", "warp"],
};

export const caseTemplates: CaseTemplate[] = [
  {
    id: "case-frontend-web",
    name: "Frontend web (React/Next/Vue)",
    description: "Vite or Next.js with Tailwind, Storybook, and modern tests.",
    category: "Frontend",
    stackId: "node",
    osId: "macos",
    tools: [
      "vscode",
      "git",
      "github-desktop",
      "warp",
      "eslint-prettier",
      "tailwind",
      "storybook",
      "vitest",
      "playwright",
    ],
    runtimeChannel: "lts",
    notes: {
      summary:
        "Pick React/Vue with Vite or Next.js, then layer in Tailwind, Storybook, and automated tests.",
      links: [
        { label: "Vite", url: "https://vite.dev" },
        { label: "Next.js", url: "https://nextjs.org/docs" },
        { label: "Vue", url: "https://vuejs.org/guide" },
        { label: "Tailwind CSS", url: "https://tailwindcss.com/docs" },
        { label: "Storybook", url: "https://storybook.js.org/docs" },
        { label: "Playwright", url: "https://playwright.dev/docs/intro" },
      ],
    },
    checklist: [
      {
        id: "frontend-scaffold",
        title: "Scaffold the app",
        description: "Choose one framework and initialize the project.",
        commands: [
          "npm create vite@latest my-app",
          "npx create-next-app@latest my-app",
          "npm create vue@latest my-app",
        ],
      },
      {
        id: "frontend-quality",
        title: "Build + test gates",
        description: "Run quality checks before shipping changes.",
        commands: ["npm run lint", "npm run test", "npm run build", "npx playwright test"],
      },
    ],
  },
  {
    id: "case-backend-node",
    name: "Backend API (Node.js)",
    description: "Postgres + Redis services with Docker and API tooling.",
    category: "Backend",
    stackId: "node",
    osId: "macos",
    tools: [
      "vscode",
      "git",
      "github-desktop",
      "warp",
      "docker",
      "postgres",
      "redis",
      "postman",
      "insomnia",
      "eslint-prettier",
      "vitest",
    ],
    runtimeChannel: "lts",
    notes: {
      summary:
        "Use Docker for local services, add migrations early, and wire observability (logs, traces, metrics).",
      links: [
        { label: "Docker Compose", url: "https://docs.docker.com/compose/" },
        { label: "Prisma Migrate", url: "https://www.prisma.io/docs/concepts/components/prisma-migrate" },
        { label: "OpenTelemetry JS", url: "https://opentelemetry.io/docs/instrumentation/js/" },
      ],
    },
    checklist: [
      {
        id: "backend-node-services",
        title: "Start local services",
        description: "Bring up databases for development.",
        commands: ["docker compose up -d postgres redis", "psql --version", "redis-cli --version"],
      },
      {
        id: "backend-node-migrations",
        title: "Run migrations",
        description: "Apply schema changes before starting the API.",
        commands: ["npm run migrate", "# Prisma: npx prisma migrate dev"],
      },
      {
        id: "backend-node-quality",
        title: "API health checks",
        description: "Validate build, lint, and tests.",
        commands: ["npm run lint", "npm run test", "npm run build"],
      },
    ],
  },
  {
    id: "case-backend-go",
    name: "Backend API (Go)",
    description: "Go services with Postgres/Redis and production-grade checks.",
    category: "Backend",
    stackId: "go",
    osId: "macos",
    tools: [
      "vscode",
      "git",
      "github-desktop",
      "warp",
      "docker",
      "postgres",
      "redis",
      "postman",
      "insomnia",
    ],
    runtimeChannel: "lts",
    notes: {
      summary: "Use goose or migrate for schema changes and add tracing/logging from day one.",
      links: [
        { label: "Goose", url: "https://github.com/pressly/goose" },
        { label: "golang-migrate", url: "https://github.com/golang-migrate/migrate" },
        { label: "OpenTelemetry Go", url: "https://opentelemetry.io/docs/instrumentation/go/" },
      ],
    },
    checklist: [
      {
        id: "backend-go-services",
        title: "Start local services",
        description: "Run databases before booting the API.",
        commands: ["docker compose up -d postgres redis", "psql --version", "redis-cli --version"],
      },
      {
        id: "backend-go-migrations",
        title: "Run migrations",
        description: "Apply schema updates before tests.",
        commands: ["goose up", "migrate -path ./migrations -database $DATABASE_URL up"],
      },
      {
        id: "backend-go-quality",
        title: "Build + test",
        description: "Run the standard Go checks.",
        commands: ["go test ./...", "go vet ./...", "go build ./..."],
      },
    ],
  },
  {
    id: "case-backend-python",
    name: "Backend API (Python)",
    description: "Python services with Postgres/Redis and migrations.",
    category: "Backend",
    stackId: "python",
    osId: "macos",
    tools: [
      "vscode",
      "git",
      "github-desktop",
      "warp",
      "docker",
      "postgres",
      "redis",
      "postman",
      "insomnia",
    ],
    runtimeChannel: "lts",
    notes: {
      summary: "Use Alembic or Django migrations and keep observability in the base template.",
      links: [
        { label: "Alembic", url: "https://alembic.sqlalchemy.org/en/latest/" },
        { label: "Django Migrations", url: "https://docs.djangoproject.com/en/stable/topics/migrations/" },
        { label: "OpenTelemetry Python", url: "https://opentelemetry.io/docs/instrumentation/python/" },
      ],
    },
    checklist: [
      {
        id: "backend-python-services",
        title: "Start local services",
        description: "Spin up data stores before running the API.",
        commands: ["docker compose up -d postgres redis", "psql --version", "redis-cli --version"],
      },
      {
        id: "backend-python-migrations",
        title: "Run migrations",
        description: "Apply schema changes for the API.",
        commands: ["alembic upgrade head", "# Django: python manage.py migrate"],
      },
      {
        id: "backend-python-quality",
        title: "Tests + packaging",
        description: "Validate the service locally.",
        commands: ["python -m pip install -r requirements.txt", "pytest", "python -m build"],
      },
    ],
  },
  {
    id: "case-fullstack-saas",
    name: "Full-stack SaaS",
    description: "Web app + API + background jobs with shared envs.",
    category: "Full-stack",
    stackId: "node",
    osId: "macos",
    tools: [
      "vscode",
      "git",
      "github-desktop",
      "warp",
      "docker",
      "postgres",
      "redis",
      "tailwind",
      "eslint-prettier",
      "vitest",
      "playwright",
    ],
    runtimeChannel: "lts",
    notes: {
      summary: "Keep env variables centralized, start services with Compose, and run full test suites.",
      links: [
        { label: "Twelve-Factor App", url: "https://12factor.net/" },
        { label: "Docker Compose", url: "https://docs.docker.com/compose/" },
      ],
    },
    checklist: [
      {
        id: "fullstack-saas-services",
        title: "Start local services",
        description: "Bring up databases and queues.",
        commands: ["docker compose up -d postgres redis"],
      },
      {
        id: "fullstack-saas-quality",
        title: "Web + API checks",
        description: "Run the main quality gates.",
        commands: ["npm run lint", "npm run test", "npm run build", "npx playwright test"],
      },
    ],
  },
  {
    id: "case-fullstack-ecommerce",
    name: "Full-stack e-commerce",
    description: "Storefront, admin, payments, and search workflows.",
    category: "Full-stack",
    stackId: "node",
    osId: "macos",
    tools: [
      "vscode",
      "git",
      "github-desktop",
      "warp",
      "docker",
      "postgres",
      "redis",
      "tailwind",
      "storybook",
      "playwright",
    ],
    runtimeChannel: "lts",
    notes: {
      summary: "Plan for inventory sync, payment webhooks, and search indexing.",
      links: [
        { label: "Stripe Webhooks", url: "https://stripe.com/docs/webhooks" },
        { label: "Algolia Docs", url: "https://www.algolia.com/doc/" },
      ],
    },
    checklist: [
      {
        id: "fullstack-ecommerce-services",
        title: "Start local services",
        description: "Run databases and cache for storefront flows.",
        commands: ["docker compose up -d postgres redis"],
      },
      {
        id: "fullstack-ecommerce-quality",
        title: "Checkout smoke tests",
        description: "Validate critical customer journeys.",
        commands: ["npm run test", "npx playwright test"],
      },
    ],
  },
  {
    id: "case-fullstack-mobile-api",
    name: "Full-stack mobile API",
    description: "API + auth + push notifications for mobile clients.",
    category: "Full-stack",
    stackId: "node",
    osId: "macos",
    tools: ["vscode", "git", "github-desktop", "warp", "docker", "postgres", "redis", "postman", "insomnia"],
    runtimeChannel: "lts",
    notes: {
      summary: "Keep auth, device tokens, and background jobs documented for the mobile team.",
      links: [
        { label: "Firebase Cloud Messaging", url: "https://firebase.google.com/docs/cloud-messaging" },
      ],
    },
    checklist: [
      {
        id: "fullstack-mobile-services",
        title: "Start local services",
        description: "Bring up storage and queues for the API.",
        commands: ["docker compose up -d postgres redis"],
      },
      {
        id: "fullstack-mobile-quality",
        title: "API smoke tests",
        description: "Check readiness before app integration.",
        commands: ["npm run test", "npm run dev"],
      },
    ],
  },
  {
    id: "case-fullstack-internal-tools",
    name: "Full-stack internal tools",
    description: "Admin dashboards and internal APIs with fast iterations.",
    category: "Full-stack",
    stackId: "python",
    osId: "macos",
    tools: ["vscode", "git", "github-desktop", "warp", "docker", "postgres", "redis", "postman", "insomnia"],
    runtimeChannel: "lts",
    notes: {
      summary: "Document access controls, seeded data, and admin workflows.",
      links: [
        { label: "Django Admin", url: "https://docs.djangoproject.com/en/stable/ref/contrib/admin/" },
      ],
    },
    checklist: [
      {
        id: "internal-tools-services",
        title: "Start local services",
        description: "Run dependencies for admin tools.",
        commands: ["docker compose up -d postgres redis"],
      },
      {
        id: "internal-tools-migrations",
        title: "Apply migrations",
        description: "Keep schema in sync before launching.",
        commands: ["python manage.py migrate", "python manage.py createsuperuser"],
      },
    ],
  },
  {
    id: "case-cli-rust",
    name: "CLI tool (Rust)",
    description: "Fast developer tooling and distribution-friendly binaries.",
    category: "App-based",
    stackId: "rust",
    osId: "macos",
    tools: ["vscode", "git", "github-desktop", "warp"],
    runtimeChannel: "lts",
    notes: {
      summary: "Use clap for CLI parsing and create release builds early.",
      links: [
        { label: "clap", url: "https://docs.rs/clap/latest/clap/" },
        { label: "cargo-dist", url: "https://opensource.axo.dev/cargo-dist/" },
      ],
    },
    checklist: [
      {
        id: "cli-rust-build",
        title: "Build + test",
        description: "Validate the CLI before distributing.",
        commands: ["cargo test", "cargo build --release", "cargo install --path ."],
      },
    ],
  },
  {
    id: "case-data-pipeline",
    name: "Data pipeline (Python)",
    description: "ETL jobs with scheduled runs and structured logging.",
    category: "App-based",
    stackId: "python",
    osId: "macos",
    tools: ["vscode", "git", "github-desktop", "warp", "docker", "postgres"],
    runtimeChannel: "lts",
    notes: {
      summary: "Define data sources, destination schemas, and retry policies upfront.",
      links: [
        { label: "Airflow", url: "https://airflow.apache.org/docs/" },
        { label: "Dagster", url: "https://docs.dagster.io/" },
      ],
    },
    checklist: [
      {
        id: "data-pipeline-checks",
        title: "Pipeline checks",
        description: "Run the pipeline locally before scheduling.",
        commands: ["python -m pip install -r requirements.txt", "pytest", "python pipeline.py --dry-run"],
      },
    ],
  },
  {
    id: "case-ml-service",
    name: "ML service (Python)",
    description: "Model serving with validation, metrics, and deployments.",
    category: "App-based",
    stackId: "python",
    osId: "macos",
    tools: ["vscode", "git", "github-desktop", "warp", "docker", "redis"],
    runtimeChannel: "lts",
    notes: {
      summary: "Track model versions, evaluate performance, and log predictions.",
      links: [
        { label: "MLflow", url: "https://mlflow.org/docs/latest/index.html" },
        { label: "FastAPI", url: "https://fastapi.tiangolo.com/" },
      ],
    },
    checklist: [
      {
        id: "ml-service-checks",
        title: "Service checks",
        description: "Run the model server locally.",
        commands: [
          "python -m pip install -r requirements.txt",
          "pytest",
          "python -m uvicorn app:app --reload",
        ],
      },
    ],
  },
  {
    id: "case-iot-backend",
    name: "IoT backend (Go)",
    description: "MQTT ingestion, device registry, and metrics pipelines.",
    category: "App-based",
    stackId: "go",
    osId: "macos",
    tools: ["vscode", "git", "github-desktop", "warp", "docker", "redis"],
    runtimeChannel: "lts",
    notes: {
      summary: "Document broker credentials and device provisioning flows.",
      links: [
        { label: "Mosquitto", url: "https://mosquitto.org/documentation/" },
      ],
    },
    checklist: [
      {
        id: "iot-backend-checks",
        title: "Broker + API checks",
        description: "Start broker and validate the service.",
        commands: ["docker compose up -d mosquitto redis", "go test ./...", "go build ./..."],
      },
    ],
  },
];

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
    macos: ["brew install python@3.12", "python3.12 -m venv .venv"],
    windows: ["winget install Python.Python.3.12", "py -3.12 -m venv .venv"],
    linux: ["sudo apt install -y python3.12 python3.12-venv", "python3.12 -m venv .venv"],
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

export const stackLatestCommands: Partial<Record<StackId, Record<OSId, string[]>>> = {
  expo: {
    macos: [
      "brew install node",
      "npm create expo@latest my-expo-app",
      "cd my-expo-app",
    ],
    windows: [
      "winget install OpenJS.NodeJS",
      "npm create expo@latest my-expo-app",
      "cd my-expo-app",
    ],
    linux: [
      "curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash -",
      "sudo apt install -y nodejs",
      "npm create expo@latest my-expo-app",
      "cd my-expo-app",
    ],
  },
  "react-native": {
    macos: [
      "brew install node watchman",
      "npx react-native@latest init MyApp",
      "cd MyApp",
    ],
    windows: [
      "winget install OpenJS.NodeJS",
      "npx react-native@latest init MyApp",
      "cd MyApp",
    ],
    linux: [
      "sudo apt install -y nodejs npm",
      "npx react-native@latest init MyApp",
      "cd MyApp",
    ],
  },
  node: {
    macos: ["brew install node", "node -v"],
    windows: ["winget install OpenJS.NodeJS", "node -v"],
    linux: [
      "curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash -",
      "sudo apt install -y nodejs",
      "node -v",
    ],
  },
  python: {
    macos: ["brew install python", "python3 -m venv .venv"],
    windows: ["winget install Python.Python.3.13", "py -3.13 -m venv .venv"],
    linux: ["sudo apt install -y python3 python3-venv", "python3 -m venv .venv"],
  },
};

/** Android SDK environment setup commands per OS, for mobile stacks */
export const androidEnvCommands: Record<OSId, string[]> = {
  macos: [
    "# Add to ~/.zprofile or ~/.zshrc (bash: ~/.bash_profile or ~/.bashrc)",
    "echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc",
    "echo 'export PATH=$PATH:$ANDROID_HOME/emulator' >> ~/.zshrc",
    "echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.zshrc",
    "source ~/.zshrc",
    "# Verify Android SDK tools are on PATH",
    "adb --version",
  ],
  windows: [
    "# Run in PowerShell as Administrator",
    '[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "$env:LOCALAPPDATA\\Android\\Sdk", "User")',
    '[System.Environment]::SetEnvironmentVariable("PATH", "$env:PATH;$env:LOCALAPPDATA\\Android\\Sdk\\emulator;$env:LOCALAPPDATA\\Android\\Sdk\\platform-tools", "User")',
    "# Restart PowerShell to reload PATH",
    "adb --version",
  ],
  linux: [
    "# Add to ~/.bashrc or ~/.bash_profile",
    "echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc",
    "echo 'export PATH=$PATH:$ANDROID_HOME/emulator' >> ~/.bashrc",
    "echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.bashrc",
    "source ~/.bashrc",
    "# Verify Android SDK tools are on PATH",
    "adb --version",
  ],
};

/** Zulu JDK 17 install commands (required for Expo and React Native on macOS) */
export const zuluJdkCommands: Record<OSId, string[]> = {
  macos: [
    "# Install Zulu JDK 17 (required for React Native / Expo Android builds)",
    "brew install --cask zulu@17",
    "echo 'export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home' >> ~/.zshrc",
    "source ~/.zshrc",
    "java -version",
  ],
  windows: [
    "# Install Eclipse Temurin JDK 17 (LTS) via winget",
    "winget install EclipseAdoptium.Temurin.17.JDK",
    "# JAVA_HOME is set automatically by the installer",
    "java -version",
  ],
  linux: [
    "# Install OpenJDK 17",
    "sudo apt install -y openjdk-17-jdk",
    "echo 'export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))' >> ~/.bashrc",
    "source ~/.bashrc",
    "java -version",
  ],
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
  expo: ["node -v", "npm -v", "npx expo --version", "java -version", "adb --version"],
  "react-native": ["node -v", "npm -v", "npx react-native --version", "java -version", "adb --version"],
  flutter: ["flutter --version", "dart --version", "adb --version"],
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
