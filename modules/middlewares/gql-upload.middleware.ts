import { IsNullOrUndefined } from "wgo-extensions";
import { graphqlUploadExpress } from "graphql-upload";
import { IServerOptions } from "../interfaces/server-options.interface";

export const UseGQLUploadExpress = (options: IServerOptions) => {
  if (IsNullOrUndefined(options)) throw new Error("Invalid options parameter");
  if (IsNullOrUndefined(options.app))
    throw new Error("Invalid options app parameter");

  options?.app?.use(
    graphqlUploadExpress({
      maxFileSize: options.maxFileSize ? options.maxFileSize : 100000,
      maxFiles: options.maxFiles ? options.maxFileSize : 10,
    })
  );
};
