import { Field, InputType } from "type-graphql";

@InputType()
export class AGVContentsInput {
  @Field(() => String) contents!: string;
}
