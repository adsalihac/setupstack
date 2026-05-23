import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SearchBarProps = InputHTMLAttributes<HTMLInputElement> & {
  hint?: string;
};

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, hint = "CTRL K", ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-2",
          className
        )}
      >
        <span className="text-[10px] font-semibold tracking-[0.2em] text-zinc-400">
          {hint}
        </span>
        <input
          ref={ref}
          className="w-full bg-transparent text-sm text-zinc-700 outline-none placeholder:text-zinc-400"
          {...props}
        />
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";
