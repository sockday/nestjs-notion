import type { DatabaseTargetType, ManagerDatabaseInterface } from "./interfaces";
import { Injectable, Type } from "@nestjs/common";
import { getNotionMetadataDatabase, getNotionMetadataProperties } from "./decorators";

import { Client } from "@notionhq/client";
import { DatabaseMap } from "./utils/database-map";
import { NotionDatabase } from "./notion.database";
import { NotionException } from "./exceptions";

@Injectable()
export class NotionService {
    private _client?: Client;
    private _manager?: Type<ManagerDatabaseInterface<any>>;
    private readonly databaseMap = new DatabaseMap();

    public get client(): Client {
        if (this._client === undefined) {
            throw new NotionException("Notion client is not defined");
        }

        return this._client;
    }

    public get databases() {
        return this.databaseMap;
    }

    public from<T extends DatabaseTargetType>(target: T): ManagerDatabaseInterface<InstanceType<T>> {
        if (this._client === undefined) {
            throw new NotionException("Notion client is not defined");
        }

        const raw = this.databaseMap.get(target);
        const Manager = this._manager ?? NotionDatabase;

        return new Manager({
            target: raw.target,
            database: raw.database,
            properties: raw.properties,
            client: this._client,
        });
    }

    public setClient(client: Client): void {
        this._client = client;
    }

    public setManager(manager: Type<ManagerDatabaseInterface<any>>): void {
        this._manager = manager;
    }

    public addDatabases(databases: DatabaseTargetType[]): void {
        for (const entity of databases) {
            const database = {
                target: entity,
                database: getNotionMetadataDatabase(entity),
                properties: getNotionMetadataProperties(entity),
            };

            this.databaseMap.set(entity, database);
        }
    }
}
