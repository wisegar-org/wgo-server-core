import { IsNullOrUndefined } from "wgo-extensions";
import { DataSource, Repository } from "typeorm";
import { ADMIN, SUPERADMIN, USER } from "@wisegar-org/wgo-base-models";
import { RoleEntity } from "../entities/RoleEntity";

const seedRole = async (
  repository: Repository<RoleEntity>,
  roleName: string
) => {
  const role = await repository.findOne({
    where: { name: roleName },
  });
  if (IsNullOrUndefined(role)) {
    const roleEntity = new RoleEntity();
    roleEntity.name = roleName;
    const registeredRole = await repository.save(roleEntity);
    if (!IsNullOrUndefined(registeredRole))
      console.debug(`Role registered: ${registeredRole.name}`);
  }
};

export const rolesDataSeeder = async (dataSource: DataSource) => {
  const roleRepository = dataSource.getRepository(RoleEntity);
  await seedRole(roleRepository, SUPERADMIN);
  await seedRole(roleRepository, ADMIN);
  await seedRole(roleRepository, USER);
};
