import type { CreatePageParameters as PageParameters } from "@notionhq/client/build/src/api-endpoints";

type ExtractType<T> = T extends { type?: infer U } ? U : never;

export type Properties = Required<PageParameters>["properties"][any];
export type PropertyTypes = ExtractType<Properties>;
export type PropertyType<T extends PropertyTypes> = Extract<Properties, { type?: T }>;
