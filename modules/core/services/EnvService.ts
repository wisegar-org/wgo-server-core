import dotenv from "dotenv";
import { existsSync, mkdirSync } from "fs";

dotenv.config({
  path: ".env",
});

export const GetNodeEnv = () => {
  if (process.env.NODE_ENV) return process.env.NODE_ENV;
  throw "Impossible to get value from NODE_ENV environment key";
};

export const GetPortEnv = () => {
  if (process.env.PORT) return process.env.PORT;
  throw "Impossible to get value from PORT environment key";
};

export const GetWebRootPath = () => {
  if (process.env.APP_WEB_ROOT) return process.env.APP_WEB_ROOT;
  throw "Impossible to get value from APP_WEB_ROOT environment key";
};

export const GetWebHostBaseUrl = () => {
  const nodeEnv = GetNodeEnv();
  if (nodeEnv === "development") {
    if (process.env.APP_WEB_HOST_DEV) return process.env.APP_WEB_HOST_DEV;
    throw "Impossible to get value from APP_WEB_HOST_DEV environment key";
  }

  if (process.env.APP_WEB_HOST) return process.env.APP_WEB_HOST;
  throw "Impossible to get value from APP_WEB_HOST environment key";
};

export const GetOpenCRMPathRoot = () => {
  if (process.env.OPENCRM_PATH_ROOT) return process.env.OPENCRM_PATH_ROOT;
  throw "Impossible to get value from OPENCRM_PATH_ROOT environment key";
};
/**
 *  Get database hostname number from the DB_HOST environment key (.env)
 * @returns string
 */
export const GetDbHost = () => {
  if (process.env.DB_HOST) return process.env.DB_HOST;
  throw "Impossible to get value from DB_HOST environment key";
};
/**
 *  Get database port number from the DB_PORT environment key (.env)
 * @returns string
 */
export const GetDbPort = () => {
  if (process.env.DB_PORT) return process.env.DB_PORT;
  throw "Impossible to get value from DB_PORT environment key";
};
/**
 *  Get database username from the DB_USERNAME environment key (.env)
 * @returns string
 */
export const GetDbUsername = () => {
  if (process.env.DB_USERNAME) return process.env.DB_USERNAME;
  throw "Impossible to get value from DB_USERNAME environment key";
};
/**
 *  Get database name from the DB_NAME environment key (.env)
 * @returns string
 */
export const GetDbName = () => {
  if (process.env.DB_NAME) return process.env.DB_NAME;
  throw "Impossible to get value from DB_NAME environment key";
};
/**
 *  Get database password from the DB_PASSWORD environment key (.env)
 * @returns string
 */
export const GetDbPassword = () => {
  if (process.env.DB_PASSWORD) return process.env.DB_PASSWORD;
  throw "Impossible to get value from DB_PASSWORD environment key";
};

export const GetSettingsPath = () => {
  if (process.env.SETTINGS_PATH && existsSync(process.env.SETTINGS_PATH)) {
    return process.env.SETTINGS_PATH;
  }
  if (process.env.SETTINGS_PATH && !existsSync(process.env.SETTINGS_PATH)) {
    mkdirSync(process.env.SETTINGS_PATH);
    return process.env.SETTINGS_PATH;
  }
  throw "Impossible to get value from SETTINGS_PATH environment key";
};
