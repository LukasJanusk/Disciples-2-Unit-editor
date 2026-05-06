from dataclasses import dataclass, field
from typing import Any, ClassVar, Mapping, Optional, Sequence

from server.attack import Attack


@dataclass
class Unit:
    FIELD_ALIASES: ClassVar[dict[str, tuple[str, ...]]] = {
        "unit_id": ("UNIT_ID", "unit_id"),
        "unit_category": ("Unit Cat", "UNIT_CAT", "UNITCAT"),
        "level": ("Level", "LEVEL"),
        "previous_unit_id": ("PREV_ID", "previous_unit_id", "prev_id"),
        "race_id": ("Race ID", "RACE_ID", "RACEID"),
        "subrace_id": ("Subrace", "SUBRACE"),
        "branch_id": ("Branch", "BRANCH", "UNIT_B", "UNITB"),
        "size_small": ("Size Small", "SIZE_SMALL", "SIZESMALL"),
        "sex_male": ("SEX_M", "sex_male", "sex_m"),
        "enroll_cost": ("Enroll C", "ENROLL_C", "ENROLLC"),
        "enroll_building_id": ("ENROLL_B", "enroll_building_id", "enroll_b"),
        "name": ("Name Txt", "NAME_TXT", "NAMETXT"),
        "description": ("Desc Txt", "DESC_TXT", "DESCTXT"),
        "ability_text": ("ABIL_TXT", "ability_text", "abil_txt"),
        "attack_id": ("Attack ID", "ATTACK_ID", "ATTACKID"),
        "attack2_id": ("Attack2 ID", "ATTACK2_ID", "ATTACK2ID"),
        "attack_twice": ("ATCK_TWICE", "attack_twice", "atck_twice"),
        "hit_point": ("Hit Point", "HIT_POINT", "HITPOINT"),
        "base_unit_id": ("Base Unit", "BASE_UNIT", "BASEUNIT"),
        "armor": ("Armor", "ARMOR"),
        "regen": ("Regen", "REGEN"),
        "revive_cost": ("Revive C", "REVIVE_C", "REVIVEC"),
        "heal_cost": ("HEAL_C", "heal_cost", "heal_c"),
        "training_cost": ("TRAINING_C", "training_cost", "training_c"),
        "xp_killed": ("XP Killed", "XP_KILLED", "XPKILLED"),
        "upgrade_building_id": ("UPGRADE_B", "upgrade_building_id", "upgrade_b"),
        "xp_next": ("XP Next", "XP_NEXT", "XPNEXT"),
        "move": ("MOVE", "move"),
        "scout": ("SCOUT", "scout"),
        "life_time": ("LIFE_TIME", "life_time"),
        "leadership": ("LEADERSHIP", "leadership"),
        "negotiate": ("NEGOTIATE", "negotiate"),
        "leader_category": ("LEADER_CAT", "leader_category", "leader_cat"),
        "dyn_upgr1_id": ("Dyn Upgr1", "DYN_UPG1", "DYN_UPGR1", "DYNUPG1", "DYNUPGR1"),
        "dyn_upgr_level": ("DYN_UPG_LV", "dyn_upgr_level", "dyn_upg_lv"),
        "dyn_upgr2_id": ("Dyn Upgr2", "DYN_UPG2", "DYN_UPGR2", "DYNUPG2", "DYNUPGR2"),
        "water_only": ("WATER_ONLY", "water_only"),
        "death_anim_id": ("Death Anim", "DEATH_ANIM", "DEATHANIM"),
    }

    unit_id: str = ""
    unit_category: int = 0
    level: int = 0
    previous_unit_id: str = ""
    race_id: int = 0
    subrace_id: int = 0
    branch_id: int = 0
    size_small: bool = False
    sex_male: bool = False
    enroll_cost: int = 0
    enroll_building_id: str = ""
    name: str = ""
    description: str = ""
    ability_text: str = ""
    attack_id: Optional[int] = None
    attack2_id: Optional[int] = None
    attack_twice: bool = False
    attack: Attack = field(default_factory=Attack)
    attack2: Attack = field(default_factory=Attack)
    hit_point: int = 0
    base_unit_id: Optional[int] = None
    armor: int = 0
    regen: int = 0
    revive_cost: int = 0
    heal_cost: str = ""
    training_cost: str = ""
    xp_killed: int = 0
    upgrade_building_id: str = ""
    xp_next: int = 0
    move: Optional[int] = None
    scout: Optional[int] = None
    life_time: Optional[int] = None
    leadership: Optional[int] = None
    negotiate: Optional[int] = None
    leader_category: Optional[int] = None
    dyn_upgr1_id: Optional[int] = None
    dyn_upgr_level: Optional[int] = None
    dyn_upgr2_id: Optional[int] = None
    water_only: Optional[bool] = None
    death_anim_id: Optional[int] = None
    raw_fields: dict[str, Any] = field(default_factory=dict, repr=False)

    @staticmethod
    def _get_value(row: Mapping[str, Any], aliases: Sequence[str], default: Any = None) -> Any:
        for alias in aliases:
            if alias in row:
                return row[alias]
        return default

    @classmethod
    def from_row(cls, row: Mapping[str, Any]) -> "Unit":
        return cls(
            unit_id=cls._get_value(row, cls.FIELD_ALIASES["unit_id"], ""),
            unit_category=cls._get_value(row, cls.FIELD_ALIASES["unit_category"], 0),
            level=cls._get_value(row, cls.FIELD_ALIASES["level"], 0),
            previous_unit_id=cls._get_value(row, cls.FIELD_ALIASES["previous_unit_id"], ""),
            race_id=cls._get_value(row, cls.FIELD_ALIASES["race_id"], 0),
            subrace_id=cls._get_value(row, cls.FIELD_ALIASES["subrace_id"], 0),
            branch_id=cls._get_value(row, cls.FIELD_ALIASES["branch_id"], 0),
            size_small=bool(cls._get_value(row, cls.FIELD_ALIASES["size_small"], False)),
            sex_male=bool(cls._get_value(row, cls.FIELD_ALIASES["sex_male"], False)),
            enroll_cost=cls._get_value(row, cls.FIELD_ALIASES["enroll_cost"], 0),
            enroll_building_id=cls._get_value(row, cls.FIELD_ALIASES["enroll_building_id"], ""),
            name=cls._get_value(row, cls.FIELD_ALIASES["name"], ""),
            description=cls._get_value(row, cls.FIELD_ALIASES["description"], ""),
            ability_text=cls._get_value(row, cls.FIELD_ALIASES["ability_text"], ""),
            attack_id=cls._get_value(row, cls.FIELD_ALIASES["attack_id"]),
            attack2_id=cls._get_value(row, cls.FIELD_ALIASES["attack2_id"]),
            attack_twice=bool(cls._get_value(row, cls.FIELD_ALIASES["attack_twice"], False)),
            hit_point=cls._get_value(row, cls.FIELD_ALIASES["hit_point"], 0),
            base_unit_id=cls._get_value(row, cls.FIELD_ALIASES["base_unit_id"]),
            armor=cls._get_value(row, cls.FIELD_ALIASES["armor"], 0),
            regen=cls._get_value(row, cls.FIELD_ALIASES["regen"], 0),
            revive_cost=cls._get_value(row, cls.FIELD_ALIASES["revive_cost"], 0),
            heal_cost=cls._get_value(row, cls.FIELD_ALIASES["heal_cost"], ""),
            training_cost=cls._get_value(row, cls.FIELD_ALIASES["training_cost"], ""),
            xp_killed=cls._get_value(row, cls.FIELD_ALIASES["xp_killed"], 0),
            upgrade_building_id=cls._get_value(row, cls.FIELD_ALIASES["upgrade_building_id"], ""),
            xp_next=cls._get_value(row, cls.FIELD_ALIASES["xp_next"], 0),
            move=cls._get_value(row, cls.FIELD_ALIASES["move"]),
            scout=cls._get_value(row, cls.FIELD_ALIASES["scout"]),
            life_time=cls._get_value(row, cls.FIELD_ALIASES["life_time"]),
            leadership=cls._get_value(row, cls.FIELD_ALIASES["leadership"]),
            negotiate=cls._get_value(row, cls.FIELD_ALIASES["negotiate"]),
            leader_category=cls._get_value(row, cls.FIELD_ALIASES["leader_category"]),
            dyn_upgr1_id=cls._get_value(row, cls.FIELD_ALIASES["dyn_upgr1_id"]),
            dyn_upgr_level=cls._get_value(row, cls.FIELD_ALIASES["dyn_upgr_level"]),
            dyn_upgr2_id=cls._get_value(row, cls.FIELD_ALIASES["dyn_upgr2_id"]),
            water_only=cls._get_value(row, cls.FIELD_ALIASES["water_only"]),
            death_anim_id=cls._get_value(row, cls.FIELD_ALIASES["death_anim_id"]),
            raw_fields=dict(row),
        )

    @classmethod
    def from_record(cls, field_names: Sequence[str], values: Sequence[Any]) -> "Unit":
        row = dict(zip(field_names, values))
        return cls.from_row(row)

