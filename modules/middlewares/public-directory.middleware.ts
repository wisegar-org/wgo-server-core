import { IsNullOrUndefined } from "wgo-extensions";
import { IServerOptions } from "../interfaces/server-options.interface";
import express from "express";
import {
  GetOpenCRMPathRoot,
  GetWebRootPath,
} from "../core/services/EnvService";
import { join } from "path";
import { existsSync } from "fs-extra";
import { mkdirSync } from "fs";

export const PublicDirectoryMiddleware = (options: IServerOptions) => {
  if (IsNullOrUndefined(options)) throw new Error("Invalid options parameter");
  if (IsNullOrUndefined(options.app))
    throw new Error("Invalid options app parameter");

  const publicFolderPath = join(GetWebRootPath(), "public");
  if (!existsSync(publicFolderPath)) {
    mkdirSync(publicFolderPath);
  }
  options?.app?.use("/", express.static(publicFolderPath));

  const OpenCRMWebRootPath = GetOpenCRMPathRoot();
  const assetsFolderPath = join(OpenCRMWebRootPath, "assets");
  if (!existsSync(assetsFolderPath)) {
    mkdirSync(assetsFolderPath);
  }
  options?.app?.use("/assets", express.static(assetsFolderPath));
};
