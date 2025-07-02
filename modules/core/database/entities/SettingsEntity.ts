import { PrimaryGeneratedColumn, Entity, Column } from "typeorm";
import { CoreEntity } from "./core.entity";

@Entity({ name: "settings" })
export class SettingsEntity extends CoreEntity {
  @Column({ default: "", unique: true })
  type_settings!: string;

  @Column({ type: "json", default: {} })
  settings!: any;
}

export default SettingsEntity;
