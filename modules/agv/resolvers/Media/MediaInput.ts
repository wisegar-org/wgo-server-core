import { GraphQLUpload } from "graphql-upload";
import { InputType, Field } from "type-graphql";

@InputType()
export class MediaInput {
  @Field(() => GraphQLUpload, { description: "File uploaded" })
  file!: Promise<typeof GraphQLUpload>;
  @Field(() => Boolean, { description: "Flag public file" })
  isPublic!: boolean;
}
@InputType()
export class MediasInput {
  @Field(() => [MediaInput], { description: "File uploaded" })
  files!: MediaInput[];
}
