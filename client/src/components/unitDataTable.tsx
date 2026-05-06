import type { Unit } from "@/types";

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
    <div className="col">
      {units.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-x-2 border-spacing-y-0 text-left">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th className="border border-gray-400 px-5 py-3" key={String(column)}>
                    {String(column)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {units.map((unit, index) => (
                <tr key={`${String(unit.unit_id ?? unit.name ?? "unit")}-${index}`}>
                  {columns.map((column) => (
                    <td className="border border-gray-300 px-5 py-3 align-top" key={`${String(unit.unit_id ?? unit.name ?? "unit")}-${String(column)}`}>
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
