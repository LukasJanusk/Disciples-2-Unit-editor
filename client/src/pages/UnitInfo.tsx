import { getAttack, getUnit } from "@/api/https";
import Content from "@/components/layout/Content";
import AttackSection from "@/components/units/attackSection";
import UnitSection from "@/components/units/unitStatSection";
import type { AttackData } from "@/schema/attackSchema";
import type { Unit } from "@/schema/unitSchema";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UnitPortrait from "../components/units/unitPortrait";

export default function UnitInfoPage() {
  const { id } = useParams<{ id: string }>();
  const unitId = id ?? "Unknown";
  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);
  const [attack1Data, setAttack1Data] = useState<AttackData | null>(null);
  const [attack2Data, setAttack2Data] = useState<AttackData | null>(null);

  useEffect(() => {
    const loadUnitData = async () => {
      setLoading(true);
      try {
        const loadedUnitData = await getUnit(unitId);
        setUnit(loadedUnitData);
      } catch (error) {
        console.error("Failed to load unit data:", error);
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
      }
    };

    if (unit) {
      getAttackDataForUnit();
    }
  }, [unit]);

  if (loading) {
    return (
      <Content>
        <div className="text-gray-500 text-center mt-4">Loading unit data...</div>
      </Content>
    );
  }
  return (
    <Content>
      <div className="overflow-x-auto p-8">
        <div className="flex w-max min-w-full items-start gap-4">
          <UnitPortrait unitId={unitId} />
          {unit && <UnitSection unit={unit} title="Unit stats" />}
          {attack1Data && <AttackSection attackData={attack1Data} title="Attack 1" />}
          {attack2Data && <AttackSection attackData={attack2Data} title="Attack 2" />}
        </div>
      </div>
    </Content>
  );
}
