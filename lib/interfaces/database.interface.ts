import type { GetPageParameters, QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";
import type { MetadataDatabaseInterface, MetadataPropertyOptionsInterface } from "./decorators.interface";

import type { Client } from "@notionhq/client";
import { Properties } from "./properties.interface";
import type { Type } from "@nestjs/common";

export type DatabaseTargetType = Type;
// export type ClientDatabaseMethods = Client["databases"];

export type WithExistsEntity<T extends DatabaseTargetType> = { id: string; entity: T };

// Notion database raw interface
export interface DatabaseRawInterface<T extends DatabaseTargetType> {
    target: T;
    database: MetadataDatabaseInterface;
    properties: Map<string, MetadataPropertyOptionsInterface>;
}

// Notion database interface
export interface ManagerDatabaseInterface<T extends DatabaseTargetType> extends DatabaseOptionsInterface<T> {
    // Convert notion data to entity
    dataToEntity(data: Record<keyof T, Properties>): T;

    // Convert entity to notion data
    entityToData(entity: T): Record<string, Properties>;

    // Sync properties from notion database
    syncProperties(): Promise<void>;

    // Retrieve notion entities from a database
    all(query?: Omit<QueryDatabaseParameters, "database_id">): Promise<WithExistsEntity<T>[]>;

    // Retrieve notion entity from a database
    retrieve(query: GetPageParameters): Promise<WithExistsEntity<T>>;

    // Create notion entity in a database
    create(entity: T): Promise<WithExistsEntity<T>>;

    // Update notion entity in a database
    update(id: string, entity: T): Promise<void>;

    // Delete notion entity in a database
    archive(id: string): Promise<void>;
}

// Notion database options interface (module)
export interface DatabaseOptionsInterface<T extends DatabaseTargetType> {
    target: T;
    database: MetadataDatabaseInterface;
    properties: Map<string, MetadataPropertyOptionsInterface>;
    client: Client;
}
