import type { PropertyType } from "../../interfaces/properties.interface";
import { Transformer } from "../transformer.abstract";

type Value = PropertyType<"checkbox">;

export class CheckboxTransformer extends Transformer<"checkbox", boolean> {
    public readonly type = "checkbox";

    public encode(value: boolean) {
        return {
            type: "checkbox",
            checkbox: !!value,
        } as Value;
    }

    public decode(value: Value) {
        return !!value.checkbox;
    }
}
