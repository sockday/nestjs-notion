import type { PropertyType } from "../../interfaces/properties.interface";
import { Transformer } from "../transformer.abstract";

type Value = PropertyType<"url">;

export class UrlTransformer extends Transformer<"url", string | null> {
    public readonly type = "url";

    public encode(value: string | null) {
        return { url: value, type: "url" } as Value;
    }

    public decode(value: Value) {
        return value.url;
    }
}
