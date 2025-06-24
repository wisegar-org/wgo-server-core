import { ClassType, Field, ObjectType } from "type-graphql";

export function GenericResponse<T extends object>(TItemClass: ClassType<T>) {
  abstract class Response {
    @Field()
    isSuccess!: boolean;
    @Field(() => TItemClass, { nullable: true })
    result!: T | null;
    @Field(() => String, { nullable: true })
    message!: string | null;
    @Field(() => String, { nullable: true })
    error!: string | null;
  }
  return Response;
}

export function GenericArrayResponse<T extends object>(
  TItemClass: ClassType<T>
) {
  abstract class ArrayResponse {
    @Field()
    isSuccess!: boolean;
    @Field(() => [TItemClass])
    result!: T[] | null;
    @Field(() => String, { nullable: true })
    message!: string | null;
    @Field(() => String, { nullable: true })
    error!: string | null;
  }
  return ArrayResponse;
}

@ObjectType()
export class LocalStorageResponse {
  @Field(() => String, { nullable: false })
  storage?: string;
}
