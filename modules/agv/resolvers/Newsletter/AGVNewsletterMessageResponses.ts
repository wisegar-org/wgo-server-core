import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class AGVNewsletterMessageResponse {
  @Field(() => Number, { nullable: true }) id!: number;
  @Field(() => String, { nullable: false }) title!: string;
  @Field(() => String, { nullable: false }) message!: string;
  @Field(() => String, { nullable: false }) status!: string;
}

@ObjectType()
export class AGVNewsletterMessagesPageResponse {
  @Field(() => [AGVNewsletterMessageResponse])
  messages!: AGVNewsletterMessageResponse[];
  @Field(() => Number) count!: number;
}

@ObjectType()
export class AGVNewsletterGetMessagesResponse {
  @Field(() => AGVNewsletterMessageResponse, { nullable: true })
  message!: AGVNewsletterMessageResponse;
}
