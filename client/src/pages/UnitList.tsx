import { getUnitsSearchList } from "@/api/https";
import Content from "@/components/layout/Content";
import UnitList from "@/components/units/UnitList";
import { AppRouteSearchParam } from "@/routes";
import type { UnitSearchListItem } from "@/schema/unitSchema";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function UnitsListPage() {
  const [searchParams] = useSearchParams();
  const [units, setUnits] = useState<UnitSearchListItem[]>([]);

  const query = searchParams.get(AppRouteSearchParam.Query)?.trim().toLowerCase() ?? "";

  useEffect(() => {
    const getUnits = async () => {
      const loadedUnits = await getUnitsSearchList();
      setUnits(loadedUnits);
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
