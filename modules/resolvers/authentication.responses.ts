import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class UserResponse {
  @Field() id!: number;
  @Field() name!: string;
  @Field() lastName!: string;
  @Field() userName!: string;
  @Field() email!: string;
  @Field() isEmailConfirmed!: boolean;
  @Field({ defaultValue: "", nullable: true }) code!: string;
  @Field({ defaultValue: "", nullable: true }) cap!: string;
  @Field({ defaultValue: "", nullable: true }) phone!: string;
  @Field({ defaultValue: "", nullable: true }) address!: string;
  @Field({ defaultValue: "", nullable: true }) certificate!: string;
  @Field(() => [String]) roles!: string[];
}

@ObjectType()
export class LoginResponse {
  @Field(() => UserResponse, { nullable: true }) user!: UserResponse;
  @Field() token!: string;
}
