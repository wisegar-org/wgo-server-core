import { InputType, Field, Int } from "type-graphql";

@InputType()
export class AGVInscriptionInput {
  @Field(() => Number, { nullable: false }) id!: number;
  @Field(() => String, { nullable: false }) nome!: string;
  @Field(() => String, { nullable: false }) cognome!: string;
  @Field(() => String, { nullable: false }) email!: string;
  @Field(() => String, { nullable: false }) phone!: string;
  @Field(() => String, { nullable: false }) message!: string;
  @Field(() => String, { nullable: false }) class!: string;

  @Field(() => Int, { nullable: false }) eventId!: number;
}
@InputType()
export class AGVInscriptionFilterInput {
  @Field(() => String, { nullable: true }) class!: string;
  @Field(() => String, { nullable: true }) email!: string;
  @Field(() => String, { nullable: true }) eventClass!: string;
  @Field(() => String, { nullable: true }) eventTitle!: string;
  @Field(() => String, { nullable: true }) nome!: string;
  @Field(() => String, { nullable: true }) phone!: string;
}

@InputType()
export class AGVInscriptionPageInput {
  @Field(() => Number) skip!: number;
  @Field(() => Number) take!: number;
  @Field(() => Boolean) descending!: boolean;
  @Field(() => String) sortBy!: string;
  @Field(() => AGVInscriptionFilterInput, { nullable: true })
  filter!: AGVInscriptionFilterInput;
}
