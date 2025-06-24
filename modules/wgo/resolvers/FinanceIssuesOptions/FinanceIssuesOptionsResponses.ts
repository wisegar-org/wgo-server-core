import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class FinanceLabelOption {
  @Field(() => Number, { nullable: false }) id!: number;
  @Field(() => String, { nullable: false }) title!: string;
}

@ObjectType()
export class FinanceAssignedToOption {
  @Field(() => Number, { nullable: true }) id!: number;
  @Field(() => Number, { nullable: true }) id_github!: number;
  @Field(() => Number, { nullable: true, defaultValue: 0 })
  card_number!: number;
  @Field(() => Number, { nullable: true }) pay_by_hours!: number;
  @Field(() => String, { nullable: true }) login!: string;
  @Field(() => String, { nullable: true }) node_id!: string;
  @Field(() => String, { nullable: true }) type!: string;
  @Field(() => String, { nullable: true }) avatar_url!: string;
  @Field(() => String, { nullable: true }) url!: string;
  @Field(() => String, { nullable: true }) name!: string;
  @Field(() => String, { nullable: true }) location!: string;
  @Field(() => String, { nullable: true }) email!: string;
  @Field(() => String, { nullable: true }) bio!: string;
  @Field(() => String, { nullable: true }) address!: string;
  @Field(() => String, { nullable: true }) cap!: string;
  @Field(() => String, { nullable: true }) place!: string;
}

@ObjectType()
export class FinanceProjectOption {
  @Field(() => Number, { nullable: false }) id!: number;
  @Field(() => String, { nullable: false }) title!: string;
}

@ObjectType()
export class FinanceRepositoryOption {
  @Field(() => Number, { nullable: false }) id!: number;
  @Field(() => String, { nullable: false }) title!: string;
}
