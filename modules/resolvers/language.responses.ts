import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class LanguageResponse {
  @Field() id!: number;
  @Field() code!: string;
  @Field() enabled!: boolean;
  @Field() default!: boolean;
}
