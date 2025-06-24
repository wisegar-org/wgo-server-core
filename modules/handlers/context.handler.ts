import { IContextOptions } from "../interfaces/context-options.interface";
import { IServerOptions } from "../interfaces/server-options.interface";

export const contextBaseHandler = async (
  options: IContextOptions
): Promise<any> => {
  const { tokenPayload, requestHeaders, responseHeaders } = options;
  return {
    tokenPayload,
    requestHeaders,
    responseHeaders,
  };
};

export const contextHandler = async (
  options: IServerOptions,
  req: any,
  res: any
): Promise<any> => {
  const authorizationRefreshToken = res.get("authorization-refresh") || "";

  const authorizationRefreshHeader = {
    "Access-Control-Expose-Headers": "authorization-refresh",
    "authorization-refresh": authorizationRefreshToken,
  };

  res.set(authorizationRefreshHeader);

  const contextOptions: IContextOptions = {
    tokenPayload: (req as any).tokenPayload,
    requestHeaders: req.headers,
    responseHeaders: res.getHeaders(),
  };

  const context = await options.context(contextOptions);
  (req as any).context = context;
  return context;
};
