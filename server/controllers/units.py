
from typing import Any
from pydantic import BaseModel
from fastapi import HTTPException
from dataclasses import asdict
from pathlib import Path
from server.repository import editor

class UnitEditRequest(BaseModel):
    changes: dict[str, Any]

def serialize_unit(unit: Any) -> dict[str, Any]:
    if isinstance(unit, dict):
        return dict(unit)
    return asdict(unit)

def get_raw_data() -> list[dict[str, Any]]:
    return [serialize_unit(unit) for unit in editor.load_units()]

def get_search_list() -> list[dict[str, Any]]:
    return editor.get_units_search_list()

def get_unit(unit_id: str) -> dict[str, Any]:
    unit = editor.get_unit(unit_id)
    if unit is None:
        raise HTTPException(status_code=404, detail="Unit not found")
    return serialize_unit(unit)

def edit(unit_id: str, request: UnitEditRequest) -> dict[str, Any]:
    try:
        updated_unit = editor.update_unit(unit_id, request.changes)
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return serialize_unit(updated_unit)
