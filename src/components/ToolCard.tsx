import { motion } from "framer-motion";
import type { Tool } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toolIcons } from "@/lib/icons";

type ToolCardProps = {
  tool: Tool;
  selected: boolean;
  onToggle: (id: Tool["id"]) => void;
};

export function ToolCard({ tool, selected, onToggle }: ToolCardProps) {
  const Icon = toolIcons[tool.id];
  return (
    <motion.button
      type="button"
      onClick={() => onToggle(tool.id)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "w-full rounded-2xl border bg-white px-4 py-4 text-left shadow-[0_1px_0_rgba(16,24,40,0.04)] transition",
        selected
          ? "border-zinc-900/30 ring-1 ring-zinc-900/10"
          : "border-zinc-200 hover:border-zinc-300"
      )}
      aria-pressed={selected}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
            selected
              ? "border-zinc-900/30 bg-zinc-900 text-white"
              : "border-zinc-200 bg-zinc-50 text-zinc-600"
          )}
        >
          <Icon size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-zinc-900">{tool.name}</p>
          <p className="text-xs text-zinc-500">{tool.description}</p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide",
            selected
              ? "border-zinc-900/30 bg-zinc-900 text-white"
              : "border-zinc-200 bg-zinc-50 text-zinc-500"
          )}
        >
          {tool.category}
        </span>
      </div>
    </motion.button>
  );
}

