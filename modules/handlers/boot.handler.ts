import "reflect-metadata";
import express from "express";
import { IServerOptions } from "../interfaces/server-options.interface";
import { UseJwtMiddleware } from "../middlewares/jwt.middleware";
import { UseCorsMiddleware } from "../middlewares/cors.middleware";
import { UseGqlServer } from "../middlewares/gql-server.middleware";
import { ExpirationFreqEnum } from "../core/services/JwtAuthService";
import { UseRestMiddleware } from "../middlewares/rest.middleware";
import {
  IsNullOrUndefined,
  IsStringEmptyNullOrUndefined,
} from "wgo-extensions";
import { join } from "path";
import { PublicDirectoryMiddleware } from "../middlewares/public-directory.middleware";
import { ITranslationModel } from "@wisegar-org/wgo-base-models";
import { GetOpenCRMPathRoot } from "../core/services/EnvService";
import { UseLoggerMiddleware } from "../middlewares/logger.middleware";

export type BootFunc = (options: IServerOptions) => void;

export const boot = async (options: IServerOptions, onStart?: BootFunc) => {
  options.app = options.app ? options.app : express();

  options.app.use(express.json());

  options.expirationFreq = options.expirationFreq
    ? options.expirationFreq
    : ExpirationFreqEnum.Normal;

  process.env.OPENCRM_PATH_ROOT = join(__dirname, "../../..");

  const rootPath = GetOpenCRMPathRoot();
  console.debug("wgo-opencrm root path: ", rootPath);

  UseLoggerMiddleware(options);
  console.debug("Registering Logger middleware");

  console.debug("Registering Cors middleware");
  UseCorsMiddleware(options);

  console.debug("Registering Jwt middleware");
  UseJwtMiddleware(options);

  //NOTE: Do not use if using graphql
  // console.debug("Registering FileUpload middleware");
  // UseFileUploadMiddleware(options);

  console.debug("Registering Public Directory Middleware");
  PublicDirectoryMiddleware(options);

  options.app.locals.getTranslation = (
    key: string,
    translations: ITranslationModel[]
  ) => {
    if (IsStringEmptyNullOrUndefined(key)) return "Undefined translation";
    if (!translations || translations.length === 0)
      return "Undefined translations";
    const translationModel = translations.find((t) => t.key === key);
    return translationModel?.value ? translationModel.value : "";
  };

  console.debug("Registering backoffice spa application");
  options.app.use(
    "/backoffice",
    express.static(join(rootPath, "build", "backoffice"))
  );

  if (options.controllers && options.controllers.length > 0) {
    console.debug("Registering Rest middleware");
    UseRestMiddleware(options);
  }

  if (options.resolvers && options.resolvers.length > 0) {
    console.debug("Registering Graphql middleware");
    UseGqlServer(options);
  }

  if (options.middlewares) {
    console.debug("Registering Extras middleware");
    options.middlewares(options.app);
  }

  options.app?.listen(options.port, () => {
    if (onStart) onStart(options);
    console.log(`> Listening on port ${options.port}`);
  });

  process.on("SIGINT", function () {
    process.exit(0);
  });
};

export const bootOnly = async (
  options: IServerOptions,
  onSetup: BootFunc,
  onStart?: BootFunc
) => {
  options.app = options.app ? options.app : express();
  options.app.use(express.json());
  options.expirationFreq = options.expirationFreq
    ? options.expirationFreq
    : ExpirationFreqEnum.Normal;

  if (IsNullOrUndefined(onSetup)) throw new Error("Invalid onSetup parameter");
  onSetup(options);

  options.app?.listen(options.port, () => {
    if (onStart) onStart(options);
    console.log(`> Listening on port ${options.port}`);
  });

  process.on("SIGINT", function () {
    process.exit(0);
  });
};
