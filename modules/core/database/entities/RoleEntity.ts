import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import "reflect-metadata";
import { UserEntity } from "./UserEntity";
import { CoreEntity } from "./core.entity";

@Entity({ name: "roles" })
export class RoleEntity extends CoreEntity {
  @Column({ unique: true })
  name!: string;

  @ManyToMany(() => UserEntity, (user: any) => user.roles)
  users?: UserEntity[];
}
