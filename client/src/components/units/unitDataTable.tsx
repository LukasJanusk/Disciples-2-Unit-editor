import type { Unit } from "@/schema/unitSchema";

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

type Props = {
  units: Unit[];
};

export default function UnitDataTable({ units }: Props) {
  const columns = units.length > 0 ? (Object.keys(units[0]) as Array<keyof Unit>) : [];

  return (
    <div className="flex h-full min-h-0 flex-col p-2">
      {units.length > 0 ? (
        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full border-separate border-spacing-x-2 border-spacing-y-0 text-left">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th className="sticky top-0 z-10 border border-gray-400 bg-gray-300 px-2 py-2 shadow-sm" key={String(column)}>
                    {String(column)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {units.map((unit, index) => (
                <tr key={`${String(unit.UNIT_ID ?? unit.NAME_TXT ?? "unit")}-${index}`}>
                  {columns.map((column) => (
                    <td className="border border-gray-300 px-2 py-1 align-top" key={`${String(unit.UNIT_ID ?? unit.NAME_TXT ?? "unit")}-${String(column)}`}>
                      {formatCellValue(unit[column])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>No units available</div>
      )}
    </div>
  );
}
