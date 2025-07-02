import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class TranslationResponse {
  @Field() id!: string;
  @Field() key!: string;
  @Field() value!: string;
  @Field() languageId!: number;
}
