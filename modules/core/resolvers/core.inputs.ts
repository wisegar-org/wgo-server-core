import { InputType, Field } from 'type-graphql';

@InputType()
export class IdInput {
  @Field() id!: number;
}
