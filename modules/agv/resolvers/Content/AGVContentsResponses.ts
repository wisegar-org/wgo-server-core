import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class AGVContentsResponse {
  @Field(() => String) contents!: string;
}
