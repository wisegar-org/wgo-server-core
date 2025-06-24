import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class AGVNewsletterInscriptionResponse {
  @Field(() => Number, { nullable: true }) id!: number;
  @Field(() => String, { nullable: false }) email!: string;
  @Field(() => String, { nullable: false }) status!: string;
}

@ObjectType()
export class AGVNewsletterGetInscriptionResponse {
  @Field(() => AGVNewsletterInscriptionResponse, { nullable: true })
  inscription!: AGVNewsletterInscriptionResponse;
}

@ObjectType()
export class AGVNewsletterInscriptionsPageResponse {
  @Field(() => [AGVNewsletterInscriptionResponse])
  inscriptions!: AGVNewsletterInscriptionResponse[];
  @Field(() => Number) count!: number;
}
