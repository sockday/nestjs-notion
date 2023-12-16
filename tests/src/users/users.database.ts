import type { MetadataDatabaseInterface, MetadataPropertyOptionsInterface } from "../../../lib/interfaces";
import { NotionDatabase, NotionProperty } from "../../../lib";

export const DATABASE: MetadataDatabaseInterface = { name: "Users", id: process.env.NOTION_USERS_DATABASE_ID! };
export const PROPERTY_NAME: MetadataPropertyOptionsInterface = { key: "Name", type: "title", title: {} };
export const PROPERTY_EMAIL: MetadataPropertyOptionsInterface = { key: "Email", type: "rich_text", rich_text: {} };
export const PROPERTY_TEST: MetadataPropertyOptionsInterface = { key: "Test", type: "rich_text", rich_text: {} };
export const PROPERTY_SELECT: MetadataPropertyOptionsInterface = {
    key: "Select",
    type: "select",
    select: {
        options: [
            { name: "Option1", color: "red" },
            { name: "Option2", color: "blue" },
        ],
    },
};
export const PROPERTY_CHECKBOX: MetadataPropertyOptionsInterface = { key: "Checkbox", type: "checkbox", checkbox: {} };
export const PROPERTY_ROLES: MetadataPropertyOptionsInterface = {
    key: "Roles",
    type: "relation",
    relation: { database_id: process.env.NOTION_ROLES_DATABASE_ID!, single_property: {} },
};

@NotionDatabase(DATABASE)
export class Users {
    @NotionProperty(PROPERTY_NAME)
    name!: string;

    @NotionProperty(PROPERTY_EMAIL)
    email!: string;

    @NotionProperty(PROPERTY_TEST)
    "test@"!: string;

    @NotionProperty(PROPERTY_SELECT)
    select!: "Option1" | "Option2";

    @NotionProperty(PROPERTY_CHECKBOX)
    checkbox!: boolean;

    @NotionProperty(PROPERTY_ROLES)
    roles!: string[];
}
