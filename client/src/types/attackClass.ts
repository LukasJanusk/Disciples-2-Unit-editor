const attackClass = {
  1: "damage",
  2: "exhaustion",
  3: "paralysis",
  6: "healing",
  7: "fear",
  8: "increase in damage",
  9: "petrification",
  10: "damage reduction",
  11: "decreased initiative",
  12: "poison",
  13: "frostbite",
  14: "resurrection",
  15: "drink life force",
  16: "treatment",
  17: "heal",
  18: "lower level",
  19: "increase attack",
  20: "to transmit life force",
  21: "transform yourself",
  22: "transform another",
  23: "burn",
  24: "grant protection from the elements",
  25: "break armor",
};

export default attackClass;

export type AttackClass = (typeof attackClass)[keyof typeof attackClass];
