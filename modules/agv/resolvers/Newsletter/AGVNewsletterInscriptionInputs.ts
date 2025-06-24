import { InputType, Field } from "type-graphql";

@InputType()
export class AGVNewsletterInscriptionInput {
  @Field(() => Number, { nullable: true }) id!: number;
  @Field(() => String, { nullable: false }) email!: string;
  @Field(() => String, { nullable: false }) status!: string;
}

@InputType()
export class AGVNewsletterInscriptionFilterInput {
  @Field(() => String, { nullable: true }) email!: string;
  @Field(() => String, { nullable: true }) status!: string;
}

@InputType()
export class AGVNewsletterInscriptionPageInput {
  @Field(() => Number) skip!: number;
  @Field(() => Number) take!: number;
  @Field(() => Boolean) descending!: boolean;
  @Field(() => String) sortBy!: string;
  @Field(() => AGVNewsletterInscriptionFilterInput, { nullable: true })
  filter!: AGVNewsletterInscriptionFilterInput;
}

@InputType()
export class AGVNewsletterInscriptionSendEmailStatusInput {
  @Field(() => [String]) emails!: string[];
}
