import type { Client } from "@notionhq/client";
import type { DatabaseTargetType } from "./database.interface";
import type { ManagerDatabaseInterface } from "../interfaces";
import type { Type } from "@nestjs/common";

export interface ModuleOptionsInterface {
    client: Client;
    manager?: Type<ManagerDatabaseInterface<any>>;
    databases: DatabaseTargetType[];
}
