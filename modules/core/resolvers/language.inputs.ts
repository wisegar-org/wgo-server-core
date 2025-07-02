import { Field, InputType } from 'type-graphql';

@InputType()
export class LanguagePostInput {
  @Field() code!: string;
  @Field() enabled!: boolean;
  @Field() default!: boolean;
}

@InputType()
export class LanguageInput extends LanguagePostInput {
  @Field() id!: number;
}
