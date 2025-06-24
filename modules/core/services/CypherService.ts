import crypto, { privateDecrypt, publicEncrypt } from "crypto";
import fs, { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { GetSettingsPath } from "./EnvService";

const publicKeyPath = () => {
  return join(GetSettingsPath(), "id_rsa_public.pem");
};

const privateKeyPath = () => {
  return join(GetSettingsPath(), "id_rsa_private.pem");
};
export const ExistKeyPair = () => {
  try {
    const publicKey = publicKeyPath();
    if (!fs.existsSync(publicKey)) return false;
    const privateKey = privateKeyPath();
    if (!fs.existsSync(privateKey)) return false;
  } catch {
    return false;
  }
  return true;
};
export const GetPublicKey = () => {
  try {
    const publicKeyFilePath = publicKeyPath();
    const fileBuffer = fs.readFileSync(publicKeyFilePath);
    return fileBuffer.toString();
  } catch (error) {
    if (!ExistKeyPair()) GenKeyPair();
    throw `Impossible to get value from publicKeyPath! ${error}`;
  }
};

export const GetPrivateKey = () => {
  try {
    const privateKeyFilePath = privateKeyPath();
    const fileBuffer = fs.readFileSync(privateKeyFilePath);
    return fileBuffer.toString();
  } catch (error) {
    if (!ExistKeyPair()) GenKeyPair();
    throw `Impossible to get value from privateKeyPath! ${error}`;
  }
};

export const GenKeyPair = () => {
  if (fs.existsSync(publicKeyPath()) && fs.existsSync(privateKeyPath())) {
    return;
  }
  const keyPair = GenerateRsaKeyPair();
  fs.writeFileSync(publicKeyPath(), keyPair.publicKey);
  fs.writeFileSync(privateKeyPath(), keyPair.privateKey);
};

export const GenerateRsaKeyPair = () => {
  return crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096, // bits - standard for RSA keys
    publicKeyEncoding: {
      type: "pkcs1", // "Public Key Cryptography Standards 1"
      format: "pem", // Most common formatting choice
    },
    privateKeyEncoding: {
      type: "pkcs1", // "Public Key Cryptography Standards 1"
      format: "pem", // Most common formatting choice
    },
  });
};

export const ObjectToBase64 = <T>(obj: T) => {
  const objJsonStr = JSON.stringify(obj);
  const objJsonB64 = Buffer.from(objJsonStr).toString("base64");
  return objJsonB64;
};

export const Base64ToObject = <T>(base64Str: string): T => {
  const base64StrBuffered = Buffer.from(base64Str, "base64");
  const base64Object: T = JSON.parse(base64StrBuffered.toString());
  return base64Object;
};

export const CypherData = (strData: string) => {
  const publicKey = GetPublicKey();
  const messageEncrypted = publicEncrypt(
    publicKey,
    Buffer.from(strData, "utf8")
  );
  return messageEncrypted;
};

export const DecypherData = (cypherData: string) => {
  const privateKey = GetPrivateKey();
  const messageDecrypted = privateDecrypt(
    privateKey,
    Buffer.from(cypherData, "base64")
  );
  return messageDecrypted.toString("utf8");
};
