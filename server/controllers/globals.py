from pydantic import BaseModel
from fastapi import HTTPException
from server.repository import editor

class GlobalEditRequest(BaseModel):
    new_value: str

def get(global_id: str) -> str:
    global_value = editor.get_global(global_id)
    if global_value is None:
        raise HTTPException(status_code=404, detail="Global not found")
    return global_value


def edit(global_id: str, request: GlobalEditRequest) -> str:
    print(f"Updating global '{global_id}' to new value: {request.new_value}")
    try:
         editor.update_global(global_id, request.new_value)
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return request.new_value
