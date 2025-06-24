import { GraphQLUpload } from "graphql-upload";

export class MediaInputArg {
  file!: Promise<typeof GraphQLUpload>;
  isPublic!: boolean;
}

export class MediasInputArg {
  files!: MediaInputArg[];
}
