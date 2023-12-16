import { ApplicationModule } from "../src/app.module";
import { INestApplication } from "@nestjs/common";
import { Notion } from "../../lib";
import { Roles } from "../src/users/roles.database";
import { Test } from "@nestjs/testing";
import { Users } from "../src/users/users.database";

describe("Notion", () => {
    let app: INestApplication;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [ApplicationModule],
        }).compile();

        app = module.createNestApplication();

        await app.init();
    });

    it("should be defined roles database", async () => {
        const object = app.get(Notion).from(Roles);

        await object.syncProperties();
    });

    it("should be defined users database", async () => {
        const object = app.get(Notion).from(Users);

        await object.syncProperties();
    });

    it("should be create in database", async () => {
        const object = app.get(Notion).from(Roles);

        const user = new Roles();
        user.name = "User";

        const admin = new Roles();
        admin.name = "Admin";

        await object.create(user);
        await object.create(admin);
    });

    it("should be delete from database", async () => {
        const object = app.get(Notion).from(Roles);

        const roles = await object.all();

        for (const role of roles) {
            await object.archive(role.id);
        }

        expect((await object.all()).length).toBe(0);
    });

    it("create roles and users", async () => {
        const notion = app.get(Notion);

        const roles = notion.from(Roles);
        const users = notion.from(Users);

        const userRole = new Roles();
        userRole.name = "User";

        const role = await roles.create(userRole);

        const user = new Users();
        user.name = "User";
        user.select = "Option1";
        user.checkbox = true;
        user.roles = [role.id];

        await users.create(user);
    });
});
