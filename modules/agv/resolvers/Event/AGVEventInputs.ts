import { InputType, Field, Int } from "type-graphql";

@InputType()
export class AGVEventInput {
  @Field(() => Number, { nullable: false }) id!: number;
  @Field(() => String) title!: string;
  @Field(() => String) description!: string;
  @Field(() => String, { nullable: true }) shortDescription!: string;
  @Field(() => String) class!: string;
  @Field(() => String) type!: string;
  @Field(() => String) state!: string;
  @Field(() => Date, { nullable: true }) startDate!: Date;
  @Field(() => Date, { nullable: true }) endDate!: Date;
  @Field(() => Boolean) visible!: boolean;
  @Field(() => Boolean) enrollment!: boolean;

  @Field(() => Int, { nullable: true })
  imgTitle?: number;
  @Field(() => [Int], { nullable: true })
  imgList?: number[];
}

@InputType()
export class AGVEventFilterInput {
  @Field(() => String, { nullable: true }) class!: string;
  @Field(() => String, { nullable: true }) state!: string;
  @Field(() => String, { nullable: true }) title!: string;
  @Field(() => String, { nullable: true }) type!: string;
  @Field(() => String, { nullable: true }) enrollment!: string;
  @Field(() => String, { nullable: true }) visible!: string;
}

@InputType()
export class AGVEventPageInput {
  @Field(() => Number) skip!: number;
  @Field(() => Number) take!: number;
  @Field(() => Boolean) descending!: boolean;
  @Field(() => String) sortBy!: string;
  @Field(() => AGVEventFilterInput, { nullable: true })
  filter!: AGVEventFilterInput;
}
