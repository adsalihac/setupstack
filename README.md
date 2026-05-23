# SetupStack

SetupStack is a local-first setup guide generator for developer environments. Pick a stack, choose an operating system, select the tools you actually need, and the app builds a tailored step-by-step guide with commands, checks, and troubleshooting help.

It is designed to replace scattered setup notes with one focused workflow that is easy to follow, easy to export, and easy to revisit later.

## Features

SetupStack currently supports:

- Stack presets for Expo, React Native, Flutter, Node.js, Python, Go, and Rust
- Operating system selection for macOS, Windows, and Linux
- Stack-aware tool filtering so only relevant tools appear for the selected stack
- Runtime channel choice between LTS and Latest for supported stacks
- Auto-detected OS defaults when the browser can identify the platform
- Step-by-step setup sections for system foundations, runtime setup, tools, environment config, and verification
- Preflight checks to catch common issues before setup starts
- Stack-specific troubleshooting guides with suggested fixes and commands
- Install script generation for the selected tools on macOS, Windows, or Linux
- Markdown export and browser print/PDF export
- Progress tracking for setup steps
- Saved presets for reusing common configurations
- App case templates for frontend, backend, full-stack, and app-based workflows
- LocalStorage persistence for selections and presets
- Search with `Ctrl/Cmd + K` to jump into tool filtering quickly

## How It Works

1. Select a stack.
2. Select an operating system.
3. Pick the tools you want from the filtered list.
4. Review the generated guide, install commands, preflight checks, and troubleshooting notes.

The generated output includes setup sections, verification commands, and a time estimate based on the stack and selected tools.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Motion | Framer Motion |
| Icons | react-icons |

All UI is custom-built in this repository. There is no external component library.

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm

### Install

```bash
git clone https://github.com/adsalihac/setupstack.git
cd setupstack
npm install
```

### Run Locally

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Other Commands

```bash
npm run build
npm run start
npm run lint
```

## Project Structure

```
src/
├── app/          # App router entry, layout, and global styles
├── components/   # UI building blocks for the setup flow
├── hooks/        # LocalStorage helper hook
└── lib/          # Data, types, and setup/export utilities
```

## Contributing

Contributions are welcome. Good places to extend the app are:

- Add a new stack in `src/lib/data.ts` and `src/lib/types.ts`
- Add new tool definitions and stack mappings in `src/lib/data.ts`
- Adjust generated sections or export behavior in `src/lib/utils.ts`
- Improve the experience in `src/app/page.tsx` or the components under `src/components/`

Before opening a PR, run `npm run lint` and `npm run build`.

## License

MIT © [adsalihac](https://github.com/adsalihac)
