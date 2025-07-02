import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class HistoricResponse {
  @Field(() => String, { nullable: false })
  action!: string;
  @Field(() => String, { nullable: false })
  entity!: string;
  @Field(() => Date, { nullable: false })
  creatoIl!: Date;
  @Field(() => Number, { nullable: false })
  id!: number;
  @Field(() => String, { nullable: false })
  message!: string;
  @Field(() => Date, { nullable: false })
  modificatoIl!: Date;
  @Field(() => Number, { nullable: false })
  userId!: number;
  @Field(() => String, { nullable: false })
  username!: string;
  @Field(() => String, { nullable: false })
  snapshot!: string;
}

@ObjectType()
export class AllHistoricResponse {
  @Field(() => [HistoricResponse], { defaultValue: [] })
  histories!: HistoricResponse[];
}

@ObjectType()
export class HistoricPageResponse {
  @Field(() => [HistoricResponse], { defaultValue: [] })
  histories!: HistoricResponse[];
  @Field(() => Number, { nullable: false })
  count!: number;
}

@ObjectType()
export class HistoricFiltersResponse {
  @Field(() => [String], { nullable: false })
  entities!: string[];
  @Field(() => [String], { nullable: false })
  actions!: string[];
  @Field(() => [String], { nullable: false })
  usernames!: string[];
}
