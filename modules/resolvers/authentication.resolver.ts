import { Arg, Mutation, Query, Resolver, Ctx, Authorized } from "type-graphql";
import {
  EditUserInput,
  LoginInput,
  MeInput,
  RegisterInput,
  ResendConfirmationInput,
  ResetPasswordInput,
  ValidUserNameInput,
} from "./authentication.inputs";
import { LoginResponse, UserResponse } from "./authentication.responses";
import {
  AUTH_PATH_CHANGE_RESET_PASSWORD,
  AUTH_PATH_CHECK_USER_NAME,
  AUTH_PATH_CONFIRM_REGIST,
  AUTH_PATH_DELETE_USER,
  AUTH_PATH_EDIT_USER,
  AUTH_PATH_GET_ALL_HISTORIC,
  AUTH_PATH_GET_ALL_HISTORIC_BY_USER,
  AUTH_PATH_GET_ALL_ROLES,
  AUTH_PATH_GET_ALL_USERS,
  AUTH_PATH_GET_HISTORIC,
  AUTH_PATH_GET_USER,
  AUTH_PATH_LOGIN,
  AUTH_PATH_ME,
  AUTH_PATH_REGISTER,
  AUTH_PATH_RESEND_CONFIRMATION,
  AUTH_PATH_RESET_PASSWORD,
  IAuthModelArg,
  IContextBase,
  SETTINGS_SMTP,
  SmtpSettings,
} from "@wisegar-org/wgo-base-models";
import {
  GetExpiresInKey,
  GetHostBaseKey,
  GetPrivateKey,
  GetPublicKey,
} from "wgo-settings";
import { UserEntity } from "../database/entities/UserEntity";
import { AuthenticationService } from "../services/authentication.service";
import { SettingsService } from "../services/settings.service";
import { IdInput } from "./core.inputs";
import { UserRolesService } from "../services/users-roles.service";
import { HistoricResponse } from "./history.responses";
import { EmailService } from "../services/email.service";
import { HistoryService } from "../services/historic.service";

@Resolver()
export class AuthResolver {
  private options: IAuthModelArg;

  /**
   *
   */
  constructor() {
    this.options = {
      privateKey: GetPrivateKey(),
      publicKey: GetPublicKey(),
      hostBase: GetHostBaseKey(),
      tokenExpiresIn: GetExpiresInKey(),
      tokenRegisterExpiresIn: "24h",
      emailOptions: {
        from: EmailService.getFromAppConfig(),
      } as any,
      transportEmailOptions: {} as any,
      ctx: {} as any,
    };
  }

  @Mutation(() => LoginResponse, { name: AUTH_PATH_LOGIN })
  async login(@Arg("data") data: LoginInput, @Ctx() ctx: IContextBase) {
    const authModel = new AuthenticationService({
      ...this.options,
      ctx,
    });
    const login = await authModel.login(data);
    return login as LoginResponse;
  }

  @Query(() => UserResponse, { name: AUTH_PATH_ME })
  async me(@Arg("data") data: MeInput, @Ctx() ctx: IContextBase) {
    const authModel = new AuthenticationService({
      ...this.options,
      ctx,
    });
    const user = await authModel.me(data);
    return user as UserResponse;
  }

  @Mutation(() => UserResponse, { name: AUTH_PATH_REGISTER })
  async register(@Arg("data") data: RegisterInput, @Ctx() ctx: IContextBase) {
    const settingsModel = new SettingsService(ctx);
    const config = (await settingsModel.getSettingsObject({
      type_settings: SETTINGS_SMTP,
    })) as any as SmtpSettings;
    const transportEmailOptions = {
      host: config.SMTP_EMAIL_HOST,
      port: config.SMTP_EMAIL_PORT,
      auth: {
        user: config.SMTP_EMAIL_USER,
        pass: settingsModel.getSettingPasswordValue(config.SMTP_EMAIL_PASSWORD),
      },
    };
    const authModel = new AuthenticationService({
      ...this.options,
      ctx,
      transportEmailOptions,
    });
    const user = await authModel.register(data as any);
    return user;
  }

  @Mutation(() => UserResponse, { name: AUTH_PATH_EDIT_USER })
  async editUser(@Arg("data") data: EditUserInput, @Ctx() ctx: IContextBase) {
    const settingsModel = new SettingsService(ctx);
    const config = (await settingsModel.getSettingsObject({
      type_settings: SETTINGS_SMTP,
    })) as any as SmtpSettings;
    const transportEmailOptions = {
      host: config.SMTP_EMAIL_HOST,
      port: config.SMTP_EMAIL_PORT,
      auth: {
        user: config.SMTP_EMAIL_USER,
        pass: settingsModel.getSettingPasswordValue(config.SMTP_EMAIL_PASSWORD),
      },
    };
    const authModel = new AuthenticationService({
      ...this.options,
      ctx,
      transportEmailOptions,
    });
    const user = await authModel.editUser(data as any);
    return user;
  }

