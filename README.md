# NestJS/Notion Client

NestJS-Notion-Client is an advanced library designed for integrating NestJS applications with Notion databases. It facilitates seamless integration with the Notion API, allowing you to use Notion databases as objects within your NestJS application. The library supports decorators for efficient data handling and provides flexible tools for data transformation to meet your application’s requirements.

## Key Features

-   NestJS Integration: Specifically developed for use in NestJS projects.
-   Decorators for Notion Operations: Utilize decorators for effective handling of Notion databases.
-   Data Transformation: Convert data from Notion into the formats required by your application.
-   CRUD Operations Support: Includes support for create, read, update, and delete operations in Notion.
-   Flexible: Supports a wide range of Notion property types.
-   Typescript Support: Written in Typescript to ensure type safety.
-   Thoroughly Tested: Rigorously tested to ensure stable performance in NestJS projects.

## The interface used with the database

```typescript
// lib/interfaces/database.interface.ts

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
```

## Usage Example

```typescript
// notion/notion.module.ts

import { Client } from "@notionhq/client";
import { User } from "./databases/user.entity";
import { Module } from "@nestjs/common";
import { NotionService } from "./notion.service";
import { NotionModule as _NotionModule } from "nestjs-notion-client";

@Module({
    imports: [
        _NotionModule.forRoot({
            client: new Client({
                auth: process.env.NOTION_TOKEN,
            }),
            databases: [User],
        }),
    ],
    providers: [NotionService],
    exports: [NotionService],
})
export class NotionModule {}
```

```typescript
// notion/notion.service.ts

import { Injectable, OnModuleInit } from "@nestjs/common";

import { User } from "./databases/user.entity";
import { Notion } from "nestjs-notion-client";

@Injectable()
export class NotionService implements OnModuleInit {
    constructor(private readonly notion: Notion) {}

    async onModuleInit() {
        // Sync properties for all databases
        for (const [database] of this.notion.databases) {
            await this.notion.from(database).syncProperties();
        }
    }

    // Create a new user
    createUser(data: User): Promise<{ id: string }> {
        return this.notion.from(User).create(data);
    }
}
```

```typescript
// notion/types/file.type.ts

import { Transformer } from "nestjs-notion-client";

type Value = {
    files: (
        | { file: { url: string; expiry_time?: string }; name: string; type?: "file" }
        | { external: { url: string }; name: string; type?: "external" }
    )[];
    type?: "files";
};

// Return the first file from the list of files
export class FileTransformer extends Transformer<"files", string[]> {
    public readonly type = "files";

    decode(value: Value): string[] {
        const file = value.files[0];

        if ("file" in file) return file.file.url;

        return file.external.url;
    }

    encode(value: string): Value {
        return {
            files: [
                {
                    external: {
                        url: value,
                    },
                    name: "File",
                },
            ],
            type: "files",
        };
    }
}
```

```typescript
// notion/databases/user.entity.ts

import { NotionDatabase, NotionProperty } from "nestjs-notion-client";
import { FileTransformer } from "../types/file.type";

@NotionDatabase({ name: "Users", id: process.env.DATABASE_USERS_ID })
export class User {
    @NotionProperty({ key: "Name", type: "title", title: {} })
    name: string;

    @NotionProperty({ key: "Description", type: "rich_text", rich_text: {} })
    description: string;

    @NotionProperty({ key: "Url", type: "url", url: {} })
    url: string;

    @NotionProperty({ key: "Logotype", type: "files", files: {}, transformer: FileTransformer })
    logotype: string;

    @NotionProperty({
        key: "Status",
        type: "select",
        select: {
            options: [
                { name: "Active", color: "green" },
                { name: "Disabled", color: "red" },
            ],
        },
    })
    status: "Active" | "Disabled";

    @NotionProperty({ key: "Created At", type: "created_time", created_time: {} })
    createdAt?: Date;
}
```

## Installation

```bash
$ npm install nestjs-notion-client
```

## License

[MIT License](LICENSE).
