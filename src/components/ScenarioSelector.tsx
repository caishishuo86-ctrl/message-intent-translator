import { cn } from "@/lib/utils";
import { scenarios, type Scenario } from "@/types/analysis";

type Props = {
  value: Scenario;
  onChange: (scenario: Scenario) => void;
};

export function ScenarioSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {scenarios.map((scenario) => (
        <button
          key={scenario}
          type="button"
          onClick={() => onChange(scenario)}
          className={cn(
            "h-10 rounded-md border px-3 text-sm font-medium transition-colors",
            value === scenario
              ? "border-zinc-950 bg-zinc-950 text-white"
              : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50",
          )}
        >
          {scenario}
        </button>
      ))}
    </div>
  );
}
