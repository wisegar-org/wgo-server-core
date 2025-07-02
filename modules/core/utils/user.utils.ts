import { IUser } from "@wisegar-org/wgo-base-models";
import { UserEntity } from "../database/entities/UserEntity";

export const UserUtils = {
  mapUserEntity(user: UserEntity): IUser {
    return {
      id: user.id,
      name: user.name || "",
      lastName: user.lastName || "",
      userName: user.userName,
      email: user.email || "",
      isEmailConfirmed: !!user.isEmailConfirmed,
      code: user.code,
      certificate: user.certificate,
      cap: user.cap || "",
      address: user.address || "",
      phone: user.phone || "",
      roles: (user.roles || []).map((role: { name: any }) => role.name),
    } as IUser;
  },
  isEmptyCode(code: string): boolean {
    return !code.split(" ").join("");
  },
};
