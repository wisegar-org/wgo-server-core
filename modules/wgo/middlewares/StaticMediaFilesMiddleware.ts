import express, { Express } from "express";
import { existsSync, mkdirpSync } from "fs-extra";
import path from "path";

export const GetStaticFilesPublic = () => {
  if (process.env.WEB_ROOT) return path.join(process.env.WEB_ROOT, "public");
  throw "Impossible to get value from CLIENT_WEB_ROOT environment key";
};

export const GetWebRootKey = () => {
  if (process.env.APP_WEB_ROOT) return process.env.APP_WEB_ROOT;
  throw "Impossible to get value from APP_WEB_ROOT environment key";
};

export const UseStaticMediaFilesMiddleware = (app: Express) => {
  if (!existsSync(GetStaticFilesPublic())) {
    console.error("Host client folder do not exist!");
    mkdirpSync(GetStaticFilesPublic());
  }
  app.use("/media", express.static(GetStaticFilesPublic()));
};
