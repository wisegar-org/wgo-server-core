import { ApolloServer, BaseContext } from "@apollo/server";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";
import { IServerOptions } from "../interfaces/server-options.interface";
import { getGqlSchema } from "./graphql-schema";

export const getApolloServer = async (options: IServerOptions) => {
  const schema = await getGqlSchema(options);
  return new ApolloServer<BaseContext>({
    schema: schema,
    plugins: [
      options.production
        ? ApolloServerPluginLandingPageProductionDefault()
        : ApolloServerPluginLandingPageLocalDefault(),
    ],
  });
};
