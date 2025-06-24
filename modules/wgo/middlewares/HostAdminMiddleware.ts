import express, { Express } from "express";
import { existsSync, mkdirpSync } from "fs-extra";
import path from "path";

export const GetBackofficeRootKey = () => {
  const app_web_root = GetWebRootKey();
  return path.join(app_web_root, "backoffice", "dist", "spa");
};

export const GetWebRootKey = () => {
  if (process.env.APP_WEB_ROOT) return process.env.APP_WEB_ROOT;
  throw "Impossible to get value from APP_WEB_ROOT environment key";
};
export const GetHandlebarStaticsKey = () => {
  const app_web_root = GetWebRootKey();
  return path.join(app_web_root, "public");
};
export const GetHandlebarRootKey = () => {
  const app_web_root = GetWebRootKey();
  return path.join(app_web_root, "views");
};

export const UseHostAdminMiddleware = (app: Express) => {
  if (!existsSync(GetBackofficeRootKey())) {
    console.error("Host client folder do not exist!");
    mkdirpSync(GetBackofficeRootKey());
  }
  app.use("/backoffice", express.static(GetBackofficeRootKey()));
};
