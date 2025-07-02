import "reflect-metadata";
import { Column, Entity } from "typeorm";
import { Actions } from "@wisegar-org/wgo-base-models";
import { CoreEntity } from "./core.entity";

@Entity({ name: "histories" })
export class HistoryEntity extends CoreEntity {
  @Column()
  entity!: string;
  @Column()
  recordId!: number;
  @Column()
  userId!: number;
  @Column()
  username!: string;
  @Column()
  message!: string;
  @Column({ type: "enum", enum: Actions })
  action!: Actions;
  @Column({ type: "jsonb", nullable: true })
  snapshot?: object;
}
