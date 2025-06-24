import { IsNull, IsStringEmptyNullOrUndefined } from "wgo-extensions";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export enum ExpirationFreqEnum {
  Huge = 2,
  High = 3,
  Normal = 4,
  Low = 5,
}

export interface AccessTokenData {
  userId: string;
  userName: string;
  sessionId: number;
  iat?: number;
  exp?: number;
  expiring?: boolean;
}

export interface IGenerateAccessTokenOptions {
  privateKey: string;
  expiresIn: string;
  payload: AccessTokenData;
}

export interface IValidateAccessTokenOptions {
  token: string;
  publicKey: string;
  payload?: AccessTokenData;
  privateKey?: string;
  expiresIn?: string;
  expirationFreq: ExpirationFreqEnum;
}

/**
 * @var algorithm Algotithm to apply encription and decription token
 */
const algorithm = "RS256";
const getTokenExpMilliseconds = (jwtPayload: AccessTokenData) => {
  return (jwtPayload.exp || 0) * 1000;
};
const getTokenLifespan = (jwtPayload: AccessTokenData) => {
  if (!jwt || !jwtPayload.exp || !jwtPayload.iat) return 0;
  return (jwtPayload.exp - jwtPayload.iat) * 1000;
};
const getTokenExpirationTolerance = (
  jwtPayload: AccessTokenData,
  expirationFreq: ExpirationFreqEnum
) => {
  const tokenLifespan = getTokenLifespan(jwtPayload);
  if (tokenLifespan === 0) return tokenLifespan;
  if (!expirationFreq) expirationFreq = ExpirationFreqEnum.Normal;
  const expFeqValue: number = expirationFreq;
  return tokenLifespan / expFeqValue;
};
const getExpirationPoint = (
  jwtPayload: AccessTokenData,
  expirationFreq: ExpirationFreqEnum
) => {
  const tokenExpirationTolerance = getTokenExpirationTolerance(
    jwtPayload,
    expirationFreq
  );
  return getTokenExpMilliseconds(jwtPayload) - tokenExpirationTolerance;
};

const isTokenExpiring = (
  jwtPayload: AccessTokenData,
  expirationFreq: ExpirationFreqEnum
) => {
  const tokenExpiringPoint = getExpirationPoint(jwtPayload, expirationFreq);
  return new Date().getTime() >= tokenExpiringPoint;
};
export const generateAccessToken = (options: IGenerateAccessTokenOptions) => {
  if (!options) throw "generateAccessToken - options most be valid";
  if (!options.payload)
    throw "generateAccessToken - payload param most be valid";
  if (!options.payload.userId && !options.payload.userName)
    throw "generateAccessToken - user id or username param most be valid";
  if (!options.privateKey)
    throw "generateAccessToken - privateKey param most be valid";
  if (!options.expiresIn)
    throw "generateAccessToken - expiresIn param most be valid";
  const token = jwt.sign(options.payload, options.privateKey, {
    expiresIn: options.expiresIn,
    algorithm: algorithm,
  });
  return token;
};

export const validateAccessToken = (
  options: IValidateAccessTokenOptions
): AccessTokenData | null => {
  if (!options) throw "validateAccessToken - options most be valid";
  if (!options.token)
    throw "validateAccessToken - AccessTokenData most be valid";
  try {
    const jwtPayload: AccessTokenData = <AccessTokenData>(
      jwt.verify(options.token, options.publicKey, { algorithms: [algorithm] })
    );
    jwtPayload.expiring = isTokenExpiring(jwtPayload, options.expirationFreq);
    return jwtPayload;
  } catch (error) {
    throw `validateAccessToken => Error on token validation:  ${error}`;
  }
};

export const jwtValidator = (
  req: Request,
  res: Response,
  validateTokenFn: (
    options: IValidateAccessTokenOptions
  ) => AccessTokenData | null,
  expiresIn: any,
  publicKey: string,
  privateKey: string,
  expirationFreq: ExpirationFreqEnum
): AccessTokenData | undefined => {
  if (IsStringEmptyNullOrUndefined(req.headers["authorization"] as string))
    return;

  const token: string = req.headers["authorization"] || "";
  try {
    const result = validateTokenFn({
      token,
      publicKey: publicKey,
      expirationFreq: expirationFreq,
    });
    if (!result || IsNull(result)) {
      return;
    }
    if (result.expiring) {
      const options: IGenerateAccessTokenOptions = {
        payload: { ...result },
        expiresIn: expiresIn,
        privateKey: privateKey,
      };
      if (options.payload.exp) delete options.payload.exp;
      if (options.payload.iat) delete options.payload.iat;
      if (options.payload.expiring) delete options.payload.expiring;
      const newToken = generateAccessToken(options);
      res.setHeader("authorization-refresh", newToken);
      req.headers["authorization-refresh"] = newToken;
    }
    return result;
  } catch (error) {
    throw error;
  }
};
