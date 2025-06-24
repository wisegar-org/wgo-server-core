import { DataSource } from "typeorm";
import { IsNullOrUndefined } from "wgo-extensions";
import * as bcrypt from "bcrypt";
import {
  AuthPaths,
  AuthTemplateEnum,
  getAuthTemplateKey,
  IAuthEditParams,
  IAuthLoginParams,
  IAuthMeParams,
  IAuthModelArg,
  IAuthRegisterParams,
  IAuthResendParam,
  IChangePasswordParam,
  ICheckUserUniqueUserName,
  IContextBase,
  ISuccesLogin,
  IUser,
  IUserContext,
  TOKEN_EXP,
  TOKEN_REGISTER_EXP,
  WRONG_CODE_ALREADY_EXIST,
  WRONG_CONFIRM_EMAIL,
  WRONG_EMAIL,
  WRONG_REGISTER,
  WRONG_TOKEN,
  WRONG_USER_DONT_EXIST,
  WRONG_USER_NAME,
  WRONG_USER_PASSWORD,
} from "@wisegar-org/wgo-base-models";
import { UserEntity } from "../database/entities/UserEntity";
import { UserRolesService } from "./users-roles.service";
import { UserUtils } from "../utils/user.utils";
import { EmailService } from "./email.service";
import { HistoryService } from "./historic.service";
import {
  ExpirationFreqEnum,
  generateAccessToken,
  validateAccessToken,
} from "../core/services/JwtAuthService";

export class AuthenticationService {
  private dataSource: DataSource;
  private emailModel: EmailService;
  private options: IAuthModelArg;
  private userRolesModel: UserRolesService;
  private historicModel: HistoryService<UserEntity>;
  private ctx: IContextBase;
  /**
   *
   */
  constructor(options: IAuthModelArg) {
    this.dataSource = options.ctx.dataSource;
    this.options = {
      ...options,
      tokenExpiresIn: options.tokenExpiresIn || TOKEN_EXP,
      tokenRegisterExpiresIn:
        options.tokenRegisterExpiresIn || TOKEN_REGISTER_EXP,
    };
    this.emailModel = new EmailService(options.ctx);
    this.userRolesModel = new UserRolesService(options);
    this.historicModel = new HistoryService(UserEntity, options.ctx);
    this.ctx = options.ctx;
  }

  public async login(data: IAuthLoginParams): Promise<ISuccesLogin> {
    const repo = await this.dataSource.getRepository(UserEntity);
    const user = await repo.findOne({
      where: [{ userName: data.user }, { email: data.user }],
      relations: ["roles"],
    });

    if (!IsNullOrUndefined(user)) {
      if (user && !user.isEmailConfirmed) {
        throw new Error(WRONG_CONFIRM_EMAIL);
      }
      if (user && (await this.comparePassword(data.password, user.password))) {
        const token = generateAccessToken({
          privateKey: this.options.privateKey,
          expiresIn: TOKEN_EXP,
          payload: {
            userId: user.id.toString(),
            userName: user.userName,
            sessionId: -1,
          },
        });
        await this.historicModel.createAccessHistoric(user);
        return {
          token,
          user: UserUtils.mapUserEntity(user),
        };
      }
    }

    throw new Error(WRONG_USER_PASSWORD);
  }

  public async me(data: IAuthMeParams): Promise<IUser> {
    const result = validateAccessToken({
      publicKey: this.options.publicKey,
      token: data.token,
      expiresIn: TOKEN_EXP,
      privateKey: this.options.privateKey,
      expirationFreq: ExpirationFreqEnum.Low,
    });

    if (!!result) {
      const repo = await this.dataSource.getRepository(UserEntity);
      const user = await repo.findOne({
        where: [{ userName: result.userName }, { id: parseInt(result.userId) }],
        relations: ["roles"],
      });
      if (!!user) {
        return UserUtils.mapUserEntity(user);
      }
    }

    throw new Error(WRONG_TOKEN);
  }

