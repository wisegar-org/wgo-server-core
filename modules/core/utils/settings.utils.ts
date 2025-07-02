import {
  POP3_EVENT_DELETE,
  POP3_EVENT_DELETE_KEYS,
  POP3_EVENT_LOOP,
  POP3_EVENT_LOOP_KEYS,
  IHandlerSettings,
  ISettingValueBoolean,
} from "@wisegar-org/wgo-base-models";

export const getPop3Settings = (config: any) => {
  const settings: { [key: string]: any } = {};
  settings.POP3_EMAIL_HOST = config.POP3_EMAIL_HOST || "";
  settings.POP3_EMAIL_PORT = config.POP3_EMAIL_PORT || 0;
  settings.POP3_EMAIL_LOAD_TIME = config.POP3_EMAIL_LOAD_TIME || 5;
  settings.POP3_EMAIL_USER = config.POP3_EMAIL_USER || "";
  settings.POP3_EMAIL_PASSWORD = config.POP3_EMAIL_PASSWORD || "";
  settings.POP3_EMAIL_TLS = <ISettingValueBoolean>{
    type: "boolean",
    value: config.POP3_EMAIL_TLS || "false",
  };
  settings.POP3_EMAIL_EMAIL = config.POP3_EMAIL_EMAIL || "";
  settings.POP3_EMAIL_DELETE = <ISettingValueBoolean>{
    type: "boolean",
    value: config.POP3_EMAIL_DELETE || "false",
  };

  return settings;
};

export const getSmtpSettings = (config: any) => {
  const settings: { [key: string]: any } = {};

  settings.SMTP_EMAIL_HOST = config.SMTP_EMAIL_HOST || config.EMAIL_HOST || "";
  settings.SMTP_EMAIL_PORT = config.SMTP_EMAIL_PORT || config.EMAIL_PORT || 0;
  settings.SMTP_EMAIL_USER =
    config.SMTP_EMAIL_USER || config.EMAIL_SENDER_ADDRESS || "";
  settings.SMTP_EMAIL_PASSWORD =
    config.SMTP_EMAIL_PASSWORD || config.EMAIL_SENDER_PASSWORD || "";
  settings.SMTP_EMAIL_TLS = <ISettingValueBoolean>{
    type: "boolean",
    value: config.SMTP_EMAIL_TLS || "false",
  };
  settings.SMTP_EMAIL_EMAIL = config.SMTP_EMAIL_EMAIL || "";

  return settings;
};

export const listenersEvents: IHandlerSettings[] = [
  {
    event: POP3_EVENT_LOOP,
    keyListeners: POP3_EVENT_LOOP_KEYS,
  },
  {
    event: POP3_EVENT_DELETE,
    keyListeners: POP3_EVENT_DELETE_KEYS,
  },
];
