# Setup Stack

**Setup Stack** is a clean, modern developer tool that generates tailored environment setup guides based on your chosen stack, operating system, and development tools.

Stop copy-pasting fragmented tutorials from different sources. SetupStack gives you a single, unified, production-ready setup guide in seconds — complete with terminal commands, install scripts, and a progress checklist.

---

## What It Does

1. **Select your stack** — Expo, React Native, Flutter, Node.js, Python, Go, Rust
2. **Select your OS** — macOS, Windows, or Linux
3. **Select your tools** — Only tools relevant to your stack are shown (e.g., Expo shows Android Studio, Xcode, Expo Orbit; Rust stays minimal)
4. **Get your guide** — A step-by-step setup guide is generated instantly with:
   - System foundations
   - Runtime & SDK installation
   - Developer tool setup
   - Environment configuration
   - Verification commands
   - Estimated setup time

### Key Features

- 📋 **Progress checklist** — Mark steps as done as you go
- 📦 **Install script generator** — Brew, Winget, or Apt one-liners for your selected tools
- 📄 **Export as Markdown or PDF** — Save and share your guide
- 💾 **LocalStorage persistence** — Your selections are saved automatically
- ⌨️ **Ctrl/Cmd + K** — Focus the tool search instantly
- 🔄 **Stack-aware tool filtering** — Switching stacks resets selections to keep guides clean

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Framework  | Next.js 16 (App Router)             |
| Language   | TypeScript                          |
| Styling    | Tailwind CSS v4                     |
| Animation  | Framer Motion                       |
| Fonts      | Geist Sans + Geist Mono             |

No UI component libraries. All components are custom-built with Tailwind CSS.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main app page (all steps)
│   ├── layout.tsx        # Root layout & metadata
│   ├── icon.svg          # App favicon/icon
│   └── globals.css       # Global styles & CSS variables
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── StackCard.tsx
│   ├── OSCard.tsx
│   ├── ToolCard.tsx
│   ├── CommandBlock.tsx
│   ├── SetupSection.tsx
│   ├── ProgressTracker.tsx
│   └── SearchBar.tsx
├── hooks/
│   └── useLocalStorage.ts
└── lib/
    ├── data.ts           # Stacks, OS options, tools, commands, stack-tool map
    ├── types.ts          # TypeScript types
    └── utils.ts          # Setup section builder, export, time estimator
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm, yarn, pnpm, or bun

### Installation

```bash
git clone https://github.com/adsalihac/setupstack.git
cd setupstack
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

---

## Contributing

Contributions are welcome and appreciated! Here's how to get involved:

### Ways to Contribute

- 🐛 **Bug reports** — Open an issue with steps to reproduce
- 💡 **Feature requests** — Open an issue describing the improvement
- 🔧 **Code contributions** — Fork, branch, and open a PR
- 📝 **New stacks or tools** — Add entries to `src/lib/data.ts`

### Adding a New Stack

1. Add the stack entry to the `stacks` array in `src/lib/data.ts`
2. Add its `StackId` to `src/lib/types.ts`
3. Add OS-specific commands to `stackCommands`
4. Add verification commands to `verificationCommands`
5. Add relevant tool IDs to `stackToolMap`

### Adding a New Tool

1. Add the tool entry to the `tools` array in `src/lib/data.ts`
2. Add its `ToolId` to `src/lib/types.ts`
3. Add the tool to relevant stacks in `stackToolMap`

### Pull Request Guidelines

- Keep PRs focused and small
- Follow the existing code style (TypeScript strict, no UI libraries)
- Run `npm run lint && npm run build` before opening a PR — both must pass
- Write a clear PR description explaining what and why

### Development Notes

- All components are in `src/components/` — no shadcn, no MUI, no Bootstrap
- State is managed with `useState` + `useLocalStorage` — no external state library
- The linter enforces `react-hooks/set-state-in-effect` — avoid calling `setState` directly inside `useEffect`

---

## License

MIT © [adsalihac](https://github.com/adsalihac)

