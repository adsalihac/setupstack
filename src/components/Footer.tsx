export function Footer() {
  return (
    <footer className="border-t border-zinc-200/70 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 text-sm text-zinc-500 lg:flex-row lg:items-center lg:px-8">
        <div>
          <p className="font-medium text-zinc-900">SetupStack</p>
          <p>Modern setup guides for developer teams.</p>
        </div>
        <div className="flex flex-wrap gap-6 text-xs uppercase tracking-[0.18em] text-zinc-500">
          <span>Privacy</span>
          <span>Docs</span>
          <span>Status</span>
          <span>Contact</span>
        </div>
      </div>
    </footer>
  );
}
