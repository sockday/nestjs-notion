import type { PropertyType, PropertyTypes } from "../interfaces/properties.interface";

import type { MetadataPropertyOptionsInterface } from "../interfaces";

export type Properties = Map<string, MetadataPropertyOptionsInterface>;

export abstract class Transformer<T extends PropertyTypes, D, E = PropertyType<T>> {
    public abstract readonly type: T;
    public readonly properties: Properties;

    constructor(properties: Properties) {
        this.properties = properties;
    }

    abstract encode(value: D): E;
    abstract decode(value: E): D;
}
