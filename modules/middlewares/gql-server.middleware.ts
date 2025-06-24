import { IsNull, IsNullOrUndefined } from "wgo-extensions";
import { getApolloServer } from "../graphql/graphql-server";
import { IServerOptions } from "../interfaces/server-options.interface";
import { expressMiddleware } from "@apollo/server/express4";
import { json } from "body-parser";
import { UseGQLUploadExpress } from "./gql-upload.middleware";
import { contextHandler } from "../handlers/context.handler";

export const UseGqlServer = (options: IServerOptions) => {
  if (IsNullOrUndefined(options)) throw new Error("Invalid options parameter");

  if (!options.app || IsNull(options.app))
    throw new Error("Invalid options app parameter");

  getApolloServer(options).then((server) => {
    UseGQLUploadExpress(options);
    server.start().then(() => {
      options.app.use(
        "/graphql",
        json(),
        expressMiddleware(server, {
          context: async ({ req, res }) => contextHandler(options, req, res),
        })
      );
    });
  });
};
