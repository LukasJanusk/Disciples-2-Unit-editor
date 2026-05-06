import type { Unit } from "@/types";

export async function getUnits(): Promise<Unit[]> {
  const response = await fetch("/api/units");

  if (!response.ok) {
    throw new Error(`Failed to load units: ${response.status}`);
  }

  return (await response.json()) as Unit[];
}
