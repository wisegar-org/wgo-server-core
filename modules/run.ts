import "reflect-metadata";
import {
  GetPortKey,
  GetPrivateKey,
  GetPublicKey,
  GetExpiresInKey,
} from "wgo-settings";
import { AuthenticationHandler } from "./wgo/handlers/AuthenticationHandler";
import { AppContextHandler, ctx } from "./wgo/handlers/AppContextHandler";
import { errorHandler } from "./wgo/handlers/ErrorHandler";
import { createDatabase, dropDatabase } from "typeorm-extension";
import { getResolvers } from "./wgo/resolvers";
import { UseHandlebarsRenderMiddleware } from "./agv/middlewares/HandlebarsRenderMiddleware";
import {
  UseAssetsHBHostMiddleware,
  UseClientSPAHostMiddleware,
  UsePublicMediaHostMiddleware,
} from "./agv/middlewares/HostClientMiddleware";
import {
  dataSourceOptions,
  PostgresDataSource,
} from "./core/database/data-source";
import { rolesDataSeeder } from "./core/database/seeders/roles.seeder";
import { usersDataSeeder } from "./core/database/seeders/users.seeder";
import { IServerOptions } from "./core/models/interfaces/server-options.interface";
import { UseRestMiddleware } from "./core/middlewares/rest.middleware";
import { ExpirationFreqEnum } from "./core/services/JwtAuthService";
import { AppController } from "./wgo/controllers/AppController";
import { UseSwaggerMiddleware } from "./core/middlewares/swagger.middleware";
import { OvhController } from "./ovh/controllers/ovh.api.controller";
import { IndexOvhController } from "./ovh/controllers/index.controller";
import { boot } from "./core/handlers/boot.handler";

const port = GetPortKey();

const serverOptions: IServerOptions = {
  authenticator: AuthenticationHandler,
  context: AppContextHandler,
  formatError: errorHandler,
  controllers: [AppController, OvhController, IndexOvhController],
  port: parseInt(port),
  maxFileSize: 5000000000,
  maxFiles: 10,
  useCors: true,
  middlewares: (app: any) => {
    UseHandlebarsRenderMiddleware(app);
    UseClientSPAHostMiddleware(app);
    UsePublicMediaHostMiddleware(app);
    UseAssetsHBHostMiddleware(app);
    UseRestMiddleware(serverOptions);
    UseSwaggerMiddleware(serverOptions);
  },
  resolvers: getResolvers(),
  privateKey: GetPrivateKey(),
  publicKey: GetPublicKey(),
  expiresIn: GetExpiresInKey(),
  expirationFreq: ExpirationFreqEnum.Low,
  gqlValidateSettings: {
    forbidUnknownValues: false,
  },
};

boot(serverOptions, async () => {
  console.log("Start other services here. ex. database connections");

  // await dropDatabase({
  //   ifExist: true,
  //   options: {
  //     ...dataSourceOptions,
  //     migrationsRun: false,
  //     entities: [],
  //     migrations: [],
  //   },
  // });

  await createDatabase({
    ifNotExist: true,
    options: {
      ...dataSourceOptions,
      migrationsRun: true,
    },
  });

  const dataSource = await PostgresDataSource.initialize();
  if (!dataSourceOptions.migrationsRun) {
    dataSource.runMigrations();
  }

  //Init db settings
  // await settingsSeeder(dataSource);

  //Core Seeders
  await rolesDataSeeder(dataSource);
  await usersDataSeeder(dataSource);
  // await languageDefaultSeeder(dataSource); //create default language
  // await mediaPublicSeeder({ ...ctx, dataSource }); //export public media files

  // Loop function
  setTimeout(async () => {}, 0);
});
