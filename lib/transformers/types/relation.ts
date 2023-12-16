import type { PropertyType } from "../../interfaces/properties.interface";
import { Transformer } from "../transformer.abstract";

type Value = PropertyType<"relation">;

export class RelationTransformer extends Transformer<"relation", string[]> {
    public readonly type = "relation";

    public encode(value: string[]) {
        return {
            type: "relation",
            relation: value.map((id) => ({ id })),
        } as Value;
    }

    public decode(value: Value) {
        return value.relation.map((item) => item.id);
    }
}
