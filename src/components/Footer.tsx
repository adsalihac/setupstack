export function Footer() {
  return (
    <footer className="border-t border-zinc-200/70 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 text-sm text-zinc-500 lg:flex-row lg:items-center lg:px-8">
        <div>
          <p className="font-medium text-zinc-900">&copy; {new Date().getFullYear()} Setup Stack</p>
          <p>Modern setup guides for developer teams.</p>
        </div>
        <div className="text-xs text-zinc-500">
          <a
            href="https://buymeacoffee.com/adsalihac"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-black bg-black px-3 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-sm transition hover:border-neutral-700 hover:bg-neutral-900 dark:border-white dark:bg-black dark:text-white dark:hover:bg-neutral-800"
          >
            <span>☕</span>
            <span>Buy me a coffee</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
