export const AuthenticationHandler = async (userContext: any, roles: any) => {
  console.log("authenticator userContext: ", userContext);
  console.log("authenticator roles: ", roles);
  const {
    context: { user },
  } = userContext;
  // TODO: Add here authentication logic
  if (!user) throw new Error("NotAuthorized");
  return true;
};
