import { IsNullOrUndefined } from "wgo-extensions";
import { IServerOptions } from "../interfaces/server-options.interface";
import swagger from "swagger-ui-express";
import path from "path";
import { GetWebRootPath } from "../core/services/EnvService";

export const UseSwaggerMiddleware = (options: IServerOptions) => {
  const swaggerJsonPath = path.join(GetWebRootPath(), "swagger.json");
  const swaggerDocument = require(swaggerJsonPath);
  if (IsNullOrUndefined(options)) throw new Error("Invalid options parameter");
  if (IsNullOrUndefined(options.app))
    throw new Error("Invalid options app parameter");
  options.app.use("/api-docs", swagger.serve, swagger.setup(swaggerDocument));
};