  public async register(data: IAuthRegisterParams): Promise<IUser> {
    const result = this.dataSource.transaction(async () => {
      const repo = await this.dataSource.getRepository(UserEntity);
      const filter: any[] = [
        { userName: data.userName },
        { email: data.email },
      ];
      if (data.code) filter.push({ code: data.code });
      const listUsers = await repo.find({
        where: filter,
        relations: ["roles"],
      });
      if (listUsers.length > 0) {
        if (data.code && listUsers[0].code === data.code)
          throw new Error(WRONG_CODE_ALREADY_EXIST);
        throw new Error(
          listUsers[0].userName === data.userName
            ? WRONG_USER_NAME
            : WRONG_EMAIL
        );
      }

      let user = new UserEntity();
      user.name = data.name;
      user.lastName = data.lastName;
      user.userName = data.userName;
      user.email = data.email;
      user.code = data.code;
      user.certificate = data.certificate;
      user.cap = data.cap;
      user.phone = data.phone;
      user.address = data.address;
      const password = data.password
        ? data.password
        : this.getGenericPassword(10);
      user.password = bcrypt.hashSync(password, 10);
      user.isEmailConfirmed = data.isEmailConfirmed;
      user.roles = await this.userRolesModel.getRolesByString(data.roles || []);

      user = await repo.save(user);
      if (user) {
        await this.historicModel.createRegisterHistoric(user);
        if (!user.isEmailConfirmed) {
          await this.resendConfirmation(
            data,
            !data.password ? password : undefined
          );
        }
        return UserUtils.mapUserEntity(user);
      }
      throw new Error(WRONG_REGISTER);
    });

    return result;
  }

  public async editUser(data: IAuthEditParams): Promise<IUser> {
    const repo = await this.dataSource.getRepository(UserEntity);
    const user = await repo.findOne({
      where: [{ id: data.id }],
      relations: ["roles"],
    });
    if (user) {
      const userNameUser = await repo.findOne({
        where: { userName: data.userName },
      });
      if (!!userNameUser && userNameUser.id !== data.id) {
        throw new Error(WRONG_USER_NAME);
      }
      const codeUser = await repo.findOne({
        where: { code: data.code },
      });
      if (
        !!data.code &&
        !UserUtils.isEmptyCode(data.code) &&
        !!codeUser &&
        codeUser.id !== data.id
      ) {
        throw new Error(WRONG_CODE_ALREADY_EXIST);
      }
      user.name = data.name;
      user.userName = data.userName;
      user.lastName = data.lastName;
      user.code = data.code;
      user.roles = await this.userRolesModel.getRolesByString(data.roles || []);
      let result = user;
      user.email = data.email;
      user.address = data.address || user.address;
      user.cap = data.cap || user.cap;
      user.phone = data.phone || user.phone;
      if (data.password) user.password = bcrypt.hashSync(data.password, 10);
      if (user.isEmailConfirmed !== data.isEmailConfirmed) {
        if (data.isEmailConfirmed === true) {
          user.isEmailConfirmed = true;
          user.confirmationToken = "";
          result = await repo.save(user);
          await this.historicModel.createPutHistoric(result);
        } else if (user.email) {
          await repo.save(user);
          return await this.resendConfirmation({
            email: user.email,
          });
        }
      } else {
        result = await repo.save(user);
        await this.historicModel.createPutHistoric(result);
      }

      return UserUtils.mapUserEntity(result);
    }
    throw new Error(WRONG_USER_DONT_EXIST);
  }

  public async resendConfirmation(
    data: IAuthResendParam,
    password?: string
  ): Promise<IUser> {
    const repo = await this.dataSource.getRepository(UserEntity);
    const user = await repo.findOne({
      where: [{ email: data.email }],
      relations: ["roles"],
    });
    if (user) {
      user.confirmationToken = generateAccessToken({
        privateKey: this.options.privateKey,
        expiresIn: TOKEN_REGISTER_EXP,
        payload: {
          userId: user.id.toString(),
          userName: user.userName,
          sessionId: -1,
        },
      });
      user.isEmailConfirmed = false;
      const userEdited = await repo.save(user);
      try {
        await this.historicModel.createRegisterHistoric(userEdited);
      } catch (error) {
        await this.historicModel.createRegisterHistoric(
          userEdited,
          "Modificato"
        );
      }

      const emailData = {
        email: user.email,
        nome: user.name,
        cognome: user.name,
        url: this.options.hostBase,
        linkDiConferma: `${this.options.hostBase}${AuthPaths.authConfirmEmail.path}?token=${user.confirmationToken}`,
        password: password || "",
      };
      try {
        await this.emailModel.sendEmailFromApp({
          ...this.options.emailOptions,
          subject: "Wisegar Email Confirmation",
          to: `${data.email}`,
          body: getAuthTemplateKey(
            user.userName && password
              ? AuthTemplateEnum.ConfirmChangeDefaultPassword
              : AuthTemplateEnum.ConfirmEmail
          ),
          data: JSON.stringify(emailData),
        });
      } catch (error: any) {
        console.log(error.message);
      }
      return UserUtils.mapUserEntity(user);
    }

    throw new Error(WRONG_USER_DONT_EXIST);
  }

