import { Button } from "./Button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-900">
            SS
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900">SetupStack</p>
            <p className="text-xs text-zinc-500">Developer setup platform</p>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-zinc-600 md:flex">
          <a className="transition hover:text-zinc-900" href="#stacks">
            Stacks
          </a>
          <a className="transition hover:text-zinc-900" href="#tools">
            Tools
          </a>
          <a className="transition hover:text-zinc-900" href="#setup">
            Setup guide
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            Sign in
          </Button>
          <Button size="sm">Get Started</Button>
        </div>
      </div>
    </header>
  );
}
