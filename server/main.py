from typing import Any
from server.controllers import attacks, files, globals, units
import uvicorn
from fastapi import FastAPI, File, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from server.repository.editor import MissingDataFileError

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


@app.exception_handler(MissingDataFileError)
async def handle_missing_data_file(_: Request, exc: MissingDataFileError) -> JSONResponse:
    return JSONResponse(
        status_code=404,
        content={
            "detail": str(exc),
            "hint": "Upload the required DBF file to storage before using this endpoint.",
        },
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

@app.post("/files/Tglobal")
async def upload_Tglobal(file: UploadFile = File(...)):
    return await files.upload_Tglobal(file)

@app.post("/files/Gunits")
async def upload_Gunits(file: UploadFile = File(...)):
    return await files.upload_Gunits(file)

@app.post("/files/Gattacks")
async def upload_Gattacks(file: UploadFile = File(...)):
    return await files.upload_Gattacks(file)

@app.get("/files/Tglobal")
async def get_Tglobal():
    return await files.get_Tglobal()


@app.get("/files/Tglobal/download")
async def download_Tglobal():
    return await files.get_Tglobal()

@app.get("/files/Gunits")
async def get_Gunits():
    return await files.get_Gunits()


@app.get("/files/Gunits/download")
async def download_Gunits():
    return await files.get_Gunits()

@app.get("/files/Gattacks")
async def get_Gattacks():
    return await files.get_Gattacks()


@app.get("/files/Gattacks/download")
async def download_Gattacks():
    return await files.get_Gattacks()

@app.get("/files/exist", response_model=files.FileExistResponse)
async def check_files_exist() -> files.FileExistResponse:
    return await files.check_files_exist()

@app.delete("/files/{file_name}")
async def delete_file(file_name: str):
    if f'{file_name}.dbf' not in ["Tglobal.dbf", "Gunits.dbf", "Gattacks.dbf"]:
        return JSONResponse(status_code=400, content={"detail": "Invalid file name"})
    target_path = files.GLOBALS_STORAGE_DIR / f'{file_name}.dbf'
    if target_path.exists():
        target_path.unlink()
        return {"detail": f"{file_name} deleted successfully"}
    else:
        return JSONResponse(status_code=404, content={"detail": f"{file_name} not found"})

def main():
    uvicorn.run(app, host="127.0.0.1", port=8000)

if __name__ == "__main__":
    main()