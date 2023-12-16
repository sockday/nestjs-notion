import { MetadataDatabaseInterface, MetadataPropertyOptionsInterface } from "../interfaces";
import { NOTION_DATABASE, NOTION_PROPERTY, NOTION_PROPERTY_SEPARATOR } from "./consts";

export function NotionDatabase(options: MetadataDatabaseInterface): ClassDecorator {
    return function (constructor: Function) {
        Reflect.defineMetadata(NOTION_DATABASE, options, constructor);
    };
}

export function NotionProperty(options: MetadataPropertyOptionsInterface): PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) {
        Reflect.defineMetadata(`${NOTION_PROPERTY}${NOTION_PROPERTY_SEPARATOR}${String(propertyKey)}`, true, target);
        Reflect.defineMetadata(NOTION_PROPERTY, options, target, propertyKey);
    };
}
