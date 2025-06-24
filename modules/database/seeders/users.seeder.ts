import { IsNullOrUndefined } from "wgo-extensions";
import { DataSource } from "typeorm";
import * as bcrypt from "bcrypt";
import { SUPERADMIN } from "@wisegar-org/wgo-base-models";
import { RoleEntity } from "../entities/RoleEntity";
import { UserEntity } from "../entities/UserEntity";

const seedUser = async (
  dataSource: DataSource,
  username: string,
  pass: string,
  role: string
) => {
  const userRepository = dataSource.getRepository(UserEntity);
  const roleRepository = dataSource.getRepository(RoleEntity);

  const adminUserResult = await userRepository.findOne({
    where: { email: username },
  });

  if (adminUserResult) {
    return;
  }

  const roleEntity = await roleRepository.findOne({
    where: { name: role },
  });
  if (!roleEntity) {
    console.error(`Role ${role} does not exist!`);
    return;
  }

  const newUser = new UserEntity();
  newUser.email = username;
  newUser.userName = username;
  newUser.isEmailConfirmed = true;
  newUser.name = username;
  newUser.lastName = username;
  newUser.password = bcrypt.hashSync(pass, 10);
  newUser.roles = roleEntity ? [roleEntity] : [];
  const newUserRegistered = await userRepository.save(newUser);

  if (!IsNullOrUndefined(newUserRegistered))
    console.debug(`User registered: ${newUserRegistered.email}`);
};

export const usersDataSeeder = async (dataSource: DataSource) => {
  const adminUserEmail = "admin@wisegar.org";
  await seedUser(dataSource, adminUserEmail, "Wisegar.-0", SUPERADMIN);
};
