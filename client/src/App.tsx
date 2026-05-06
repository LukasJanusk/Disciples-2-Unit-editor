import { useEffect, useState } from "react";

import { getUnitsData, getUnitsSearchList } from "@/api/https";
import { type Unit } from "@/types";
import Search from "./components/search/search";
import UnitDataTable from "./components/unitDataTable";
import UnitList from "./components/unitList";

function App() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [allSearchList, setAllSearchList] = useState<Partial<Unit>[]>([]);
  const [searchList, setSearchList] = useState<Partial<Unit>[]>([]);
  const [error, setError] = useState("");
  const [showData, setShowData] = useState(false);

  const handleGetUnits = async () => {
    try {
      setShowData(true);
      const loadedUnits = await getUnitsData();
      setUnits(loadedUnits);
      setError("");
    } catch (loadError) {
      setUnits([]);
      setShowData(false);
      setError(loadError instanceof Error ? loadError.message : "Failed to load units");
    }
  };

  useEffect(() => {
    const getUnitSearchList = async () => {
      try {
        const loadedSearchList = await getUnitsSearchList();
        setAllSearchList(loadedSearchList);
        setSearchList(loadedSearchList);
        setError("");
      } catch (loadError) {
        setAllSearchList([]);
        setSearchList([]);
        setError(loadError instanceof Error ? loadError.message : "Failed to load units search list");
      }
    };

    void getUnitSearchList();
  }, []);

  const handleSearchChange = (query: string, matches: string[]) => {
    const normalizedQuery = query.trim().toLowerCase();
    setShowData(false);

    if (!normalizedQuery) {
      setSearchList(allSearchList);
      return;
    }

    const matchedNames = new Set(matches.map((match) => match.toLowerCase()));
    setSearchList(
      allSearchList.filter((unit) => {
        const unitName = String(unit.name ?? "");
        const normalizedName = unitName.toLowerCase();
        return matchedNames.has(normalizedName) && normalizedName.includes(normalizedQuery);
      }),
    );
  };

  return (
    <>
      <div className="h-full w-full">
        <Search values={allSearchList.map((unit) => String(unit.name ?? ""))} onChange={handleSearchChange} />
        <button onClick={handleGetUnits}>Get units</button>
        {error ? <div>{error}</div> : null}
        {showData ? <UnitDataTable units={units} /> : <UnitList units={searchList} />}
      </div>
    </>
  );
}

export default App;
