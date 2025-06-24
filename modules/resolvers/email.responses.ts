import { Field, ObjectType } from "type-graphql";
import { WGEmail } from "./email.inputs";
import { GenericResponse } from "./core.responses";

@ObjectType()
export class EmailResponse extends GenericResponse(WGEmail) {
  @Field(() => Boolean) sent!: boolean;
  @Field(() => String) error!: string;
  @Field(() => Boolean) isSuccess!: boolean;
}
