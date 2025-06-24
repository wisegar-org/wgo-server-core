import { DocumentNode } from "graphql";
import { AuthMode, NonEmptyArray } from "type-graphql";
import { IContextOptions } from "./context-options.interface";
import { ExpirationFreqEnum } from "../core/services/JwtAuthService";
import { CorsOptions } from "cors";
import { Context } from "../core/models/Models";
import { ValidateSettings } from "type-graphql/build/typings/schema/build-context";

export interface IServerOptions {
  /**
   * @summary If not provided a new instance on Express app server w'll be used
   */
  app?: any;
  controllers: any[];
  resolvers: any;
  authenticator: (userContext: Context, roles: any) => Promise<boolean>;
  formatError: (err: any) => Error;
  context: (contextOptions: IContextOptions) => Promise<Context>;
  authMode?: AuthMode;
  production?: boolean;
  middlewares?: (app: any) => void;
  port?: number;
  gqlValidateSettings?: ValidateSettings;
  //Max allowed non-file multipart form field size in bytes; enough for your queries (default: 1 MB).
  maxFieldSize?: number;
  //Max allowed file size in bytes (default: Infinity).
  maxFileSize?: number;
  //Max allowed number of files (default: Infinity).
  maxFiles?: number;
  typeDefs?: DocumentNode | Array<DocumentNode> | string | Array<string>;
  useCors?: boolean;
  corsOptions?: CorsOptions;
  publicKey: string;
  privateKey: string;
  expiresIn: any;
  /**
   * @deprecated Please use property expirationFreq instead
   */
  timeBeforeExpiration?: string;
  expirationFreq: ExpirationFreqEnum;
}
