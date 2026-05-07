export const attackReach = {
  1: "all targets",
  2: "any target",
  3: "the nearest target",
};

export type AttackReach = (typeof attackReach)[keyof typeof attackReach];
