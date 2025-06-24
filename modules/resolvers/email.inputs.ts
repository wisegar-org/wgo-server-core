import { Field, InputType, ObjectType } from "type-graphql";

@InputType()
export class WGEmailFromToAppInput {
  @Field(() => String) subject!: string;
  @Field(() => String) body!: string;
  @Field(() => String, { nullable: true }) data!: string;
}
@InputType()
export class WGEmailToAppInput extends WGEmailFromToAppInput {
  @Field(() => String) from!: string;
}
@InputType()
export class WGEmailInput extends WGEmailToAppInput {
  @Field(() => String) to!: string;
}

@InputType()
export class WGEmailToAddressAndAppInput extends WGEmailFromToAppInput {
  @Field(() => String) to!: string;
}

@ObjectType()
export class WGEmailFromToApp {
  @Field(() => String) subject!: string;
  @Field(() => String) body!: string;
}
@ObjectType()
export class WGEmailToApp extends WGEmailFromToApp {
  @Field(() => String) from!: string;
}
@ObjectType()
export class WGEmail extends WGEmailToApp {
  @Field(() => String) to!: string;
}
