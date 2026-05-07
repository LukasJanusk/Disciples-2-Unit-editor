import { getUnitsSearchList } from "@/api/https";
import Content from "@/components/layout/Content";
import UnitList from "@/components/unitList";
import { AppRouteSearchParam } from "@/routes";
import type { Unit } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function UnitsListPage() {
  const [searchParams] = useSearchParams();
  const [units, setUnits] = useState<Partial<Unit>[]>([]);

  const query = searchParams.get(AppRouteSearchParam.Query)?.trim().toLowerCase() ?? "";

  useEffect(() => {
    const getUnits = async () => {
      const loadedUnits = await getUnitsSearchList();
      setUnits(loadedUnits as Partial<Unit>[]);
    };

    void getUnits();
  }, []);

  const filteredUnits = useMemo(() => {
    if (!query) {
      return units;
    }

    return units.filter((unit) =>
      String(unit.name ?? "")
        .toLowerCase()
        .includes(query),
    );
  }, [query, units]);

  return (
    <Content>
      <UnitList units={filteredUnits} />
    </Content>
  );
}
