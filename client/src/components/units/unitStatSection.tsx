import { race } from "@/alias/race";
import { getGlobal } from "@/api/https";
import type { Unit } from "@/schema/unitSchema";
import { subrace } from "@/types/subrace";
import { useEffect, useState } from "react";

type Props = {
  unit: Unit;
  title: string;
};

function UnitSectionForm({ unit }: Props) {
  const [localUnitData, setLocalUnitData] = useState<Unit>(unit);
  const [localDescription, setLocalDescription] = useState("");
  const [localName, setLocalName] = useState("");
  const descriptionTextId = unit?.DESC_TXT ?? null;
  const nameTextId = unit?.NAME_TXT ?? null;

  useEffect(() => {
    const getDescription = async () => {
      if (!descriptionTextId) {
        return;
      }
      try {
        const description = await getGlobal(descriptionTextId);
        setLocalDescription(description);
      } catch (error) {
        console.error("Error loading attack description:", error);
      }
    };
    void getDescription();
  }, [descriptionTextId]);

  useEffect(() => {
    const getName = async () => {
      if (!nameTextId) {
        return;
      }
      try {
        const name = await getGlobal(nameTextId);
        setLocalName(name);
      } catch (error) {
        console.error("Error loading attack name:", error);
      }
    };
    void getName();
  }, [nameTextId]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission logic, e.g., send updated unit data to the server
    console.log("Updated unit data:", localUnitData);
  };

  return (
    <div className="p-2 max-w-96">
      <form className="flex flex-col gap-2">
        <p className="py-2">
          Unit id: <span className="bg-gray-100 rounded-md p-2">{unit.UNIT_ID}</span>
        </p>
        <div className="flex gap-2">
          <div className="py-2 flex flex-col gap-2">
            <div>Race:</div>
            <div className="bg-gray-100 rounded-md p-2">{race[localUnitData.RACE_ID as keyof typeof race]}</div>
          </div>
          <div className="py-2 flex flex-col gap-2">
            <div>Subrace:</div> <div className="bg-gray-100 rounded-md p-2">{subrace[localUnitData.SUBRACE as keyof typeof subrace]}</div>
          </div>
          <div className="flex flex-col gap-2 py-2">
            <div> Sex:</div> <div className="bg-gray-100 rounded-md p-2">{localUnitData.SEX_M ? "Male" : "Female"}</div>
          </div>
          <div className="py-2 flex flex-col gap-2">
            <div>Size:</div> <div className="bg-gray-100 rounded-md p-2">{localUnitData.SIZE_SMALL ? "Small" : "Large"}</div>
          </div>
        </div>

        <label htmlFor="attack-name">Name</label>
        <input className="bg-gray-100 rounded-md p-2" id="attack-name" value={localName} onChange={(e) => setLocalName(e.target.value)} />
        <label htmlFor="description">Description</label>
        <textarea
          className="bg-gray-100 rounded-md p-2 min-h-40"
          id="description"
          value={localDescription}
          onChange={(e) => setLocalDescription(e.target.value)}
        />
        <label htmlFor="armor">Armor</label>
        <input
          type="number"
          id="armor"
          className="bg-gray-100 rounded-md p-2"
          value={localUnitData.ARMOR ?? ""}
          onChange={(e) => {
            setLocalUnitData({ ...localUnitData, ARMOR: Number(e.target.value) });
          }}
        />
        <label htmlFor="hit-points">Hit Points</label>
        <input
          type="number"
          id="hit-points"
          className="bg-gray-100 rounded-md p-2"
          value={localUnitData.HIT_POINT ?? ""}
          onChange={(e) => {
            setLocalUnitData({ ...localUnitData, HIT_POINT: Number(e.target.value) });
          }}
        />
        <label htmlFor="regeneration">Regeneration</label>
        <input
          type="number"
          id="regeneration"
          className="bg-gray-100 rounded-md p-2"
          value={localUnitData.REGEN ?? ""}
          onChange={(e) => {
            setLocalUnitData({ ...localUnitData, REGEN: Number(e.target.value) });
          }}
        />
        <label htmlFor="xp-next">Experience next level</label>
        <input
          type="number"
          id="xp-next"
          className="bg-gray-100 rounded-md p-2"
          value={localUnitData.XP_NEXT ?? ""}
          onChange={(e) => {
            setLocalUnitData({ ...localUnitData, XP_NEXT: Number(e.target.value) });
          }}
        />
        <label htmlFor="xp-killed">Experience killed</label>
        <input
          type="number"
          id="xp-killed"
          className="bg-gray-100 rounded-md p-2"
          value={localUnitData.XP_KILLED ?? ""}
          onChange={(e) => {
            setLocalUnitData({ ...localUnitData, XP_KILLED: Number(e.target.value) });
          }}
        />
        <div className="flex gap-2 justify-between">
          <label htmlFor="double-attack">Double Attack</label>
          <input
            type="checkbox"
            id="double-attack"
            className="bg-gray-100 rounded-md p-2"
            checked={localUnitData.ATCK_TWICE ?? false}
            onChange={(e) => {
              setLocalUnitData({ ...localUnitData, ATCK_TWICE: e.target.checked });
            }}
          />
        </div>
      </form>
    </div>
  );
}

export default function UnitSection({ unit, title }: Props) {
  if (!unit) {
    return null;
  }

  return (
    <div className="rounded-md bg-gray-200 p-2">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <UnitSectionForm key={unit.UNIT_ID} unit={unit} title={title} />
    </div>
  );
}
