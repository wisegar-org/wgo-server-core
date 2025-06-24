import { EmailServer } from "wgo-mailer";
import { DataSource, In } from "typeorm";
import {
  TOKEN_EXP,
  TOKEN_REGISTER_EXP,
  WRONG_USER_DONT_EXIST,
  IAuthModelArg,
  IIdInput,
  IUser,
} from "@wisegar-org/wgo-base-models";
import { UserUtils } from "../utils/user.utils";
import { UserEntity } from "../database/entities/UserEntity";
import { RoleEntity } from "../database/entities/RoleEntity";

export class UserRolesService {
  private dataSource: DataSource;
  private emailService: EmailServer;
  private options: IAuthModelArg;
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
    this.emailService = new EmailServer();
  }

  public async getUser(id: number): Promise<IUser | null> {
    const repo = await this.dataSource.getRepository(UserEntity);
    const user = await repo.findOne({
      where: { id: id },
      relations: ["roles"],
    });

    if (user) return UserUtils.mapUserEntity(user);

    return null;
  }

  public async getUserByEmail(email: string): Promise<IUser | null> {
    const repo = await this.dataSource.getRepository(UserEntity);
    const user = await repo.findOne({
      where: { email },
      relations: ["roles"],
    });

    if (user) return UserUtils.mapUserEntity(user);

    return null;
  }

  public async getEntityByCriteria(where: any): Promise<UserEntity | null> {
    const repo = await this.dataSource.getRepository(UserEntity);
    const user = await repo.findOne({
      where: where,
      relations: ["roles"],
    });

    if (user) return user;

    return null;
  }

  public async getAllUsers(): Promise<IUser[]> {
    const repo = await this.dataSource.getRepository(UserEntity);
    const users = await repo.find({
      relations: ["roles"],
      order: {
        lastName: "ASC",
        userName: "ASC",
      },
    });
    return users.map((user) => UserUtils.mapUserEntity(user));
  }

  public async getAllRoles(): Promise<string[]> {
    const repo = await this.dataSource.getRepository(RoleEntity);
    const roles = await repo.find({ order: { name: "ASC" } });
    return roles.map((role) => role.name);
  }

  public async deleteUser(data: IIdInput) {
    const repo = await this.dataSource.getRepository(UserEntity);
    const user = await repo.findOne({
      where: {
        id: data.id,
      },
    });

    if (!!user) {
      await user.remove();
      return true;
    }

    throw new Error(WRONG_USER_DONT_EXIST);
  }

  public async getRolesByString(roles: string[]) {
    const repo = await this.dataSource.getRepository(RoleEntity);
    const rolesRsult = await repo.find({
      where: {
        name: In(roles),
      },
    });

    return rolesRsult;
  }
}
