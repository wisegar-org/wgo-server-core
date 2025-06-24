import { IsNullOrUndefined } from "wgo-extensions";
import cors from "cors";
import { IServerOptions } from "../interfaces/server-options.interface";

export const UseCorsMiddleware = (options: IServerOptions) => {
  if (IsNullOrUndefined(options)) throw new Error("Invalid options parameter");
  if (IsNullOrUndefined(options.app))
    throw new Error("Invalid options app parameter");

  if (!options.useCors) {
    console.debug(
      `Cors middleware not setted. Cors options set to:  ${options.useCors}`
    );
    return;
  }

  if (IsNullOrUndefined(options.corsOptions)) {
    options?.app?.use(cors());
    return;
  }

  options?.app?.use(cors(options.corsOptions));
};
