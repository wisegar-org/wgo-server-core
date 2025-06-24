import { Field, InputType } from "type-graphql";

@InputType()
export class LoginInput {
  @Field() user!: string;
  @Field() password!: string;
}

@InputType()
export class MeInput {
  @Field() token!: string;
}

@InputType()
export class RegisterInput {
  @Field() name!: string;
  @Field() lastName!: string;
  @Field() userName!: string;
  @Field() email!: string;
  @Field() password!: string;
  @Field({ defaultValue: "" }) cap!: string;
  @Field({ defaultValue: "" }) code!: string;
  @Field({ defaultValue: "" }) certificate!: string;
  @Field({ defaultValue: "" }) address!: string;
  @Field({ defaultValue: "" }) phone!: string;
  @Field({ defaultValue: false }) isEmailConfirmed!: boolean;
  @Field(() => [String], { nullable: true, defaultValue: [] }) roles?: string[];
}

@InputType()
export class EditUserInput extends RegisterInput {
  @Field() id!: number;
  @Field() code!: string;
}

@InputType()
export class ResendConfirmationInput {
  @Field() email!: string;
}

@InputType()
export class ResetPasswordInput {
  @Field() token!: string;
  @Field() password!: string;
}

@InputType()
export class ValidUserNameInput {
  @Field({ defaultValue: 0, nullable: true }) id!: number;
  @Field() userName!: string;
}
