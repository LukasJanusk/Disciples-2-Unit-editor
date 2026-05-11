
from fastapi import File, HTTPException, UploadFile
from pathlib import Path
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

PROJECT_ROOT = Path(__file__).resolve().parents[2]
GLOBALS_STORAGE_DIR = PROJECT_ROOT / "storage/Globals"

class FileExistResponse(BaseModel):
    Tglobal: bool
    Gunits: bool
    Gattacks: bool

def _write_uploaded_file(file_name: str, contents: bytes) -> Path:
    GLOBALS_STORAGE_DIR.mkdir(parents=True, exist_ok=True)
    target_path = GLOBALS_STORAGE_DIR / file_name
    target_path.write_bytes(contents)
    return target_path


def _get_uploaded_file(file_name: str) -> FileResponse:
    target_path = GLOBALS_STORAGE_DIR / file_name
    if not target_path.exists():
        raise HTTPException(status_code=404, detail=f"File not found: {file_name}")

    return FileResponse(
        path=target_path,
        media_type="application/octet-stream",
        filename=file_name,
    )

async def check_if_exists(file_name: str) -> bool:
    target_path = GLOBALS_STORAGE_DIR / file_name
    return target_path.exists()

async def upload_Gunits(file: UploadFile = File(...)):
    contents = await file.read()
    saved_path = _write_uploaded_file("Gunits.dbf", contents)
    return {
        "success": True,
        "filename": file.filename,
        "size": len(contents),
        "content_type": file.content_type,
        "saved_path": str(saved_path),
    }

async def upload_Gattacks(file: UploadFile = File(...)):
    contents = await file.read()
    saved_path = _write_uploaded_file("Gattacks.dbf", contents)
    return {
        "success": True,
        "filename": file.filename,
        "size": len(contents),
        "content_type": file.content_type,
        "saved_path": str(saved_path),
    }

async def upload_Tglobal(file: UploadFile = File(...)):
    contents = await file.read()
    saved_path = _write_uploaded_file("Tglobal.dbf", contents)
    return {
        "success": True,
        "filename": file.filename,
        "size": len(contents),
        "content_type": file.content_type,
        "saved_path": str(saved_path),
    }


async def get_Tglobal():
    return _get_uploaded_file("Tglobal.dbf")


async def get_Gunits():
    return _get_uploaded_file("Gunits.dbf")


async def get_Gattacks():
    return _get_uploaded_file("Gattacks.dbf")

async def check_files_exist() -> FileExistResponse:
    return FileExistResponse(
        Tglobal=await check_if_exists("Tglobal.dbf"),
        Gunits=await check_if_exists("Gunits.dbf"),
        Gattacks=await check_if_exists("Gattacks.dbf"),
    )

async def delete_file(file_name: str):
    if file_name not in ["Tglobal.dbf", "Gunits.dbf", "Gattacks.dbf"]:
        return JSONResponse(status_code=400, content={"detail": "Invalid file name"})
    target_path = GLOBALS_STORAGE_DIR / file_name
    if target_path.exists():
        target_path.unlink()
        return {"detail": f"{file_name} deleted successfully"}
    else:
        return JSONResponse(status_code=404, content={"detail": f"{file_name} not found"})
