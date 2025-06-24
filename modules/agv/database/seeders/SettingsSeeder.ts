import { DataSource } from "typeorm";
import { GetConfig } from "wgo-settings";
import { SETTINGS_POP3, SETTINGS_SMTP } from "@wisegar-org/wgo-base-models";
import { ctx } from "../../handlers/AppContextHandler";
import { settingsDataSeeder } from "../../../database/seeders/settings.seeder";
import { getSmtpSettings } from "../../../utils/settings.utils";

export const settingsSeeder = async (dataSource: DataSource) => {
  //Save keys to database settings
  await settingsDataSeeder(
    { ...ctx, dataSource },
    SETTINGS_POP3,
    getPop3Settings(GetConfig<any>())
  );
  await settingsDataSeeder(
    { ...ctx, dataSource },
    SETTINGS_SMTP,
    getSmtpSettings(GetConfig<any>())
  );
};
function getPop3Settings(arg0: any): any {
  throw new Error("Function not implemented.");
}

