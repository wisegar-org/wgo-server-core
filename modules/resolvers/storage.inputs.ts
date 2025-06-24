import { Field, InputType } from "type-graphql";

@InputType()
export class StorageInput {
  @Field(() => Number, { nullable: false }) id!: number;
  @Field(() => String) type!: string;
  @Field(() => String) content!: String;

  @Field((type) => Number, { nullable: true })
  image?: number;
  @Field((type) => [Number], { nullable: true })
  imageList?: number[];
}

@InputType()
export class StoragePageInput {
  @Field(() => Number) lang!: number;
  @Field(() => Boolean, { defaultValue: true }) loadTranslations!: boolean;
  @Field(() => Number, { defaultValue: 0 }) skip!: number;
  @Field(() => Number, { defaultValue: 5 }) take!: number;
  @Field(() => String) type!: string;
  @Field(() => String) urlApi!: string;
  @Field(() => String, { defaultValue: "" }) search!: string;
  @Field(() => Boolean, { defaultValue: false }) descending!: boolean;
  @Field(() => String, { defaultValue: "" }) sortBy!: string;
}

@InputType()
export class StorageAllInput {
  @Field(() => Number) lang!: number;
  @Field(() => Boolean, { defaultValue: true }) loadTranslations!: boolean;
  @Field(() => String) type!: string;
  @Field(() => String) urlApi!: string;
  @Field(() => String, { defaultValue: "" }) search!: string;
}