  @Mutation(() => Boolean, { name: AUTH_PATH_RESEND_CONFIRMATION })
  async resendConfirmation(
    @Arg("data") data: ResendConfirmationInput,
    @Ctx() ctx: IContextBase
  ) {
    const settingsModel = new SettingsService(ctx);
    const config = (await settingsModel.getSettingsObject({
      type_settings: SETTINGS_SMTP,
    })) as any as SmtpSettings;
    const transportEmailOptions = {
      host: config.SMTP_EMAIL_HOST,
      port: config.SMTP_EMAIL_PORT,
      auth: {
        user: config.SMTP_EMAIL_USER,
        pass: settingsModel.getSettingPasswordValue(config.SMTP_EMAIL_PASSWORD),
      },
    };
    const authModel = new AuthenticationService({
      ...this.options,
      ctx,
      transportEmailOptions,
    });
    const user = await authModel.resendConfirmation(data);
    return !!user;
  }

  @Mutation(() => Boolean, { name: AUTH_PATH_RESET_PASSWORD })
  async resetPassword(
    @Arg("data") data: ResendConfirmationInput,
    @Ctx() ctx: IContextBase
  ) {
    const settingsModel = new SettingsService(ctx);
    const config = (await settingsModel.getSettingsObject({
      type_settings: SETTINGS_SMTP,
    })) as any as SmtpSettings;
    const transportEmailOptions = {
      host: config.SMTP_EMAIL_HOST,
      port: config.SMTP_EMAIL_PORT,
      auth: {
        user: config.SMTP_EMAIL_USER,
        pass: settingsModel.getSettingPasswordValue(config.SMTP_EMAIL_PASSWORD),
      },
    };
    const authModel = new AuthenticationService({
      ...this.options,
      ctx,
      transportEmailOptions,
    });
    const resetResult = await authModel.resetPassword(data);
    return !!resetResult;
  }

  @Mutation(() => Boolean, { name: AUTH_PATH_CHANGE_RESET_PASSWORD })
  async changeResetPassword(
    @Arg("data") data: ResetPasswordInput,
    @Ctx() ctx: IContextBase
  ) {
    const authModel = new AuthenticationService({
      ...this.options,
      ctx,
    });
    const resetResult = await authModel.changePassword(data);
    return resetResult;
  }

  @Mutation(() => Boolean, { name: AUTH_PATH_CONFIRM_REGIST })
  async confirmRegist(@Arg("data") data: MeInput, @Ctx() ctx: IContextBase) {
    const authModel = new AuthenticationService({
      ...this.options,
      ctx,
    });
    const user = await authModel.confirmRegist(data);
    return !!user;
  }

  @Query(() => UserResponse, { name: AUTH_PATH_GET_USER })
  async getUser(@Arg("data") data: IdInput, @Ctx() ctx: IContextBase) {
    const userRolesModel = new UserRolesService({
      ...this.options,
      ctx,
    });
    const user = await userRolesModel.getUser(data.id);
    return user;
  }

  @Query(() => [UserResponse], { name: AUTH_PATH_GET_ALL_USERS })
  async getAllUsers(@Ctx() ctx: IContextBase) {
    const userRolesModel = new UserRolesService({
      ...this.options,
      ctx,
    });
    const users = await userRolesModel.getAllUsers();
    return users;
  }

  @Query(() => [String], { name: AUTH_PATH_GET_ALL_ROLES })
  async getAllRoles(@Ctx() ctx: IContextBase) {
    const userRolesModel = new UserRolesService({
      ...this.options,
      ctx,
    });
    const roles = await userRolesModel.getAllRoles();
    return roles;
  }

  @Mutation(() => Boolean, { name: AUTH_PATH_DELETE_USER })
  async deleteUser(@Arg("data") data: IdInput, @Ctx() ctx: IContextBase) {
    const userRolesModel = new UserRolesService({
      ...this.options,
      ctx,
    });
    const user = await userRolesModel.deleteUser(data);
    return !!user;
  }

  @Query(() => Boolean, { name: AUTH_PATH_CHECK_USER_NAME })
  async validUserName(
    @Arg("data") data: ValidUserNameInput,
    @Ctx() ctx: IContextBase
  ) {
    const authModel = new AuthenticationService({
      ...this.options,
      ctx,
    });
    const result = await authModel.checkUserUniqueUserName(data);
    return result;
  }

  @Authorized()
  @Query(() => HistoricResponse, { name: AUTH_PATH_GET_HISTORIC })
  async getUserHistoric(@Arg("id") id: number, @Ctx() ctx: IContextBase) {
    const historyService = new HistoryService(UserEntity, ctx);
    const result = await historyService.getHistoric(id);
    return result.map((historic: any) =>
      HistoryService.ParseHistoricResponse(historic)
    );
  }

  @Authorized()
  @Query(() => [HistoricResponse], { name: AUTH_PATH_GET_ALL_HISTORIC })
  async getAllUserHistoric(@Ctx() ctx: IContextBase) {
    const historyService = new HistoryService(UserEntity, ctx);
    const result = await historyService.getAllHistoric();
    return result.map((historic: any) =>
      HistoryService.ParseHistoricResponse(historic)
    );
  }

  @Authorized()
  @Query(() => [HistoricResponse], { name: AUTH_PATH_GET_ALL_HISTORIC_BY_USER })
  async getUserAllHistoricByUser(
    @Arg("id") id: number,
    @Ctx() ctx: IContextBase
  ) {
    const historyService = new HistoryService(UserEntity, ctx);
    const result = await historyService.getAllHistoricByUser(id);
    return result.map((historic: any) =>
      HistoryService.ParseHistoricResponse(historic)
    );
  }
}
