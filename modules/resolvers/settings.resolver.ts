import { Arg, Authorized, Mutation, Query, Resolver, Ctx } from "type-graphql";
import { SettingsResponse } from "./settings.responses";
import { SettingsService } from "../services/settings.service";
import { PostSettingInput } from "./settings.inputs";
import {
  SETTINGS_PATH_GET_ALL_SETTINGS,
  SETTINGS_PATH_SET_SETTING,
  IContextBase,
} from "@wisegar-org/wgo-base-models";

@Resolver()
export class SettingsResolver {
  @Authorized()
  @Query(() => [SettingsResponse], { name: SETTINGS_PATH_GET_ALL_SETTINGS })
  async getAllSettings(@Ctx() ctx: IContextBase) {
    const emailMediaModel = new SettingsService(ctx);
    const emails = await emailMediaModel.getAllSettingsList();
    return emails as SettingsResponse[];
  }

  @Authorized()
  @Mutation(() => Boolean, { name: SETTINGS_PATH_SET_SETTING })
  async setSetting(
    @Arg("data") data: PostSettingInput,
    @Ctx() ctx: IContextBase
  ) {
    const emailMediaModel = new SettingsService(ctx);
    const result = await emailMediaModel.setSettings(data as any);
    return result;
  }
}
