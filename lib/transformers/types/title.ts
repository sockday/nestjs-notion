import type { PropertyType } from "../../interfaces/properties.interface";
import { Transformer } from "../transformer.abstract";
import { encodeRichText } from "../utils/encode-rich-text";

type Value = PropertyType<"title">;

export class TitleTransformer extends Transformer<"title", string> {
    public readonly type = "title";

    public encode(value: string) {
        return {
            type: "title",
            title: value.split("\n").map((text) => ({
                type: "text",
                text: {
                    content: text,
                },
            })),
        } as Value;
    }

    public decode(value: Value) {
        return value.title.map(encodeRichText).join("\n");
    }
}
