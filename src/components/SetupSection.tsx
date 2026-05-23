import { Card } from "./Card";
import { CommandBlock } from "./CommandBlock";
import type { SetupSection as SetupSectionType } from "@/lib/types";

type SetupSectionProps = {
  section: SetupSectionType;
  index: number;
  total: number;
  id: string;
};

export function SetupSection({ section, index, total, id }: SetupSectionProps) {
  return (
    <Card id={id} className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
            Step {index} of {total}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-zinc-900">
            {section.title}
          </h3>
          <p className="mt-2 text-sm text-zinc-600">{section.description}</p>
        </div>
      </div>
      <div className="mt-5">
        <CommandBlock commands={section.commands} label="Commands" />
      </div>
    </Card>
  );
}
