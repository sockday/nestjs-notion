import type { PropertyType } from "../../interfaces/properties.interface";
import { Transformer } from "../transformer.abstract";

type Value = PropertyType<"select">;

export class SelectTransformer extends Transformer<"select", string | undefined> {
    public readonly type = "select";

    public encode(value: string | undefined) {
        return {
            type: "select",
            select: value
                ? {
                      name: value,
                  }
                : null,
        } as Value;
    }

    public decode(value: Value) {
        return value.select?.name;
    }
}
