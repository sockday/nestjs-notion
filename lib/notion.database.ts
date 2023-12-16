import type {
    DatabaseOptionsInterface,
    DatabaseTargetType,
    ManagerDatabaseInterface,
    MetadataDatabaseInterface,
    MetadataPropertyOptionsInterface,
    WithExistsEntity,
} from "./interfaces";
import { GetPageParameters, QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";

import type { Client } from "@notionhq/client";
import { NotionException } from "./exceptions";
import { PropertyTypes } from "./interfaces/properties.interface";
import { transformers } from "./transformers";

export class NotionDatabase<T extends DatabaseTargetType> implements ManagerDatabaseInterface<T> {
    public readonly target: T;
    public readonly properties: Map<string, MetadataPropertyOptionsInterface>;
    public readonly database: MetadataDatabaseInterface;
    public readonly client: Client;

    constructor(options: DatabaseOptionsInterface<T>) {
        this.target = options.target;
        this.properties = options.properties;
        this.database = options.database;
        this.client = options.client;
    }

    dataToEntity(data: Record<string, any>): T {
        const instance = new this.target();

        for (const [key, property] of this.properties) {
            const transformer = property.transformer ?? transformers?.[property.type as PropertyTypes];

            if (!transformer || !data?.[key]) {
                continue;
            }

            instance[key] = new transformer(this.properties).decode(data[key]);
        }

        return instance;
    }

    entityToData(entity: T): Record<string, any> {
        const data: Record<string, any> = {};
        const _entity = entity as Record<string, any>;

        for (const [key, property] of this.properties) {
            const transformer = property.transformer ?? transformers?.[property.type as PropertyTypes];

            if (!transformer || !_entity?.[key]) {
                continue;
            }

            data[property.key] = new transformer(this.properties).encode(_entity[key]);
        }

        return data;
    }

    async syncProperties() {
        // Retrieve the properties from the database
        const { properties } = await this.client.databases.retrieve({
            database_id: this.database.id,
        });

        // Create a schema from the properties
        const schema = [...this.properties.values()].reduce(
            (acc, { key, ...item }) => {
                acc[key] = item;
                return acc;
            },
            {} as Record<string, any>
        );

        // Update the database with the new schema and delete the properties that are not in the database
        await this.client.databases.update({
            database_id: this.database.id,
            title: [
                {
                    type: "text",
                    text: {
                        content: this.database.name,
                    },
                },
            ],
            description: [
                {
                    type: "text",
                    text: {
                        content: this.database.description ?? "This database is synchronized with the backend ⚡️",
                    },
                },
            ],
            properties: Object.entries({ ...properties, ...schema }).reduce(
                (properties, [key]) => {
                    // Remove properties that are not in the database
                    if (!schema?.[key]) {
                        properties[key] = null;
                        return properties;
                    }

                    // Update the properties that are in the database
                    properties[key] = schema[key];

                    return properties;
                },
                {} as Record<string, any>
            ),
        });
    }

    async all(query?: Omit<QueryDatabaseParameters, "database_id">): Promise<WithExistsEntity<T>[]> {
        const items: WithExistsEntity<T>[] = [];

        let next_cursor: string | null | undefined = query?.page_size === undefined ? undefined : null;

        do {
            const { results, next_cursor: cursor } = await this.client.databases.query({
                database_id: this.database.id,
                ...query,
            });

            if (next_cursor !== undefined) {
                next_cursor = cursor;
            }

            if (!results) {
                break;
            }

            for (const page of results) {
                if (!("parent" in page)) {
                    continue;
                }

                items.push({
                    id: page.id,
                    entity: this.dataToEntity(page.properties as Record<string, any>),
                });
            }
        } while (next_cursor !== undefined);

        return items;
    }

    async retrieve(query: GetPageParameters): Promise<WithExistsEntity<T>> {
        const page = await this.client.pages.retrieve(query);

        if (!page || !("parent" in page)) {
            throw new NotionException("Notion page not found");
        }

        return {
            id: page.id,
            entity: this.dataToEntity(page.properties as Record<string, any>),
        };
    }

    async create(entity: T) {
        const page = await this.client.pages.create({
            parent: {
                database_id: this.database.id,
            },
            properties: this.entityToData(entity),
        });

        if (!page || !("parent" in page)) {
            throw new NotionException("Notion page not found");
        }

        return {
            id: page.id,
            entity: this.dataToEntity(page.properties as Record<string, any>),
        };
    }

    async update(id: string, entity: T) {
        await this.client.pages.update({
            page_id: id,
            properties: this.entityToData(entity),
        });
    }

    async archive(id: string) {
        await this.client.pages.update({
            page_id: id,
            archived: true,
        });
    }
}
