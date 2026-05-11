from dataclasses import dataclass
from typing import Any, Mapping, Optional, Sequence


@dataclass
class Unit:
    UNIT_ID: str = ""
    UNIT_CAT: int = 0
    LEVEL: int = 0
    PREV_ID: str = ""
    RACE_ID: int = 0
    SUBRACE: int = 0
    BRANCH: int = 0
    SIZE_SMALL: bool = False
    SEX_M: bool = False
    ENROLL_C: int = 0
    ENROLL_B: str = ""
    NAME_TXT: str = ""
    DESC_TXT: str = ""
    ABIL_TXT: str = ""
    ATTACK_ID: Optional[str] = None
    ATTACK2_ID: Optional[str] = None
    ATCK_TWICE: bool = False
    HIT_POINT: int = 0
    BASE_UNIT: Optional[str] = None
    ARMOR: int = 0
    REGEN: int = 0
    REVIVE_C: int = 0
    HEAL_C: str = ""
    TRAINING_C: str = ""
    XP_KILLED: int = 0
    UPGRADE_B: str = ""
    XP_NEXT: int = 0
    MOVE: Optional[int] = None
    SCOUT: Optional[int] = None
    LIFE_TIME: Optional[int] = None
    LEADERSHIP: Optional[int] = None
    NEGOTIATE: Optional[int] = None
    LEADER_CAT: Optional[int] = None
    DYN_UPG1: Optional[str] = None
    DYN_UPG_LV: Optional[int] = None
    DYN_UPG2: Optional[str] = None
    WATER_ONLY: Optional[bool] = None
    DEATH_ANIM: Optional[int] = None

    @classmethod
    def from_row(cls, row: Mapping[str, Any]) -> "Unit":
        unit_fields: dict[str, Any] = {field_name: row.get(field_name) for field_name in cls.__dataclass_fields__}
        return cls(**unit_fields)

    @classmethod
    def from_record(cls, field_names: Sequence[str], values: Sequence[Any]) -> "Unit":
        row = dict(zip(field_names, values))
        return cls.from_row(row)

