import { UnitSchema, UnitSearchListSchema, UnitsSchema } from "@/schema/unitSchema";
import type { Unit, UnitSearchListItem } from "@/schema/unitSchema";
import type { AttackData, AttackResponse } from "@/schema/attackSchema";

export async function getUnitsData(): Promise<Unit[]> {
  const response = await fetch("/api/units/data");

  if (!response.ok) {
    throw new Error(`Failed to load units: ${response.status}`);
  }

  return UnitsSchema.parse(await response.json()) as Unit[];
}

export async function getUnitsSearchList(): Promise<UnitSearchListItem[]> {
  const response = await fetch("/api/units");

  if (!response.ok) {
    throw new Error(`Failed to load units search list: ${response.status}`);
  }

  return UnitSearchListSchema.parse(await response.json()) as UnitSearchListItem[];
}

export async function getUnit(unitId: string): Promise<Unit> {
  const response = await fetch(`/api/units/${unitId}`);

  if (!response.ok) {
    throw new Error(`Failed to load unit data: ${response.status}`);
  }

  return UnitSchema.parse(await response.json()) as Unit;
}

export async function updateUnit(unitId: string, updatedData: Partial<Unit>): Promise<Unit> {
  const data = { changes: updatedData };
  const response = await fetch(`/api/units/${unitId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update unit data: ${response.status}`);
  }
  return UnitSchema.parse(await response.json()) as Unit;
}

export async function getAttack(attackId: string): Promise<AttackResponse> {
  const response = await fetch(`/api/attacks/${attackId}`);

  if (!response.ok) {
    throw new Error(`Failed to load attack data: ${response.status}`);
  }

  return (await response.json()) as AttackResponse;
}

export async function updateAttack(attackId: string, updatedData: Partial<AttackData>): Promise<AttackResponse> {
  const data = { changes: updatedData };
  const response = await fetch(`/api/attacks/${attackId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update attack data: ${response.status}`);
  }
  return (await response.json()) as AttackResponse;
}

export async function getGlobal(globalId: string): Promise<string> {
  const response = await fetch(`/api/globals/${globalId}`);

  if (!response.ok) {
    throw new Error(`Failed to load global data: ${response.status}`);
  }

  return (await response.json()) as string;
}

export async function updateGlobal(globalId: string, newValue: string): Promise<string> {
  const response = await fetch(`/api/globals/${globalId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ new_value: newValue }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update global data: ${response.status}`);
  }
  return (await response.json()) as string;
}
