import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class TemplateResponse {
  @Field(() => Number, { nullable: true }) id!: number;
  @Field(() => String, { nullable: false }) title!: string;
  @Field(() => String, { nullable: false }) body!: string;
  @Field(() => String, { nullable: false }) documentType!: string;
}
