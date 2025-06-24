import { Field, ObjectType } from "type-graphql";
import { MediaResponse } from "../../../resolvers/media.responses";

@ObjectType()
export class IndexContentResponse {
  @Field(() => MediaResponse, { nullable: true }) image!: MediaResponse;
}
