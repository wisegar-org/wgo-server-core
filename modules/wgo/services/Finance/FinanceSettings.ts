import {
  ISettingValueNumber,
  ISettingValuePassword,
} from "@wisegar-org/wgo-base-models";

export const SETTINGS_FINANCE_ORGANIZATION = "FINANCE_ORGANIZATION";

export const getFinanceOrganizationSettings = (config: any) => {
  const settings: { [key: string]: any } = {};

  settings.FINANCE_ORGANIZATION_NAME = config.FINANCE_ORGANIZATION_NAME || "";
  settings.FINANCE_ORGANIZATION_DESCRIPTION =
    config.FINANCE_ORGANIZATION_DESCRIPTION || "";
  settings.FINANCE_ORGANIZATION_ADDRESS =
    config.FINANCE_ORGANIZATION_ADDRESS || "";
  settings.FINANCE_ORGANIZATION_PLACE = config.FINANCE_ORGANIZATION_PLACE || "";
  settings.FINANCE_ORGANIZATION_NO = config.FINANCE_ORGANIZATION_NO || "";
  settings.FINANCE_ORGANIZATION_CAP = <ISettingValueNumber>{
    type: "number",
    value: config.FINANCE_ORGANIZATION_CAP || 0,
  };
  settings.FINANCE_ORGANIZATION_PHONE = config.FINANCE_ORGANIZATION_PHONE || "";
  settings.FINANCE_ORGANIZATION_EMAIL = config.FINANCE_ORGANIZATION_EMAIL || "";
  settings.FINANCE_ORGANIZATION_WEB = config.FINANCE_ORGANIZATION_WEB || "";
  settings.FINANCE_ACCOUNTING_UNIT = config.FINANCE_ACCOUNTING_UNIT || "h";
  settings.FINANCE_ACCOUNTING_COIN = config.FINANCE_ACCOUNTING_COIN || "CHF";
  settings.FINANCE_ACCOUNTING_LABEL =
    config.FINANCE_ACCOUNTING_LABEL || "FakeAccount";
  settings.FINANCE_BANCK_NAME = config.FINANCE_BANCK_NAME || "";
  settings.FINANCE_BANCK_BIC = config.FINANCE_BANCK_BIC || "";
  settings.FINANCE_BANCK_IBAN = config.FINANCE_BANCK_IBAN || "";
  settings.FINANCE_BANCK_NO = config.FINANCE_BANCK_NO || "";
  settings.FINANCE_BANCK_CAP = config.FINANCE_BANCK_CAP || "";
  settings.FINANCE_BANCK_PLACE = config.FINANCE_BANCK_PLACE || "";
  settings.FINANCE_BANCK_ADDRESS = config.FINANCE_BANCK_ADDRESS || "";
  settings.FINANCE_BANCK_VALID_DAYS = <ISettingValueNumber>{
    type: "number",
    value: config.FINANCE_BANCK_VALID_DAYS || 0,
  };
  settings.FINANCE_ISSUES_ZINC_TIME = <ISettingValueNumber>{
    type: "number",
    value: config.FINANCE_ISSUES_ZINC_TIME || 24 * 60,
  };
  settings.FINANCE_ISSUES_TOKEN = <ISettingValuePassword>{
    type: "password",
    value: config.FINANCE_ISSUES_TOKEN || "",
  };

  return settings;
};
