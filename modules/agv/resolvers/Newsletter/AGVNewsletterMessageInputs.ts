import { InputType, Field } from "type-graphql";

@InputType()
export class AGVNewsletterMessageInput {
  @Field(() => Number, { nullable: true }) id!: number;
  @Field(() => String, { nullable: false }) message!: string;
  @Field(() => String, { nullable: false }) title!: string;
  @Field(() => String, { nullable: true, defaultValue: "" }) status!: string;
}

@InputType()
export class AGVNewsletterMessageFilterInput {
  @Field(() => String, { nullable: true }) title!: string;
  @Field(() => String, { nullable: true }) status!: string;
}

@InputType()
export class AGVNewsletterMessagePageInput {
  @Field(() => Number) skip!: number;
  @Field(() => Number) take!: number;
  @Field(() => Boolean) descending!: boolean;
  @Field(() => String) sortBy!: string;
  @Field(() => AGVNewsletterMessageFilterInput, { nullable: true })
  filter!: AGVNewsletterMessageFilterInput;
}
