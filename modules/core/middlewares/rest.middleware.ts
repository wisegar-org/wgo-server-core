import { IsNullOrUndefined } from "wgo-extensions";
import { IServerOptions } from "../models/interfaces/server-options.interface";
import { configRouter } from "../rest/router";

export const UseRestMiddleware = (options: IServerOptions) => {
  if (IsNullOrUndefined(options)) throw new Error("Invalid options parameter");
  if (IsNullOrUndefined(options.app))
    throw new Error("Invalid options app parameter");
  if (options.controllers) {
    configRouter(options.controllers, options.app);
  }
};
