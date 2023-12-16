import type { MetadataDatabaseInterface, MetadataPropertyOptionsInterface } from "../../../lib/interfaces";
import { NotionDatabase, NotionProperty } from "../../../lib";

export const DATABASE: MetadataDatabaseInterface = { name: "Roles", id: process.env.NOTION_ROLES_DATABASE_ID! };

@NotionDatabase(DATABASE)
export class Roles {
    @NotionProperty({ key: "Name", type: "title", title: {} })
    name!: string;
}
