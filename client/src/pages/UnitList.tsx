import { getUnitsSearchList } from "@/api/https";
import Content from "@/components/layout/Content";
import PageState from "@/components/layout/PageState";
import UnitList from "@/components/units/UnitList";
import { AppRouteSearchParam } from "@/routes";
import type { UnitSearchListItem } from "@/schema/unitSchema";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function UnitsListPage() {
  const [searchParams] = useSearchParams();
  const [units, setUnits] = useState<UnitSearchListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const query = searchParams.get(AppRouteSearchParam.Query)?.trim().toLowerCase() ?? "";

  useEffect(() => {
    const getUnits = async () => {
      setLoading(true);

      try {
        const loadedUnits = await getUnitsSearchList();
        setUnits(loadedUnits);
        setError("");
      } catch (loadError) {
        setUnits([]);
        setError(loadError instanceof Error ? loadError.message : "Failed to load units");
      } finally {
        setLoading(false);
      }
    };

    void getUnits();
  }, []);

  const retryLoadUnits = async () => {
    setLoading(true);

    try {
      const loadedUnits = await getUnitsSearchList();
      setUnits(loadedUnits);
      setError("");
    } catch (loadError) {
      setUnits([]);
      setError(loadError instanceof Error ? loadError.message : "Failed to load units");
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <Content>
        <PageState showLoader title="Loading units" description="Fetching the unit list for browsing and search." />
      </Content>
    );
  }

  if (error) {
    return (
      <Content>
        <PageState title="Unable to load units" description={error} actionLabel="Retry" onAction={() => void retryLoadUnits()} variant="error" />
      </Content>
    );
  }

  if (filteredUnits.length === 0) {
    return (
      <Content>
        <PageState
          title={query ? "No units match this search" : "No units available"}
          description={query ? "Try a different name or clear the current search query." : "Upload the required game files to populate the unit list."}
        />
      </Content>
    );
  }

  return (
    <Content>
      <UnitList units={filteredUnits} />
    </Content>
  );
}
