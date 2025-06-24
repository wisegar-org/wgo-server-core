import { ObjectType, Field } from "type-graphql";
import { MediaResponse } from "../../../resolvers/media.responses";

@ObjectType()
export class AGVEventResponse {
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
  @Field(() => Number) inscriptions!: number;

  @Field((type: any) => MediaResponse, { nullable: true })
  imgTitle?: MediaResponse;
  @Field((type: any) => [MediaResponse], { nullable: true })
  imgList?: MediaResponse[];
}

@ObjectType()
export class AGVEventGetNextsResponse {
  @Field(() => AGVEventResponse, { nullable: true }) evento!: AGVEventResponse;
  @Field(() => AGVEventResponse, { nullable: true }) corso!: AGVEventResponse;
}

@ObjectType()
export class AGVEventGetPageResponse {
  @Field(() => Number) count!: number;
  @Field(() => [AGVEventResponse]) events!: AGVEventResponse[];
}
