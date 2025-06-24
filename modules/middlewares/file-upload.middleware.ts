import { IsNullOrUndefined } from "wgo-extensions";
import { IServerOptions } from "../interfaces/server-options.interface";
import fileUpload from "express-fileupload";

export const UseFileUploadMiddleware = (options: IServerOptions) => {
  if (IsNullOrUndefined(options)) throw new Error("Invalid options parameter");
  if (IsNullOrUndefined(options.app))
    throw new Error("Invalid options app parameter");

  options?.app?.use(
    fileUpload({
      useTempFiles: false,
      /*logger: {
                    log: (msg) => {
                        console.log("log:"+msg);
                    }
                },
                debug: true,*/
    })
  );
};
