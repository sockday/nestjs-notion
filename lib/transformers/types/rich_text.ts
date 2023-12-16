import type { PropertyType } from "../../interfaces/properties.interface";
import { Transformer } from "../transformer.abstract";
import { encodeRichText } from "../utils/encode-rich-text";

type Value = PropertyType<"rich_text">;

export class RichTextTransformer extends Transformer<"rich_text", string> {
    public readonly type = "rich_text";

    public encode(value: string) {
        return {
            type: "rich_text",
            rich_text: value.split("\n").map((text) => ({
                type: "text",
                text: {
                    content: text,
                },
            })),
        } as Value;
    }

    public decode(value: Value) {
        return value.rich_text.map(encodeRichText).join("\n");
    }
}
