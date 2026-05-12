import os
from pathlib import Path


DEFAULT_CODEPAGE = "utf8"
PROJECT_ROOT = Path(__file__).resolve().parents[2]


def _is_dev_environment() -> bool:
	return os.getenv("APP_ENV", "dev").lower() == "dev"


def _resolve_globals_storage_dir() -> Path:
	if _is_dev_environment():
		return PROJECT_ROOT / "storage/Globals"

	local_app_data = os.getenv("LOCALAPPDATA")
	if local_app_data:
		return Path(local_app_data) / "Disciples2UnitEditor" / "Globals"

	return Path.home() / ".disciples2-unit-editor" / "Globals"


GLOBALS_STORAGE_DIR = _resolve_globals_storage_dir()

DEFAULT_UNITS_DBF = GLOBALS_STORAGE_DIR / "Gunits.dbf"
DEFAULT_GLOBALS_DBF = GLOBALS_STORAGE_DIR / "Tglobal.dbf"
DEFAULT_ATTACKS_DBF = GLOBALS_STORAGE_DIR / "Gattacks.dbf"
DEFAULT_ATTACK_ID = 'g000000000'