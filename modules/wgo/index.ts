// import "reflect-metadata";
// import {
//   GetPortKey,
//   GetPrivateKey,
//   GetPublicKey,
//   GetExpiresInKey,
// } from "wgo-settings";
// import { AuthenticationHandler } from "./handlers/AuthenticationHandler";
// import { AppContextHandler, ctx } from "./handlers/AppContextHandler";
// import { errorHandler } from "./handlers/ErrorHandler";
// import { Express } from "express";
// import { dataSourceOptions, PostgresDataSource } from "./dataSources";
// import { createDatabase } from "typeorm-extension";

// import { getResolvers } from "./resolvers";
// import { settingsSeeder } from "./database/seeders/SettingsSeeder";

// import { UseTemplatingMiddleware } from "./middlewares/HostTemplatingMiddleware";
// import { UseHostAdminMiddleware } from "./middlewares/HostAdminMiddleware";
// import { getControllers } from "./controllers";
// import { roleSuperAdminSeeder, userAdminSeeder } from "../authentication";
// import { agvAdminUserSeeder } from "../agv/database/seeders/AdminUserSeeder";
// import { agvTemplateSeeder } from "../agv/database/seeders/TemplateSeeder";
// import { languageDefaultSeeder } from "../language";
// import { mediaPublicSeeder } from "../storage";
// import {
//   boot,
//   ExpirationFreqEnum,
//   IServerOptions,
//   UseRestMiddleware,
// } from "../core";

// const port = GetPortKey();

// const serverOptions: IServerOptions = {
//   authenticator: AuthenticationHandler,
//   context: AppContextHandler,
//   formatError: errorHandler,
//   controllers: getControllers(),
//   port: parseInt(port),
//   maxFileSize: 5000000000,
//   maxFiles: 10,
//   useCors: true,
//   middlewares: (app: Express) => {
//     UseHostAdminMiddleware(app);
//     UseTemplatingMiddleware(app);
//     UseRestMiddleware(serverOptions);
//   },
//   resolvers: getResolvers(),
//   privateKey: GetPrivateKey(),
//   publicKey: GetPublicKey(),
//   expiresIn: GetExpiresInKey(),
//   expirationFreq: ExpirationFreqEnum.Low,
//   gqlValidateSettings: {
//     forbidUnknownValues: false,
//   },
// };
// boot(serverOptions, async () => {
//   console.log("Start other services here. ex. database connections");

//   await createDatabase({
//     ifNotExist: true,
//     options: {
//       ...dataSourceOptions,
//       migrationsRun: false,
//       entities: [],
//       migrations: [],
//     },
//   });
//   const dataSource = await PostgresDataSource.initialize();
//   if (!dataSourceOptions.migrationsRun) {
//     dataSource.runMigrations();
//   }

//   //Init db settings
//   await settingsSeeder(dataSource);

//   //Core Seeders
//   await roleSuperAdminSeeder(dataSource); //create superadmin rol
//   await userAdminSeeder(dataSource); //create admin user with superadmin rol
//   await languageDefaultSeeder(dataSource); //create default language
//   mediaPublicSeeder({ ...ctx, dataSource }); //export public media files

//   //App seeders
//   await agvTemplateSeeder(dataSource);
//   await agvAdminUserSeeder(dataSource);

//   // Loop function
//   setTimeout(async () => {
//     // loopUpdateIssues();
//   }, 0);
// });
