import { Field, InputType } from "type-graphql";

@InputType()
export class PostSettingValueInput {
  @Field() type!: string;
  @Field() value!: string;
}

@InputType()
export class PostSettingInput {
  @Field() type_settings!: string;
  @Field() key!: string;
  @Field(() => PostSettingValueInput) value!: PostSettingValueInput;
}
