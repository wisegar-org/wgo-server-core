import {
  AuthTemplateEnum,
  getAuthTemplateKey,
} from "@wisegar-org/wgo-base-models/build/authentication";
import { AGVNewsletterInscriptionStatusEnum } from "./Newsletter";

export const AGVTemplateKey = "AGV_TEMPLATE_DATA_";

export const getAgvTemplateKey = (type: string) => {
  let key = "";
  switch (type) {
    case AuthTemplateEnum.ConfirmEmail:
    case AuthTemplateEnum.ConfirmChangeDefaultPassword:
    case AuthTemplateEnum.ResetPassword: {
      return getAuthTemplateKey(type);
    }
    case AGVNewsletterInscriptionStatusEnum.Waiting:
    case AGVNewsletterInscriptionStatusEnum.Confirmed:
    case AGVNewsletterInscriptionStatusEnum.Cancelled: {
      key = "Newsletter_" + type;
      break;
    }
    case AGVTemplateEnum.Inscription:
    case AGVTemplateEnum.InscriptionRepeated:
    case AGVTemplateEnum.EmailComitato:
    case AGVTemplateEnum.EmailContact:
    case AGVTemplateEnum.EmailPoll: {
      key = type;
      break;
    }
    default: {
      key = "Unknown_" + type;
      break;
    }
  }
  return `${AGVTemplateKey}${key.split(" ").join("")}`.toUpperCase();
};

export enum AGVTemplateEnum {
  Inscription = "Inscription",
  InscriptionRepeated = "InscriptionRept",
  EmailComitato = "EmailComitato",
  EmailContact = "EmailContact",
  EmailPoll = "EmailPoll",
}

export type AGVTemplateType =
  | AGVNewsletterInscriptionStatusEnum
  | AGVTemplateEnum;
