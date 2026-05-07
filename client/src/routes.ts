export const AppRoute = {
  Home: "/",
  Units: "/units",
  UnitDetail: "/units/:id",
  UnitData: "/units/data",
} as const;

export const AppRouteSearchParam = {
  Query: "q",
} as const;

export type AppRoute = (typeof AppRoute)[keyof typeof AppRoute];
