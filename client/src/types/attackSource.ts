export const attackSource = {
  0: "weapon",
  1: "mind",
  2: "life",
  3: "death",
  4: "fire",
  5: "water",
  6: "earth",
  7: "air",
};

export type AttackSource = (typeof attackSource)[keyof typeof attackSource];
