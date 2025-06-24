import "reflect-metadata";
import { buildSchema, BuildSchemaOptions } from "type-graphql";
import { IServerOptions } from "../interfaces/server-options.interface";
import { IsNullOrUndefined } from "wgo-extensions";
import { Context } from "../core/models/Models";

export const getGqlSchema = async (options: IServerOptions) => {
  const buildSchemaOptions: BuildSchemaOptions = {
    resolvers: options.resolvers,
    authChecker: (context, roles: any) => {
      return options.authenticator(context as Context, roles);
    },
    authMode: options.authMode ? options.authMode : "null",
  };
  if (!IsNullOrUndefined(options.gqlValidateSettings)) {
    buildSchemaOptions.validate = options.gqlValidateSettings;
  }
  return await buildSchema(buildSchemaOptions);
};
