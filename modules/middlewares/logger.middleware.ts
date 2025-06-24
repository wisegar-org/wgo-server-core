import winston from "winston";
import { IServerOptions } from "../interfaces/server-options.interface";
import { IsNullOrUndefined } from "wgo-extensions";

const { combine, timestamp, json, printf } = winston.format;
const timestampFormat = "MMM-DD-YYYY HH:mm:ss";

// Logger for API endpoints
export const getHttpLogger = () => {
  return winston.createLogger({
    format: combine(
      timestamp({ format: timestampFormat }),
      json(),
      printf(({ timestamp, level, message, ...data }) => {
        const response = {
          level,
          timestamp,
          message,
          data,
        };

        return JSON.stringify(response);
      })
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: "logs/http.log" }),
    ],
  });
};

export const UseLoggerMiddleware = (options: IServerOptions) => {
  if (IsNullOrUndefined(options)) throw new Error("Invalid options parameter");
  if (IsNullOrUndefined(options.app))
    throw new Error("Invalid options app parameter");
  options.app.logger = getHttpLogger();
};
