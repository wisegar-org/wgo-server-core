import { PrimaryGeneratedColumn, Entity, Column } from "typeorm";
import { AGVNewsletterMessageStatusEnum } from "@wisegar-org/wgo-base-models";
import { CoreEntity } from "../../../core/database/entities/core.entity";

@Entity()
export class AGVNewsletterMessageEntity extends CoreEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ default: "" })
  title!: string;
  @Column({ type: "text", default: "" })
  message!: string;
  @Column({ default: AGVNewsletterMessageStatusEnum.Waiting })
  status!: AGVNewsletterMessageStatusEnum;
}
