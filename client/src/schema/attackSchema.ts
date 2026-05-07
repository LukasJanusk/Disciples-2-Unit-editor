import { z } from "zod";

export const AttackDataSchema = z.object({
  ATT_ID: z.string(),
  NAME_TXT: z.string(),
  DESC_TXT: z.string(),
  INITIATIVE: z.number(),
  SOURCE: z.number(),
  CLASS: z.number(),
  POWER: z.number(),
  REACH: z.number(),
  QTY_HEAL: z.number().nullable(),
  QTY_DAM: z.number().nullable(),
  LEVEL: z.number().nullable(),
  ALT_ATTACK: z.string(),
  INFINITE: z.boolean().nullable(),
  QTY_WARDS: z.number().nullable(),
  WARD1: z.string(),
  WARD2: z.string(),
  WARD3: z.string(),
  WARD4: z.string(),
  CRIT_HIT: z.boolean().nullable(),
});

export const DefaultAttackResponseSchema = z.object({
  is_default: z.literal(true),
  attack: z.null().optional(),
});

export const CustomAttackResponseSchema = z.object({
  is_default: z.literal(false),
  attack: AttackDataSchema,
});

export const AttackResponseSchema = z.discriminatedUnion("is_default", [DefaultAttackResponseSchema, CustomAttackResponseSchema]);

export type AttackData = z.infer<typeof AttackDataSchema>;
export type AttackResponse = z.infer<typeof AttackResponseSchema>;
