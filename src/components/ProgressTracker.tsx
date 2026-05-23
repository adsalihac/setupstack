import { cn } from "@/lib/utils";

type ProgressTrackerProps = {
  steps: Array<{ id: string; title: string }>;
  completed: string[];
  onToggle: (id: string) => void;
};

export function ProgressTracker({
  steps,
  completed,
  onToggle,
}: ProgressTrackerProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_1px_0_rgba(16,24,40,0.04)]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-zinc-900">Progress</p>
        <span className="text-xs text-zinc-500">
          {completed.length}/{steps.length} complete
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {steps.map((step) => {
          const isComplete = completed.includes(step.id);
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onToggle(step.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition",
                isComplete
                  ? "border-zinc-900/20 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
              )}
            >
              <span>{step.title}</span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                {isComplete ? "Done" : "Todo"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
