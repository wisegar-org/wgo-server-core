import { DataSource } from "typeorm";
import { GetConfig } from "@wisegar-org/wgo-settings";
import {
  getFinanceOrganizationSettings,
  SETTINGS_FINANCE_ORGANIZATION,
} from "../../services/Finance/FinanceSettings";
import { ctx } from "../../handlers/AppContextHandler";
import { SETTINGS_POP3, SETTINGS_SMTP } from "@wisegar-org/wgo-base-models";
import { settingsDataSeeder } from "../../../database/seeders/settings.seeder";
import { getSmtpSettings } from "../../../utils/settings.utils";

export const settingsSeeder = async (dataSource: DataSource) => {
  //Save keys to database settings
  const settings = GetConfig<any>();
  await settingsDataSeeder(
    { ...ctx, dataSource },
    SETTINGS_POP3,
    getPop3Settings(settings)
  );
  await settingsDataSeeder(
    { ...ctx, dataSource },
    SETTINGS_SMTP,
    getSmtpSettings(settings)
  );
  await settingsDataSeeder(
    { ...ctx, dataSource },
    SETTINGS_FINANCE_ORGANIZATION,
    getFinanceOrganizationSettings(settings)
  );
};
function getPop3Settings(settings: any): any {
  throw new Error("Function not implemented.");
}