  public async resetPassword(data: IAuthResendParam): Promise<boolean> {
    const repo = await this.dataSource.getRepository(UserEntity);
    const user = await repo.findOne({
      where: [{ userName: data.email }, { email: data.email }],
      relations: ["roles"],
    });

    if (!IsNullOrUndefined(user) && user) {
      const token = generateAccessToken({
        privateKey: this.options.privateKey,
        expiresIn: TOKEN_REGISTER_EXP,
        payload: {
          userId: user.id.toString(),
          userName: user.userName,
          sessionId: -1,
        },
      });
      const emailData = {
        email: user.email,
        nome: user.name,
        cognome: user.name,
        url: this.options.hostBase,
        linkDiConferma: `${this.options.hostBase}${AuthPaths.authChangePassword.path}?token=${token}`,
      };
      await this.emailModel.sendEmailFromApp({
        ...this.options.emailOptions,
        subject: "Wisegar Email Reset Password",
        to: `${data.email}`,
        body: getAuthTemplateKey(AuthTemplateEnum.ResetPassword),
        data: JSON.stringify(emailData),
      });
      return true;
    }

    throw new Error(WRONG_USER_DONT_EXIST);
  }

  public async changePassword(data: IChangePasswordParam) {
    const tokenValidation = validateAccessToken({
      publicKey: this.options.publicKey,
      token: data.token,
      expiresIn: TOKEN_EXP,
      privateKey: this.options.privateKey,
      expirationFreq: ExpirationFreqEnum.Low,
    });

    if (tokenValidation) {
      const repo = await this.dataSource.getRepository(UserEntity);
      const user = await repo.findOne({
        where: [{ id: parseInt(tokenValidation.userId) }],
        relations: ["roles"],
      });
      if (user) {
        user.password = bcrypt.hashSync(data.password, 10);
        const result = await repo.save(user);
        const historicModel = this.ctx.user?.id
          ? this.historicModel
          : new HistoryService(UserEntity, {
              ...this.ctx,
              user: <IUserContext>{
                email: user.email,
                id: user.id,
              },
            });
        await historicModel.createPutHistoric(result);
        return !!result;
      } else {
        throw new Error(WRONG_USER_DONT_EXIST);
      }
    }

    throw new Error(WRONG_TOKEN);
  }

  public async confirmRegist(data: IAuthMeParams): Promise<IUser> {
    const result = validateAccessToken({
      publicKey: this.options.publicKey,
      token: data.token,
      expiresIn: TOKEN_EXP,
      privateKey: this.options.privateKey,
      expirationFreq: ExpirationFreqEnum.Low,
    });

    if (!!result) {
      const repo = await this.dataSource.getRepository(UserEntity);
      const user = await repo.findOne({
        where: [{ userName: result.userName }, { id: parseInt(result.userId) }],
        relations: ["roles"],
      });
      if (!!user && user.confirmationToken === data.token) {
        user.confirmationToken = "";
        user.isEmailConfirmed = true;
        const userEdited = await repo.save(user);
        const historicModel = this.ctx.user?.id
          ? this.historicModel
          : new HistoryService(UserEntity, {
              ...this.ctx,
              user: <IUserContext>{
                email: user.email,
                id: user.id,
              },
            });
        await historicModel.createPutHistoric(userEdited);
        return UserUtils.mapUserEntity(user);
      }
    }

    throw new Error(WRONG_TOKEN);
  }

  async checkUserUniqueUserName(data: ICheckUserUniqueUserName) {
    const repo = await this.dataSource.getRepository(UserEntity);
    const userExists = await repo.findOne({
      where: {
        id: data.id,
      },
    });

    const userNameExist = await repo.findOne({
      where: {
        userName: data.userName,
      },
    });

    return (
      (!userExists && !userNameExist) ||
      (!!userExists && !userNameExist) ||
      (!!userExists && !!userNameExist && userExists.id === userNameExist.id)
    );
  }

  private async comparePassword(
    attempt: string,
    password: string
  ): Promise<boolean> {
    return await bcrypt.compare(attempt, password);
  }

  getGenericPassword(length: number) {
    const str = () => (Math.random() + 1).toString(36).substring(2);
    const strPassword = `${str()}${str()}${str()}`.substring(length);
    return strPassword;
  }

  getConfirmationMsgWithPassword(
    link: string,
    user?: string,
    password?: string
  ) {
    const passwordText =
      user && password
        ? `<br><br><p>The credentials to access the site are: 
        <br> User: ${user} 
        <br> Password: ${password} </p>
        <p>Please change your password as soon as possible.</p>`
        : "";
    const message = `<div>
          Confirm email <a href="${link}"> here </a>
          ${passwordText}
          </div>`;
    console.log(message);
    return message;
  }
}
