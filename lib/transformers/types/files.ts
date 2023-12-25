import type { PropertyType } from "../../interfaces/properties.interface";
import { Transformer } from "../transformer.abstract";

type Value = PropertyType<"files">;

export class FilesTransformer extends Transformer<"files", string[]> {
    public readonly type = "files";

    public encode(value: string[]) {
        return {
            files: value.map((item, i) => ({ external: { url: item }, name: `file${i}`, type: "external" })),
            type: "files",
        } as Value;
    }

    public decode(value: Value) {
        return value.files.map((item) => {
            if ("file" in item) return item.file.url;

            return item.external.url;
        });
    }
}
