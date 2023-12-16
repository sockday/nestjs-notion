import {
    CheckboxTransformer,
    NumberTransformer,
    RelationTransformer,
    RichTextTransformer,
    SelectTransformer,
    TitleTransformer,
} from "./types";

import type { PropertyTypes } from "../interfaces/properties.interface";
import type { Transformer } from "./transformer.abstract";
import type { Type } from "@nestjs/common";

export * from "./transformer.abstract";

export const transformers: Partial<Record<PropertyTypes, Type<Transformer<any, any>>>> = {
    title: TitleTransformer,
    rich_text: RichTextTransformer,
    number: NumberTransformer,
    select: SelectTransformer,
    checkbox: CheckboxTransformer,
    relation: RelationTransformer,
};

export {
    NumberTransformer,
    RichTextTransformer,
    TitleTransformer,
    SelectTransformer,
    CheckboxTransformer,
    RelationTransformer,
};
