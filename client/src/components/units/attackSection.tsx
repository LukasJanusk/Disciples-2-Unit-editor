import { getGlobal } from "@/api/https";
import type { AttackData } from "@/schema/attackSchema";
import { attackReach } from "@/types/attackReach";
import { attackSource } from "@/types/attackSource";
import { useEffect, useState } from "react";

type Props = {
  attackData: AttackData | null;
  title: string;
};

function AttackSectionForm({ attackData }: Props) {
  const [localAttackData, setLocalAttackData] = useState<AttackData | null>(attackData);
  const [localDescription, setLocalDescription] = useState("");
  const [localName, setLocalName] = useState("");
  const descriptionTextId = localAttackData?.DESC_TXT ?? null;
  const nameTextId = localAttackData?.NAME_TXT ?? null;

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

  const handleSourceChange = (newSource: number) => {
    if (!localAttackData) {
      return;
    }
    setLocalAttackData({ ...localAttackData, SOURCE: newSource });
  };

  return (
    <div className="p-2">
      <form className="flex flex-col gap-2">
        <label htmlFor="attack-name">Name</label>
        <input className="bg-gray-100 rounded-md p-2" id="attack-name" value={localName} onChange={(e) => setLocalName(e.target.value)} />
        <label htmlFor="attack-description">Description</label>
        <textarea
          className="bg-gray-100 rounded-md p-2"
          id="attack-description"
          value={localDescription}
          onChange={(e) => setLocalDescription(e.target.value)}
        />
        {localAttackData?.SOURCE != null && (
          <section>
            <label htmlFor="attack-source">Source</label>
            <select
              id="attack-source"
              className="bg-gray-100 rounded-md p-2"
              value={localAttackData.SOURCE}
              onChange={(e) => handleSourceChange(Number(e.target.value))}
            >
              {Object.entries(attackSource).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </section>
        )}
        {localAttackData && localAttackData.QTY_DAM && localAttackData.QTY_DAM > 0 && (
          <>
            <label htmlFor="attack-damage">Damage</label>
            <input
              id="attack-damage"
              type="number"
              className="bg-gray-100 rounded-md p-2"
              value={localAttackData?.QTY_DAM ?? ""}
              onChange={(e) => {
                if (!localAttackData) {
                  return;
                }
                setLocalAttackData({ ...localAttackData, QTY_DAM: Number(e.target.value) });
              }}
            />
          </>
        )}
        {localAttackData && localAttackData.QTY_HEAL && localAttackData.QTY_HEAL > 0 && (
          <>
            <label htmlFor="attack-heal">Heal</label>
            <input
              id="attack-heal"
              type="number"
              className="bg-gray-100 rounded-md p-2"
              value={localAttackData?.QTY_HEAL ?? ""}
              onChange={(e) => {
                if (!localAttackData) {
                  return;
                }
                setLocalAttackData({ ...localAttackData, QTY_HEAL: Number(e.target.value) });
              }}
            />
          </>
        )}
        <label htmlFor="attack-accuracy">Hit chance</label>
        <input
          id="attack-accuracy"
          type="number"
          className="bg-gray-100 rounded-md p-2"
          value={localAttackData?.POWER ?? ""}
          onChange={(e) => {
            if (!localAttackData) {
              return;
            }
            setLocalAttackData({ ...localAttackData, POWER: Number(e.target.value) });
          }}
        />
        <label htmlFor="attack-initiative">Initiative</label>
        <input
          id="attack-initiative"
          type="number"
          className="bg-gray-100 rounded-md p-2"
          value={localAttackData?.INITIATIVE ?? ""}
          onChange={(e) => {
            if (!localAttackData) {
              return;
            }
            setLocalAttackData({ ...localAttackData, INITIATIVE: Number(e.target.value) });
          }}
        />
        <label htmlFor="attack-reach">Reach</label>
        <select
          id="attack-reach"
          className="bg-gray-100 rounded-md p-2"
          value={localAttackData?.REACH ?? ""}
          onChange={(e) => {
            if (!localAttackData) {
              return;
            }
            setLocalAttackData({ ...localAttackData, REACH: Number(e.target.value) });
          }}
        >
          <option value="">Select reach</option>
          {Object.entries(attackReach).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
        <div className="flex gap-2 justify-between">
          <label htmlFor="attack-infinite">Infinite</label>
          <input
            id="attack-infinite"
            type="checkbox"
            className="bg-gray-100 rounded-md p-2"
            checked={localAttackData?.INFINITE ?? false}
            onChange={(e) => {
              if (!localAttackData) {
                return;
              }
              setLocalAttackData({ ...localAttackData, INFINITE: e.target.checked });
            }}
          />
        </div>
        <div className="flex gap-2 justify-between">
          <label htmlFor="attack-critical">Critical hit</label>
          <input
            id="attack-critical"
            type="checkbox"
            className="bg-gray-100 rounded-md p-2"
            checked={localAttackData?.CRIT_HIT ?? false}
            onChange={(e) => {
              if (!localAttackData) {
                return;
              }
              setLocalAttackData({ ...localAttackData, CRIT_HIT: e.target.checked });
            }}
          />
        </div>
        {localAttackData?.ALT_ATTACK && <section></section>}
      </form>
    </div>
  );
}

export default function AttackSection({ attackData, title }: Props) {
  if (!attackData) {
    return null;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <AttackSectionForm key={attackData.ATT_ID} attackData={attackData} title={title} />
    </div>
  );
}
