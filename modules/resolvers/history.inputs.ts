import { Field, InputType } from "type-graphql";

@InputType()
export class HistoricPageFilterInput {
  @Field(() => String, { nullable: true }) entity!: string;
  @Field(() => String, { nullable: true }) action!: string;
  @Field(() => String, { nullable: true }) username!: string;
}

@InputType()
export class HistoricPageInput {
  @Field(() => Number) skip!: number;
  @Field(() => Number) take!: number;
  @Field(() => Boolean) descending!: boolean;
  @Field(() => String) sortBy!: string;
  @Field(() => HistoricPageFilterInput, { nullable: true })
  filter!: HistoricPageFilterInput;
}
