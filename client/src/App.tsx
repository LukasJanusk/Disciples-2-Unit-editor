import { useState } from "react";
import { getUnits } from "@/api/https";
type Unit = {
  unit_id?: string;
  name?: string;
  [key: string]: unknown;
};

function App() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [error, setError] = useState("");

  const handleGetUnits = async () => {
    try {
      const loadedUnits = await getUnits();
      setUnits(loadedUnits);
      setError("");
    } catch (loadError) {
      setUnits([]);
      setError(loadError instanceof Error ? loadError.message : "Failed to load units");
    }
  };

  return (
    <>
      <div className="h-full w-full">
        <button onClick={handleGetUnits}>Get units</button>
        {error ? <div>{error}</div> : null}
        <div className="col">
          {units.length > 0 ? (
            units.map((unit) => (
              <div key={String(unit.unit_id ?? unit.name ?? JSON.stringify(unit))}>{String(unit.name ?? unit.unit_id ?? "Unnamed unit")}</div>
            ))
          ) : (
            <div>No units available</div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
