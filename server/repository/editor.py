from contextlib import contextmanager
from pathlib import Path
from typing import Any, Generator
from .defaults import DEFAULT_CODEPAGE, DEFAULT_GLOBALS_DBF, DEFAULT_UNITS_DBF, DEFAULT_ATTACKS_DBF, DEFAULT_ATTACK_ID
import dbf

from server.classes.unit import Unit

@contextmanager
def open_dbf_table(
    dbf_filename: str | Path,
    *,
    codepage: str = DEFAULT_CODEPAGE,
    mode: Any = dbf.READ_ONLY,
) -> Generator[dbf.Table, None, None]:
    table = dbf.Table(str(dbf_filename), codepage=codepage, on_disk=True)
    table.open(mode=mode)
    try:
        yield table
    finally:
        if table.status != dbf.CLOSED:
            table.close()


def _row_from_record(record: Any, field_names: tuple[str, ...]) -> dict[str, Any]:
    return {field_name: record[field_name] for field_name in field_names}


def _strip_dbf_string(value: Any) -> str:
    return str(value).strip() if value is not None else ""


def _resolve_dbf_field_name(field_name: str, field_names: tuple[str, ...]) -> str | None:
    if field_name in field_names:
        return field_name

    normalized_fields = {
        name.upper(): name for name in field_names
    }
    normalized_fields.update({name.replace(" ", "_").upper(): name for name in field_names})

    direct_match = normalized_fields.get(field_name.upper())
    if direct_match is not None:
        return direct_match

    return None

def get_globals(
    dbf_filename: str | Path = DEFAULT_GLOBALS_DBF,
    *,
    codepage: str = DEFAULT_CODEPAGE,
) -> dict[str, str]:
    with open_dbf_table(dbf_filename, codepage=codepage) as table:
        globals_dict: dict[str, str] = {}
        for record in table:
            globals_dict[_strip_dbf_string(record["TXT_ID"])] = _strip_dbf_string(record["TEXT"])
        return globals_dict

def get_global(global_id: str) -> str | None:
    with open_dbf_table(DEFAULT_GLOBALS_DBF, codepage=DEFAULT_CODEPAGE) as table:
        for record in table:
            if _strip_dbf_string(record["TXT_ID"]) == global_id:
                return _strip_dbf_string(record["TEXT"])
    return None

def update_global(
    global_id: str,
    new_value: str,
    dbf_filename: str | Path = DEFAULT_GLOBALS_DBF,
    *,
    codepage: str = DEFAULT_CODEPAGE,
) -> None:
    with open_dbf_table(dbf_filename, codepage=codepage, mode=dbf.READ_WRITE) as table:
        for record in table:
            if _strip_dbf_string(record["TXT_ID"]) == global_id:
                dbf.write(record, TEXT=new_value)
                return
    raise LookupError(f"Global not found: {global_id}")

def load_units(
    dbf_filename: str | Path = DEFAULT_UNITS_DBF,
    *,
    codepage: str = DEFAULT_CODEPAGE,
) -> list[Unit]:
    with open_dbf_table(dbf_filename, codepage=codepage) as table:
        field_names = tuple(table.field_names)
        units: list[Unit] = []
        for record in table:
            row = _row_from_record(record, field_names)
            units.append(Unit.from_row(row))
        return units

def get_units_search_list(
    dbf_filename: str | Path = DEFAULT_UNITS_DBF,
    *,
    codepage: str = DEFAULT_CODEPAGE,
) -> list[dict[str, str]]:
    with open_dbf_table(dbf_filename, codepage=codepage) as table:
        globals_dict = get_globals(DEFAULT_GLOBALS_DBF, codepage=codepage)
        return [
            {
                "unit_id": _strip_dbf_string(record["UNIT_ID"]),
                "name": globals_dict.get(
                    _strip_dbf_string(record["NAME_TXT"]),
                    _strip_dbf_string(record["NAME_TXT"]),
                ),
                "race_id": _strip_dbf_string(record["RACE_ID"]),
            }
            for record in table
        ]

def get_unit(
    unit_id: str,
    dbf_filename: str | Path = DEFAULT_UNITS_DBF,
    *,
    codepage: str = DEFAULT_CODEPAGE,
) -> Unit | None:
    with open_dbf_table(dbf_filename, codepage=codepage) as table:
        field_names = tuple(table.field_names)
        for record in table:
            if str(record["UNIT_ID"]).strip() == unit_id:
                return Unit.from_row(_row_from_record(record, field_names))
    return None

def get_attack(
        attack_id: str,
        dbf_filename: str | Path = DEFAULT_ATTACKS_DBF,
        *,
        codepage: str = DEFAULT_CODEPAGE,
) -> dict[str, Any] | None:
    with open_dbf_table(dbf_filename, codepage=codepage) as table:
        for record in table:
            if str(record["ATT_ID"]).strip() == attack_id:
                field_names = tuple(table.field_names)
                return _row_from_record(record, field_names)
    return None

def update_attack(
    attack_id: str,
    changes: dict[str, Any],
    dbf_filename: str | Path = DEFAULT_ATTACKS_DBF,
    *,
    codepage: str = DEFAULT_CODEPAGE,
) -> dict[str, Any]:
    with open_dbf_table(dbf_filename, codepage=codepage, mode=dbf.READ_WRITE) as table:
        field_names = tuple(table.field_names)
        normalized_changes: dict[str, Any] = {}

        for field_name, value in changes.items():
            resolved_name = _resolve_dbf_field_name(field_name, field_names)
            if resolved_name is None:
                raise ValueError(f"Unknown attack field: {field_name}")
            normalized_changes[resolved_name] = value

        for record in table:
            if str(record["ATT_ID"]).strip() != attack_id:
                continue

            dbf.write(record, **normalized_changes)
            updated_row = _row_from_record(record, field_names)
            return updated_row

    raise LookupError(f"Attack not found: {attack_id}")

def is_default_attack_id(attack_id: str) -> bool:
    return attack_id == DEFAULT_ATTACK_ID

def update_unit(
    unit_id: str,
    changes: dict[str, Any],
    dbf_filename: str | Path = DEFAULT_UNITS_DBF,
    *,
    codepage: str = DEFAULT_CODEPAGE,
) -> Unit:
    with open_dbf_table(dbf_filename, codepage=codepage, mode=dbf.READ_WRITE) as table:
        field_names = tuple(table.field_names)
        normalized_changes: dict[str, Any] = {}

        for field_name, value in changes.items():
            resolved_name = _resolve_dbf_field_name(field_name, field_names)
            if resolved_name is None:
                raise ValueError(f"Unknown unit field: {field_name}")
            normalized_changes[resolved_name] = value

        for record in table:
            if str(record["UNIT_ID"]).strip() != unit_id:
                continue

            dbf.write(record, **normalized_changes)
            updated_row = _row_from_record(record, field_names)
            return Unit.from_row(updated_row)

    raise LookupError(f"Unit not found: {unit_id}")