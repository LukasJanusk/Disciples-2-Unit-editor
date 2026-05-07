import { z } from "zod";

const trimmedString = z.string().transform((value) => value.trim());
const nullableOptionalTrimmedString = trimmedString.nullable().optional();

export const UnitSchema = z
  .object({
    UNIT_ID: trimmedString,
    UNIT_CAT: z.number().nullable().optional(),
    LEVEL: z.number().nullable().optional(),
    PREV_ID: nullableOptionalTrimmedString,
    RACE_ID: nullableOptionalTrimmedString,
    SUBRACE: z.number().nullable().optional(),
    BRANCH: z.number().nullable().optional(),
    SIZE_SMALL: z.boolean().nullable().optional(),
    SEX_M: z.boolean().nullable().optional(),
    ENROLL_C: nullableOptionalTrimmedString,
    ENROLL_B: nullableOptionalTrimmedString,
    NAME_TXT: nullableOptionalTrimmedString,
    DESC_TXT: nullableOptionalTrimmedString,
    ABIL_TXT: nullableOptionalTrimmedString,
    ATTACK_ID: nullableOptionalTrimmedString,
    ATTACK2_ID: nullableOptionalTrimmedString,
    ATCK_TWICE: z.boolean().nullable().optional(),
    HIT_POINT: z.number().nullable().optional(),
    BASE_UNIT: nullableOptionalTrimmedString,
    ARMOR: z.number().nullable().optional(),
    REGEN: z.number().nullable().optional(),
    REVIVE_C: nullableOptionalTrimmedString,
    HEAL_C: nullableOptionalTrimmedString,
    TRAINING_C: nullableOptionalTrimmedString,
    XP_KILLED: z.number().nullable().optional(),
    UPGRADE_B: nullableOptionalTrimmedString,
    XP_NEXT: z.number().nullable().optional(),
    MOVE: z.number().nullable().optional(),
    SCOUT: z.number().nullable().optional(),
    LIFE_TIME: z.number().nullable().optional(),
    LEADERSHIP: z.number().nullable().optional(),
    NEGOTIATE: z.number().nullable().optional(),
    LEADER_CAT: z.number().nullable().optional(),
    DYN_UPG1: nullableOptionalTrimmedString,
    DYN_UPG_LV: z.number().nullable().optional(),
    DYN_UPG2: nullableOptionalTrimmedString,
    WATER_ONLY: z.boolean().nullable().optional(),
    DEATH_ANIM: z.number().nullable().optional(),
  })
  .passthrough();

export const UnitSearchListItemSchema = z
  .object({
    unit_id: trimmedString,
    name: trimmedString,
    race_id: z.union([trimmedString, z.number()]),
  })
  .passthrough();

export const UnitsSchema = z.array(UnitSchema);
export const UnitSearchListSchema = z.array(UnitSearchListItemSchema);

export type Unit = z.infer<typeof UnitSchema>;
export type UnitSearchListItem = z.infer<typeof UnitSearchListItemSchema>;
