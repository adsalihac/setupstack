import { motion } from "framer-motion";
import type { OSOption } from "@/lib/types";
import { cn } from "@/lib/utils";
import { osIcons } from "@/lib/icons";

type OSCardProps = {
  os: OSOption;
  selected: boolean;
  onSelect: (id: OSOption["id"]) => void;
};

export function OSCard({ os, selected, onSelect }: OSCardProps) {
  const Icon = osIcons[os.id];
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(os.id)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "w-full rounded-2xl border bg-white px-5 py-4 text-left shadow-[0_1px_0_rgba(16,24,40,0.04)] transition",
        selected
          ? "border-zinc-900/30 ring-1 ring-zinc-900/10"
          : "border-zinc-200 hover:border-zinc-300"
      )}
      aria-pressed={selected}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl border",
            selected
              ? "border-zinc-900/30 bg-zinc-900 text-white"
              : "border-zinc-200 bg-zinc-50 text-zinc-600"
          )}
        >
          <Icon size={22} />
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900">{os.name}</p>
          <p className="text-sm text-zinc-500">{os.description}</p>
        </div>
      </div>
    </motion.button>
  );
}

