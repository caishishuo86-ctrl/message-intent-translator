import { cn } from "@/lib/utils";
import { identities, type Identity } from "@/types/analysis";

type Props = {
  value: Identity;
  onChange: (identity: Identity) => void;
};

export function ScenarioSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {identities.map((identity) => (
        <button
          key={identity}
          type="button"
          onClick={() => onChange(identity)}
          className={cn(
            "h-10 rounded-md border px-3 text-sm font-medium transition-colors",
            value === identity
              ? "border-zinc-950 bg-zinc-950 text-white"
              : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50",
          )}
        >
          {identity}
        </button>
      ))}
    </div>
  );
}
