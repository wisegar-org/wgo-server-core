export const validateOvhAuth = (token: string) => {
  return token === "JEx3aKiaD9shAte7.yFMifUFTAPD3set";
};

export const validateOvhAuthHeader = (req: any) => {
  const token = req.headers["x-ovh-auth"];
  return validateOvhAuth(token);
};
