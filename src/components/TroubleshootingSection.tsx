"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TroubleshootingItem } from "@/lib/data";
import { CommandBlock } from "./CommandBlock";

type Props = {
  items: TroubleshootingItem[];
};

export function TroubleshootingSection({ items }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-zinc-50"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600 text-xs font-bold">
                !
              </span>
              <span className="text-sm font-medium text-zinc-900">{item.issue}</span>
            </div>
            <span
              className={`mt-0.5 shrink-0 text-zinc-400 transition-transform duration-200 ${
                open === i ? "rotate-180" : ""
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M3 5L7 9L11 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>

          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <div className="border-t border-zinc-100 px-5 pb-5 pt-4 space-y-3">
                  <p className="text-xs text-zinc-500">
                    <span className="font-semibold text-zinc-700">Cause: </span>
                    {item.cause}
                  </p>
                  <CommandBlock label="Fix" commands={item.fix} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
