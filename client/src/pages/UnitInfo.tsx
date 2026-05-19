import { getAttack, getUnit } from "@/api/https";
import Content from "@/components/layout/Content";
import PageState from "@/components/layout/PageState";
import AttackSection from "@/components/units/AttackSection";
import UnitSection from "@/components/units/UnitSection";
import type { AttackData } from "@/schema/attackSchema";
import type { Unit } from "@/schema/unitSchema";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UnitPortrait from "../components/units/UnitPortrait";

export default function UnitInfoPage() {
  const { id } = useParams<{ id: string }>();
  const unitId = id ?? "Unknown";
  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attack1Data, setAttack1Data] = useState<AttackData | null>(null);
  const [attack2Data, setAttack2Data] = useState<AttackData | null>(null);

  useEffect(() => {
    const loadUnitData = async () => {
      setLoading(true);
      try {
        const loadedUnitData = await getUnit(unitId);
        setUnit(loadedUnitData);
        setError("");
      } catch (error) {
        console.error("Failed to load unit data:", error);
        setUnit(null);
        setError(error instanceof Error ? error.message : "Failed to load unit data");
      } finally {
        setLoading(false);
      }
    };

    loadUnitData();
  }, [unitId]);

  useEffect(() => {
    if (!unit) {
      return;
    }
    const getAttackDataForUnit = async () => {
      try {
        const attack1ResponseData = await getAttack(unit.ATTACK_ID ?? "");
        const attack2ResponseData = await getAttack(unit.ATTACK2_ID ?? "");
        if (!attack1ResponseData.is_default) {
          setAttack1Data(attack1ResponseData.attack ?? null);
        }
        if (!attack2ResponseData.is_default) {
          setAttack2Data(attack2ResponseData.attack ?? null);
        }
      } catch (error) {
        console.error("Failed to load attack data:", error);
        setError(error instanceof Error ? error.message : "Failed to load attack data");
      }
    };

    if (unit) {
      getAttackDataForUnit();
    }
  }, [unit]);

  if (loading) {
    return (
      <Content>
        <PageState showLoader title="Loading unit details" description="Fetching the selected unit and its related data." />
      </Content>
    );
  }

  if (error) {
    return (
      <Content>
        <PageState title="Unable to load unit data" description={error} actionLabel="Retry" onAction={() => window.location.reload()} variant="error" />
      </Content>
    );
  }

  if (!unit) {
    return (
      <Content>
        <PageState title="Unit not found" description="The requested unit could not be found in the current data set." />
      </Content>
    );
  }

  return (
    <Content>
      <div className="h-full w-full overflow-x-auto rounded-md border border-gray-100 bg-white p-8">
        <div className="flex w-max min-w-full items-start gap-4">
          <UnitPortrait unitId={unitId} />
          <UnitSection unit={unit} title="Unit stats" />
          {attack1Data && <AttackSection attackData={attack1Data} title="Attack 1" />}
          {attack2Data && <AttackSection attackData={attack2Data} title="Attack 2" />}
        </div>
      </div>
    </Content>
  );
}
