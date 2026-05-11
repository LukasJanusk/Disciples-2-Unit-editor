from typing import Any
from fastapi import HTTPException
from pydantic import BaseModel

from server.repository import editor

class AttackEditRequest(BaseModel):
    changes: dict[str, Any]
class AttackResponse(BaseModel):
    is_default: bool
    attack: dict[str, Any] | None = None

def get(attack_id: str) -> AttackResponse:
  if editor.is_default_attack_id(attack_id):
      return AttackResponse(is_default=True)

  attack = editor.get_attack(attack_id)
  if attack is None:
      raise HTTPException(status_code=404, detail="Attack not found")

  return AttackResponse(is_default=False, attack=attack)

def edit(attack_id: str, request: AttackEditRequest) -> AttackResponse:
    try:
        updated_attack = editor.update_attack(attack_id, request.changes)
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return AttackResponse(is_default=False, attack=updated_attack)
