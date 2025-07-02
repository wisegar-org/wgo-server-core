import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class SettingsValueResponse {
  @Field() type!: string;
  @Field({ nullable: true }) value!: string;
}

@ObjectType()
export class SettingsResponse {
  @Field() type_settings!: string;
  @Field() key!: string;
  @Field() value!: SettingsValueResponse;
}
