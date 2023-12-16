import type { PropertyType } from "../../interfaces/properties.interface";
import { Transformer } from "../transformer.abstract";

type Value = PropertyType<"number">;

export class NumberTransformer extends Transformer<"number", number | null> {
    public readonly type = "number";

    public encode(value: number | null) {
        return {
            type: "number",
            number: value,
        } as Value;
    }

    public decode(value: Value) {
        return value.number;
    }
}
