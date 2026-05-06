import type { Unit } from "@/types";

export async function getUnitsData(): Promise<Unit[]> {
  const response = await fetch("/api/units/data");

  if (!response.ok) {
    throw new Error(`Failed to load units: ${response.status}`);
  }

  return (await response.json()) as Unit[];
}

export async function getUnitsSearchList(): Promise<Partial<Unit>[]> {
  const response = await fetch("/api/units");

  if (!response.ok) {
    throw new Error(`Failed to load units search list: ${response.status}`);
  }

  return (await response.json()) as Partial<Unit>[];
}
