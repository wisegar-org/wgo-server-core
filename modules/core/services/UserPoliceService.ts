import {
  GetHostBaseKey,
  GetUserPoliceResetPwdEmailKey,
  GetUserPoliceResetPwdExpKey,
  GetUserPoliceResetPwdUrlKey,
  GetUserPoliceTokenKey,
  GetCypherKey,
} from "wgo-settings";
import { IUser } from "../../interfaces/user.interface";
import { EmailServer } from "wgo-mailer";
import { CypherService } from "wgo-crypto";
import { IsNullOrUndefined } from "wgo-extensions";

interface ITokenPayload {
  username: string;
  useremail: string;
  deferedKey: string;
  ramdonKey: string;
  expiration: string;
}

export class UserPoliceService {
  private readonly RESET_USER_PWD_KEY: string = "Reset*User*Password*Key";
  private readonly CONFIRM_USER_PWD_KEY: string = "Confirm*User*Password*Key";
  private readonly emailService: EmailServer;
  private readonly cypherService: CypherService;

  constructor() {
    this.emailService = new EmailServer();
    this.cypherService = new CypherService(GetCypherKey());
  }

  protected generateResetUserPwdToken(user: IUser) {
    const tokenPayload: ITokenPayload = {
      deferedKey: this.RESET_USER_PWD_KEY,
      expiration: new Date()
        .setMinutes(GetUserPoliceResetPwdExpKey())
        .toString(),
      ramdonKey: GetUserPoliceTokenKey(),
      useremail: user.email,
      username: user.username,
    };
    const userPoliceGenerationKey = JSON.stringify(tokenPayload);
    return this.cypherService.cypherData(userPoliceGenerationKey);
  }

  protected decypherUserResetPwdToken(cypherToken: string): ITokenPayload {
    const decypheredToken = this.cypherService.decypherData(cypherToken);
    const tokenPayload: ITokenPayload = JSON.parse(decypheredToken);
    return tokenPayload;
  }
  protected getUserFromTokenPayload(payload: ITokenPayload): IUser {
    return {
      email: payload.useremail,
      name: "",
      lastname: "",
      username: payload.username,
    };
  }

  protected async validateResetUserPwdToken(
    cypherToken: string,
    userIsValid: (user: IUser) => Promise<boolean>
  ): Promise<boolean> {
    try {
      const tokenPayload: ITokenPayload =
        this.decypherUserResetPwdToken(cypherToken);
      if (new Date().getTime() > new Date(tokenPayload.expiration).getTime())
        throw `ResetUserPwdToken expired`;
      if (tokenPayload.deferedKey !== this.RESET_USER_PWD_KEY)
        throw `ResetUserPwdToken invalid defered token data`;
      if (tokenPayload.ramdonKey !== GetUserPoliceTokenKey())
        throw `ResetUserPwdToken invalid rmd token data`;
      const user = this.getUserFromTokenPayload(tokenPayload);
      if (!userIsValid) throw "User not valid!";
      return await userIsValid(user);
    } catch (error) {
      throw `ResetUserPwdToken invalid: ${error}`;
    }
  }

  protected generateResetUserPwdTokenUrl(token: string): URL {
    const hostname = GetHostBaseKey();
    const resetPwdUrl = GetUserPoliceResetPwdUrlKey();
    return new URL(`${resetPwdUrl}/?val=${token}`, hostname);
  }

  private defaultTokenHandler(user: IUser, link: URL, template: string) {
    template = template.replace("[LINK]", link.href);
    template = template.replace("[NAME]", user.name);
    template = template.replace("[LASTNAME]", user.lastname);
    template = template.replace("[USERNAME]", user.username);
    template = template.replace("[EMAIL]", user.email);
    return template;
  }

  private async loadResetUserPwdEmail(
    user: IUser,
    link: URL,
    tokenHander?: (user: IUser, link: URL, template: string) => Promise<string>
  ): Promise<string> {
    const fs = require("fs-extra");
    const resetUserPwdTemplate = GetUserPoliceResetPwdEmailKey();
    if (!fs.existsSync(resetUserPwdTemplate))
      throw `Email template not found at ${resetUserPwdTemplate}`;
    let templateContent = fs.readFileSync(resetUserPwdTemplate);
    templateContent = templateContent.toString("utf8");
    if (tokenHander) {
      return await tokenHander(user, link, templateContent);
    }
    return this.defaultTokenHandler(user, link, templateContent);
  }

  protected async requestResetUserPwd(
    user: IUser,
    userIsValid: (user: IUser) => any,
    tokenHander?: (user: IUser, link: URL, template: string) => Promise<string>
  ) {
    if (!userIsValid(user)) throw "User not valid!";
    const resetUserPwdToken = this.generateResetUserPwdToken(user);
    const resetUserPwdUrl =
      this.generateResetUserPwdTokenUrl(resetUserPwdToken);
    const resetUserPwdTemplate = await this.loadResetUserPwdEmail(
      user,
      resetUserPwdUrl,
      tokenHander
    );
    if (!user.email) throw "User email not valid!";
    const result = await this.emailService.send({
      to: user.email,
      subject: "Email Password Reset",
      html: resetUserPwdTemplate,
      from: undefined,
    });
    return result;
  }
}
