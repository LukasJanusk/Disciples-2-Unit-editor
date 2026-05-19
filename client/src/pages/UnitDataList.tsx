import { getUnitsData } from "@/api/https";
import Content from "@/components/layout/Content";
import PageState from "@/components/layout/PageState";
import UnitDataTable from "@/components/units/UnitDataTable";
import type { Unit } from "@/schema/unitSchema";
import { useState, useEffect } from "react";

export default function UnitDataListPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getUnits = async () => {
      setLoading(true);

      try {
        const loadedUnits = await getUnitsData();
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

  const fetchUnits = async () => {
    setLoading(true);

    try {
      const loadedUnits = await getUnitsData();
      setUnits(loadedUnits);
      setError("");
    } catch (loadError) {
      setUnits([]);
      setError(loadError instanceof Error ? loadError.message : "Failed to load units");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Content fullWidth>
        <PageState showLoader title="Loading unit data" description="Reading the complete unit dataset for the table view." />
      </Content>
    );
  }

  if (error) {
    return (
      <Content fullWidth>
        <PageState title="Unable to load unit data" description={error} actionLabel="Retry" onAction={() => void fetchUnits()} variant="error" />
      </Content>
    );
  }

  if (units.length === 0) {
    return (
      <Content fullWidth>
        <PageState title="No unit data available" description="Upload the required game files to populate the raw data table." />
      </Content>
    );
  }

  return (
    <Content fullWidth>
      <UnitDataTable units={units} />
    </Content>
  );
}
