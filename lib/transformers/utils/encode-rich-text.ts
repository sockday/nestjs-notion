import { NotionException } from "../../exceptions";
import type { PropertyType } from "../../interfaces/properties.interface";

type Value = PropertyType<"rich_text">["rich_text"][any];

export function encodeRichText(value: Value): string {
    if (value.type === "text") {
        return value.text.content;
    }

    if (value.type === "mention") {
        if ("user" in value.mention) {
            return value.mention.user.id;
        }

        if ("page" in value.mention) {
            return value.mention.page.id;
        }

        if ("database" in value.mention) {
            return value.mention.database.id;
        }

        if ("date" in value.mention) {
            return value.mention.date.start;
        }
    }

    if (value.type === "equation") {
        return value.equation.expression;
    }

    throw new NotionException(`Unknown rich text type: ${value.type}`);
}
