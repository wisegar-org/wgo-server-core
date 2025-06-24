import { Field, InputType } from "type-graphql";

@InputType()
export class TemplateInput {
  @Field(() => Number, { nullable: true }) id!: number;
  @Field(() => String, { nullable: false }) title!: string;
  @Field(() => String, { nullable: false }) body!: string;
  @Field(() => String, { nullable: false }) documentType!: string;
}
