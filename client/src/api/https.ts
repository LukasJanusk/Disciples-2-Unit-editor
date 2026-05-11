import { UnitSchema, UnitSearchListSchema, UnitsSchema } from "@/schema/unitSchema";
import type { Unit, UnitSearchListItem } from "@/schema/unitSchema";
import type { AttackData, AttackResponse } from "@/schema/attackSchema";
import { parseDBFUploadResponse, type DBFUploadResponse, type FileExistResponse } from "@/schema/files";
import type { DBFFileName } from "@/types/fileNames";

type ApiErrorPayload = {
  detail?: string;
  hint?: string;
};

async function createApiError(response: Response, fallbackMessage: string): Promise<Error> {
  let message = `${fallbackMessage}: ${response.status}`;

  try {
    const payload = (await response.json()) as ApiErrorPayload;
    if (typeof payload.detail === "string" && payload.detail.length > 0) {
      message = payload.detail;
      if (typeof payload.hint === "string" && payload.hint.length > 0) {
        message = `${message} ${payload.hint}`;
      }
    }
  } catch {
    // Ignore non-JSON error bodies and keep the fallback message.
  }

  return new Error(message);
}

export async function getUnitsData(): Promise<Unit[]> {
  const response = await fetch("/api/units/data");

  if (!response.ok) {
    throw await createApiError(response, "Failed to load units");
  }

  return UnitsSchema.parse(await response.json()) as Unit[];
}

export async function getUnitsSearchList(): Promise<UnitSearchListItem[]> {
  const response = await fetch("/api/units");

  if (!response.ok) {
    throw await createApiError(response, "Failed to load units search list");
  }

  return UnitSearchListSchema.parse(await response.json()) as UnitSearchListItem[];
}

export async function getUnit(unitId: string): Promise<Unit> {
  const response = await fetch(`/api/units/${unitId}`);

  if (!response.ok) {
    throw await createApiError(response, "Failed to load unit data");
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
    throw await createApiError(response, "Failed to update unit data");
  }
  return UnitSchema.parse(await response.json()) as Unit;
}

export async function getAttack(attackId: string): Promise<AttackResponse> {
  const response = await fetch(`/api/attacks/${attackId}`);

  if (!response.ok) {
    throw await createApiError(response, "Failed to load attack data");
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
    throw await createApiError(response, "Failed to update attack data");
  }
  return (await response.json()) as AttackResponse;
}

export async function getGlobal(globalId: string): Promise<string> {
  const response = await fetch(`/api/globals/${globalId}`);

  if (!response.ok) {
    throw await createApiError(response, "Failed to load global data");
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
    throw await createApiError(response, "Failed to update global data");
  }
  return (await response.json()) as string;
}

export async function uploadDbf(file: File, type: DBFFileName): Promise<DBFUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`/api/files/${type}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw await createApiError(response, `Failed to upload ${type} DBF file`);
  }

  return parseDBFUploadResponse(await response.json());
}

export function downloadDbf(type: DBFFileName): void {
  const link = document.createElement("a");
  link.href = `/api/files/${type}/download`;
  link.download = `${type}.dbf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function checkFilesExist(): Promise<FileExistResponse> {
  const response = await fetch("/api/files/exist");

  if (!response.ok) {
    throw await createApiError(response, "Failed to check files existence");
  }

  return (await response.json()) as FileExistResponse;
}

export async function deleteFile(type: DBFFileName): Promise<void> {
  const response = await fetch(`/api/files/${type}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw await createApiError(response, `Failed to delete ${type} DBF file`);
  }
}
