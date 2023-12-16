import {
    DATABASE,
    PROPERTY_CHECKBOX,
    PROPERTY_EMAIL,
    PROPERTY_NAME,
    PROPERTY_SELECT,
    PROPERTY_TEST,
    Users,
} from "../src/users/users.database";

import { ApplicationModule } from "../src/app.module";
import { INestApplication } from "@nestjs/common";
import { Notion } from "../../lib";
import { Test } from "@nestjs/testing";

describe("Main", () => {
    let app: INestApplication;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [ApplicationModule],
        }).compile();

        app = module.createNestApplication();

        await app.init();
    });

    it("should be defined users database", () => {
        const object = app.get(Notion).from(Users);

        expect(object).toBeDefined();
        expect(object.database).toEqual(DATABASE);
        expect(object.properties.get("name")).toEqual(PROPERTY_NAME);
        expect(object.properties.get("email")).toEqual(PROPERTY_EMAIL);
        expect(object.properties.get("test@")).toEqual(PROPERTY_TEST);
        expect(object.properties.get("select")).toEqual(PROPERTY_SELECT);
        expect(object.properties.get("checkbox")).toEqual(PROPERTY_CHECKBOX);
    });

    it("entity to data", () => {
        const object = app.get(Notion).from(Users);
        const user = object.entityToData({
            name: "name",
            email: "email",
            "test@": "test",
            select: "Option1",
            checkbox: true,
            roles: [],
        });

        expect(user).toBeDefined();
        expect(user["Name"]).toEqual({
            type: "title",
            title: [{ type: "text", text: { content: "name" } }],
        });
        expect(user["Email"]).toEqual({
            type: "rich_text",
            rich_text: [{ type: "text", text: { content: "email" } }],
        });
        expect(user["Test"]).toEqual({
            type: "rich_text",
            rich_text: [{ type: "text", text: { content: "test" } }],
        });
        expect(user["Select"]).toEqual({
            type: "select",
            select: { name: "Option1" },
        });
        expect(user["Checkbox"]).toEqual({
            type: "checkbox",
            checkbox: true,
        });
        expect(user["Roles"]).toEqual({
            type: "relation",
            relation: [],
        });
    });

    it("data to entity", () => {
        const object = app.get(Notion).from(Users);
        const user = object.dataToEntity({
            name: {
                type: "title",
                title: [{ type: "text", text: { content: "name" } }],
            },
            email: {
                type: "rich_text",
                rich_text: [{ type: "text", text: { content: "email" } }],
            },
            "test@": {
                type: "rich_text",
                rich_text: [{ type: "text", text: { content: "test" } }],
            },
            select: {
                type: "select",
                select: { name: "Option1", color: "red" },
            },
            checkbox: {
                type: "checkbox",
                checkbox: true,
            },
            roles: {
                type: "relation",
                relation: [],
            },
        });

        expect(user).toBeDefined();
        expect(user.name).toEqual("name");
        expect(user.email).toEqual("email");
        expect(user["test@"]).toEqual("test");
        expect(user.select).toEqual("Option1");
        expect(user.checkbox).toEqual(true);
        expect(user.roles).toEqual([]);
    });
});
