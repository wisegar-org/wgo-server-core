import { Field, ObjectType } from "type-graphql";
import { MediaResponse } from "./media.responses";

@ObjectType()
export class StorageResponse {
  @Field(() => Number, { nullable: false }) id!: number;
  @Field(() => String) type!: string;
  @Field(() => String) content!: String;

  @Field((type) => MediaResponse, { nullable: true })
  image?: MediaResponse;
  @Field((type) => [MediaResponse], { nullable: true })
  imageList?: MediaResponse[];
}

@ObjectType()
export class StoragePageResponse {
  @Field(() => Number) storageItemsCount!: number;
  @Field(() => [StorageResponse]) storageItems!: StorageResponse[];
}
