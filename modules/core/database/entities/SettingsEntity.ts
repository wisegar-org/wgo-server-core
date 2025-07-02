import { PrimaryGeneratedColumn, Entity, Column } from "typeorm";
import { WGBaseEntity } from "./WGBaseEntity";

@Entity({ name: "settings" })
export class SettingsEntity extends WGBaseEntity {
  @Column({ default: "", unique: true })
  type_settings!: string;

  @Column({ type: "json", default: {} })
  settings!: any;
}

export default SettingsEntity;
