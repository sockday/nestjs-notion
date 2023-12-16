import { Client } from "@notionhq/client";
import { Module } from "@nestjs/common";
import { NotionModule } from "./../../lib";
import { Roles } from "./users/roles.database";
import { Users } from "./users/users.database";

@Module({
    imports: [
        NotionModule.forRoot({
            client: new Client({
                auth: process.env.NOTION_TOKEN,
                timeoutMs: 10000,
            }),
            databases: [Users, Roles],
        }),
    ],
})
export class ApplicationModule {}
