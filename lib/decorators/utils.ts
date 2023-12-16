import { MetadataDatabaseInterface, MetadataPropertyOptionsInterface } from "../interfaces";
import { NOTION_DATABASE, NOTION_PROPERTY, NOTION_PROPERTY_SEPARATOR } from "./consts";

export function getNotionMetadataDatabase(constructor: object): MetadataDatabaseInterface {
    return Reflect.getMetadata(NOTION_DATABASE, constructor);
}

export function getNotionMetadataProperty(
    target: object,
    propertyKey: string | symbol
): MetadataPropertyOptionsInterface {
    return Reflect.getMetadata(NOTION_PROPERTY, target, propertyKey);
}

export function getNotionMetadataProperties(constructor: Function): Map<string, MetadataPropertyOptionsInterface> {
    const properties = new Map<string, MetadataPropertyOptionsInterface>();

    for (const key of Reflect.getMetadataKeys(constructor.prototype)) {
        const _indexOf = String(key).indexOf(NOTION_PROPERTY_SEPARATOR);

        if (_indexOf === -1) {
            continue;
        }

        const propertyKey = String(key).substring(_indexOf + 1);
        const property = getNotionMetadataProperty(constructor.prototype, propertyKey);

        if (property) {
            properties.set(propertyKey, property);
        }
    }

    return properties;
}
