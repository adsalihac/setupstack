export function Footer() {
  return (
    <footer className="border-t border-zinc-200/70 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 text-sm text-zinc-500 lg:flex-row lg:items-center lg:px-8">
        <div>
          <p className="font-medium text-zinc-900">Setup Stack</p>
          <p>Modern setup guides for developer teams.</p>
        </div>
        <div className="text-xs text-zinc-500">
          © {new Date().getFullYear()}{" "}
          <a
            href="https://github.com/adsalihac"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-zinc-700 transition hover:text-zinc-900"
          >
            adsalihac
          </a>
        </div>
      </div>
    </footer>
  );
}
