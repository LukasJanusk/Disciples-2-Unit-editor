import { race } from "@/alias/race";
import type { Unit } from "@/types";

type Props = {
  units: Partial<Unit>[];
  onUnitSelect?: () => void;
};

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function formatRace(value: unknown): string {
  const raceId = formatValue(value);

  if (raceId === "-") {
    return raceId;
  }

  return race[raceId as keyof typeof race] ?? raceId;
}

export default function UnitList({ units, onUnitSelect }: Props) {
  if (units.length === 0) {
    return <div className="rounded-md border border-gray-200 bg-white p-4 text-sm text-gray-500">No units available</div>;
  }

  return (
    <div className="h-full w-full overflow-hidden rounded-md border border-gray-200 bg-white">
      <ul className="divide-y divide-gray-200">
        {units.map((unit, index) => {
          const itemKey = `${String(unit.unit_id ?? unit.name ?? "unit")}-${index}`;

          return (
            <li className="px-4 py-4" key={itemKey} onClick={() => onUnitSelect?.()}>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-gray-900">{formatValue(unit.name ?? unit.unit_id)}</p>
                <p className="text-sm text-gray-500">{formatValue(unit.unit_id)}</p>
                <p className="text-sm text-gray-500">{formatRace(unit.race_id)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
