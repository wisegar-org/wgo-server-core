import { GraphQLUpload } from "graphql-upload";
import { Field, InputType } from "type-graphql";

@InputType()
export class GetAllTranslationInput {
  @Field() languageId!: number;
  @Field({ nullable: true, defaultValue: "" }) search!: string;
}

@InputType()
export class GetTranslationByKeysInput {
  @Field() languageId!: number;
  @Field(() => [String]) keys!: string[];
}

@InputType()
export class TranslationInput {
  @Field() key!: string;
  @Field() value!: string;
  @Field() languageId!: number;
}

@InputType()
export class SetTranslationInput {
  @Field(() => TranslationInput, { nullable: true })
  translation?: TranslationInput;
  @Field(() => [TranslationInput], { nullable: true })
  translations?: TranslationInput[];
}

@InputType()
export class ExportTranslationInput {
  @Field(() => [Number], { nullable: true }) languagesId?: number[];
}

@InputType()
export class DeleteTranslationInput {
  @Field() key!: string;
}

@InputType()
export class ImportTranslationsInput {
  @Field(() => GraphQLUpload, { description: "File uploaded", nullable: true })
  file!: typeof GraphQLUpload;
}
