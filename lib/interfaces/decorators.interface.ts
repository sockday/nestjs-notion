import type { CreateDatabaseParameters as DatabaseParameters } from "@notionhq/client/build/src/api-endpoints";
import { Transformer } from "../transformers/transformer.abstract";
import { Type } from "@nestjs/common";

type ExtractType<T> = T extends { type?: infer U } ? U : never;
type Properties = DatabaseParameters["properties"][any];
type PropertyTypes = ExtractType<Properties>;

export interface MetadataDatabaseInterface {
    name: string;
    description?: string;
    id: string;
}

export type MetadataPropertyOptionsInterface = Properties & {
    key: string;
    type: PropertyTypes;
    transformer?: Type<Transformer<any, any>>;
};
