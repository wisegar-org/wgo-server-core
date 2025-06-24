import { Field, InputType } from "type-graphql";

@InputType()
export class FinanceIssuesFilterInput {
  @Field(() => Number, { defaultValue: 0 }) project!: number;
  @Field(() => String, { defaultValue: 0 }) repository!: string;
  @Field(() => String, { defaultValue: 0 }) assignedTo!: string;
  @Field(() => String, { defaultValue: "" }) labels!: string;
  @Field(() => String, { defaultValue: "" }) minDate!: string;
  @Field(() => String, { defaultValue: "" }) maxDate!: string;
  @Field(() => Number, { defaultValue: 0 }) status!: number;
}

@InputType()
export class FinanceIssuesPageInput {
  @Field(() => Number, { defaultValue: 0 }) skip!: number;
  @Field(() => Number, { defaultValue: 5 }) take!: number;
  @Field(() => FinanceIssuesFilterInput) filter!: FinanceIssuesFilterInput;

  @Field(() => String, { defaultValue: "" }) sortBy!: string;
  @Field(() => Boolean, { defaultValue: true }) descending!: boolean;
}
