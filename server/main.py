from dataclasses import asdict
from pathlib import Path
from typing import Any
from server.controllers import attacks, globals, units
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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

@app.get("/units/data")
def get_units() -> list[dict[str, Any]]:
    return units.get_raw_data()

@app.get("/units")
def get_units_list() -> list[dict[str, Any]]:
    return units.get_search_list()

@app.get("/units/{unit_id}")
def get_unit(unit_id: str) -> dict[str, Any]:
    return units.get_unit(unit_id)

@app.put("/units/{unit_id}")
def edit_unit(unit_id: str, request: units.UnitEditRequest) -> dict[str, Any]:
   return units.edit(unit_id, request)

@app.get('/attacks/{attack_id}', response_model=attacks.AttackResponse)
def get_attack(attack_id: str) -> attacks.AttackResponse:
    return attacks.get(attack_id)

@app.put("/attacks/{attack_id}")
def edit_attack(attack_id: str, request: attacks.AttackEditRequest) -> attacks.AttackResponse:
    return attacks.edit(attack_id, request)

@app.get("/globals/{global_id}", response_model=str)
def get_global(global_id: str) -> str:
    return globals.get(global_id)

@app.put("/globals/{global_id}")
def edit_global(global_id: str, request: globals.GlobalEditRequest) -> str:
    return globals.edit(global_id, request)

def main():
    uvicorn.run(app, host="127.0.0.1", port=8000)

if __name__ == "__main__":
    main()