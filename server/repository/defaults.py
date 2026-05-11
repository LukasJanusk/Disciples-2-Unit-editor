from pathlib import Path


DEFAULT_CODEPAGE = "utf8"
PROJECT_ROOT = Path(__file__).resolve().parents[2]

DEFAULT_UNITS_DBF = PROJECT_ROOT / "defaults/Globals/Gunits.dbf"
DEFAULT_GLOBALS_DBF = PROJECT_ROOT / "defaults/Globals/Tglobal.dbf"
DEFAULT_ATTACKS_DBF = PROJECT_ROOT / "defaults/Globals/Gattacks.dbf"
DEFAULT_ATTACK_ID = 'g000000000'