import Image from "next/image";
import { Button } from "./Button";

export function Navbar() {
  const handleGetStarted = () => {
    document.getElementById("stacks")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="SetupStack logo"
            width={36}
            height={36}
            className="h-9 w-9"
            priority
          />
          <div>
            <p className="text-sm font-semibold text-zinc-900">Setup Stack</p>
            <p className="text-xs text-zinc-500">Developer setup platform</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" onClick={handleGetStarted}>
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}
