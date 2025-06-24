import { IsNullOrUndefined } from "wgo-extensions";
import { DataSource } from "typeorm";
import { SUPERADMIN } from "@wisegar-org/wgo-base-models";
import * as bcrypt from "bcrypt";
import { RoleEntity } from "../../../database/entities/RoleEntity";
import { UserEntity } from "../../../database/entities/UserEntity";

export const agvAdminUserSeeder = async (dataSource: DataSource) => {
  const adminUserEmail = "assembleagenitorivezia@gmail.com";

  const userRepository = dataSource.getRepository(UserEntity);
  const roleRepository = dataSource.getRepository(RoleEntity);
  const adminUserResult = await userRepository.findOne({
    where: { email: adminUserEmail },
  });
  const roleEntity = await roleRepository.findOne({
    where: { name: SUPERADMIN },
  });
  if (IsNullOrUndefined(adminUserResult) || !adminUserResult) {
    const adminUser = new UserEntity();
    adminUser.email = adminUserEmail;
    adminUser.userName = "admin";
    adminUser.isEmailConfirmed = true;
    adminUser.name = "AGV";
    adminUser.lastName = "Admin";
    adminUser.password = bcrypt.hashSync("@dmin.21", 10);
    adminUser.roles = roleEntity ? [roleEntity] : [];
    const adminUserRegistered = await userRepository.save(adminUser);
    if (!IsNullOrUndefined(adminUserRegistered))
      console.debug(`Admin User registered: ${adminUserRegistered.email}`);
    return;
  }

  if (!adminUserResult.roles) adminUserResult.roles = [];

  if (
    roleEntity &&
    adminUserResult.roles.findIndex((role) => role.name === roleEntity.name) ===
      -1
  ) {
    adminUserResult.roles.push(roleEntity);
    const userUpdated = await userRepository.save(adminUserResult);
    if (!IsNullOrUndefined(userUpdated))
      console.debug(`Admin AGV User registered: ${userUpdated.email}`);
    return;
  }

  console.debug(`Admin User: ${adminUserResult.email}`);
};
