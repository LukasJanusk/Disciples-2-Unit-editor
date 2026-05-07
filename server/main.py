from dataclasses import asdict
from pathlib import Path
from typing import Any

import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from fastapi.middleware.cors import CORSMiddleware

from server import editor

UNITS_DBF = Path(__file__).resolve().parent.parent / "defaults/Globals/Gunits.dbf"


class UnitEditRequest(BaseModel):
    changes: dict[str, Any]


class AttackResponse(BaseModel):
    is_default: bool
    attack: dict[str, Any] | None = None


app = FastAPI(title="Disciples 2 Unit Editor API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def serialize_unit(unit: Any) -> dict[str, Any]:
    if isinstance(unit, dict):
        return dict(unit)
    return asdict(unit)


@app.get("/units/data")
def get_units() -> list[dict[str, Any]]:
    return [serialize_unit(unit) for unit in editor.load_units(UNITS_DBF)]

@app.get("/units")
def get_units_list() -> list[dict[str, Any]]:
    return editor.get_units_search_list(UNITS_DBF)

@app.get("/units/{unit_id}")
def get_unit(unit_id: str) -> dict[str, Any]:
    unit = editor.get_unit(unit_id, UNITS_DBF)
    if unit is None:
        raise HTTPException(status_code=404, detail="Unit not found")
    return serialize_unit(unit)


@app.post("/units/{unit_id}")
def edit_unit(unit_id: str, request: UnitEditRequest) -> dict[str, Any]:
    try:
        updated_unit = editor.update_unit(unit_id, request.changes, UNITS_DBF)
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return serialize_unit(updated_unit)

@app.get('/attacks/{attack_id}', response_model=AttackResponse)
def get_attack(attack_id: str) -> AttackResponse:
    if editor.is_default_attack_id(attack_id):
        return AttackResponse(is_default=True)

    attack = editor.get_attack(attack_id)
    if attack is None:
        raise HTTPException(status_code=404, detail="Attack not found")

    return AttackResponse(is_default=False, attack=attack)

@app.get("/globals/{global_id}", response_model=str)
def get_global(global_id: str) -> str:
    global_value = editor.get_global(global_id)
    if global_value is None:
        raise HTTPException(status_code=404, detail="Global not found")
    return global_value

def main():
    uvicorn.run(app, host="127.0.0.1", port=8000)

if __name__ == "__main__":
    main()