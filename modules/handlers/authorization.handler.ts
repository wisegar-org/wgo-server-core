export const authorizationHandler = async (
  userContext: any,
  permissions: any
) => {
  throw Error(
    "Function authorizationHandler most be implemented on IServerOptions.authenticator"
  );
};
