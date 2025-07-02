import { Field, InputType } from "type-graphql";
import { TranslationInput } from "../../../core/resolvers/translation.inputs";

@InputType()
export class IndexContentInputs {
  @Field(() => Number, { nullable: false })
  imageId?: number;
  @Field(() => [TranslationInput], { nullable: false })
  translations!: TranslationInput[];
}
