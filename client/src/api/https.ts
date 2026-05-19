import { UnitSchema, UnitSearchListSchema, UnitsSchema } from "@/schema/unitSchema";
import type { Unit, UnitSearchListItem } from "@/schema/unitSchema";
import type { AttackData, AttackResponse } from "@/schema/attackSchema";
import { parseDBFUploadResponse, type DBFUploadResponse, type FileExistResponse } from "@/schema/files";
import type { DBFFileName } from "@/types/fileNames";

type ApiErrorPayload = {
  detail?: string;
  hint?: string;
};

export const UNITS_SEARCH_LIST_CHANGED_EVENT = "units-search-list-changed";

export function notifyUnitsSearchListChanged(): void {
  window.dispatchEvent(new Event(UNITS_SEARCH_LIST_CHANGED_EVENT));
}

function getApiBaseUrl(): string {
  const configuredBaseUrl = window.desktopConfig?.apiBaseUrl;
  if (typeof configuredBaseUrl === "string" && configuredBaseUrl.length > 0) {
    return configuredBaseUrl.replace(/\/$/, "");
  }

  if (window.location.protocol === "file:") {
    return "http://127.0.0.1:8000";
  }

  return "/api";
}

const API_BASE_URL = getApiBaseUrl();

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
  const response = await fetch(`${API_BASE_URL}/units/data`);

  if (!response.ok) {
    throw await createApiError(response, "Failed to load units");
  }

  return UnitsSchema.parse(await response.json()) as Unit[];
}

export async function getUnitsSearchList(): Promise<UnitSearchListItem[]> {
  const response = await fetch(`${API_BASE_URL}/units`);

  if (!response.ok) {
    throw await createApiError(response, "Failed to load units search list");
  }

  return UnitSearchListSchema.parse(await response.json()) as UnitSearchListItem[];
}

export async function getUnit(unitId: string): Promise<Unit> {
  const response = await fetch(`${API_BASE_URL}/units/${unitId}`);

  if (!response.ok) {
    throw await createApiError(response, "Failed to load unit data");
  }

  return UnitSchema.parse(await response.json()) as Unit;
}

export async function updateUnit(unitId: string, updatedData: Partial<Unit>): Promise<Unit> {
  const data = { changes: updatedData };
  const response = await fetch(`${API_BASE_URL}/units/${unitId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw await createApiError(response, "Failed to update unit data");
  }

  const updatedUnit = UnitSchema.parse(await response.json()) as Unit;
  notifyUnitsSearchListChanged();
  return updatedUnit;
}

export async function getAttack(attackId: string): Promise<AttackResponse> {
  const response = await fetch(`${API_BASE_URL}/attacks/${attackId}`);

  if (!response.ok) {
    throw await createApiError(response, "Failed to load attack data");
  }

  return (await response.json()) as AttackResponse;
}

export async function updateAttack(attackId: string, updatedData: Partial<AttackData>): Promise<AttackResponse> {
  const data = { changes: updatedData };
  const response = await fetch(`${API_BASE_URL}/attacks/${attackId}`, {
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
  const response = await fetch(`${API_BASE_URL}/globals/${globalId}`);

  if (!response.ok) {
    throw await createApiError(response, "Failed to load global data");
  }

  return (await response.json()) as string;
}

export async function updateGlobal(globalId: string, newValue: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/globals/${globalId}`, {
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

  const response = await fetch(`${API_BASE_URL}/files/${type}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw await createApiError(response, `Failed to upload ${type} DBF file`);
  }

  const uploadResponse = parseDBFUploadResponse(await response.json());
  notifyUnitsSearchListChanged();
  return uploadResponse;
}

export function downloadDbf(type: DBFFileName): void {
  const link = document.createElement("a");
  link.href = `${API_BASE_URL}/files/${type}/download`;
  link.download = `${type}.dbf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function checkFilesExist(): Promise<FileExistResponse> {
  const response = await fetch(`${API_BASE_URL}/files/exist`);

  if (!response.ok) {
    throw await createApiError(response, "Failed to check files existence");
  }

  return (await response.json()) as FileExistResponse;
}

export async function deleteFile(type: DBFFileName): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/files/${type}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw await createApiError(response, `Failed to delete ${type} DBF file`);
  }

  notifyUnitsSearchListChanged();

  if (!response.ok) {
    throw await createApiError(response, `Failed to delete ${type} DBF file`);
  }
}
