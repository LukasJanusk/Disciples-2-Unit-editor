import { getUnitsData } from "@/api/https";
import Content from "@/components/layout/Content";
import UnitDataTable from "@/components/units/unitDataTable";
import type { Unit } from "@/schema/unitSchema";
import { useState, useEffect } from "react";

export default function UnitDataListPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const getUnits = async () => {
      try {
        const loadedUnits = await getUnitsData();
        setUnits(loadedUnits);
        setError("");
      } catch (loadError) {
        setUnits([]);
        setError(loadError instanceof Error ? loadError.message : "Failed to load units");
      }
    };
    getUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const loadedUnits = await getUnitsData();
      setUnits(loadedUnits);
      setError("");
    } catch (loadError) {
      setUnits([]);
      setError(loadError instanceof Error ? loadError.message : "Failed to load units");
    }
  };

  if (error) {
    return (
      <Content>
        <div className="text-red-500 text-center mt-4 flex flex-col">
          <h1>Error occured!</h1>
          <p>{error}</p>
          <button onClick={fetchUnits} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Retry
          </button>
        </div>
      </Content>
    );
  }

  if (units.length === 0) {
    return (
      <Content>
        <div className="text-gray-500 text-center mt-4">No units available</div>
      </Content>
    );
  }
  return <UnitDataTable units={units} />;
}
