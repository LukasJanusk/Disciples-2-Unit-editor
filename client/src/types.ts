export type Unit = {
  unit_id?: string;
  level?: number | string;
  name?: string;
  armor?: number | string;
  regen?: number | string;
  race_id?: number | string;
  description?: string;
  hit_point?: number | string;
  xp_next?: number | string;
  [key: string]: unknown;
};
