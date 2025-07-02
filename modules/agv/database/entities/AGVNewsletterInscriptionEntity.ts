import { PrimaryGeneratedColumn, Entity, Column } from "typeorm";
import { AGVNewsletterInscriptionStatusEnum } from "@wisegar-org/wgo-base-models";
import { CoreEntity } from "../../../core/database/entities/core.entity";

@Entity()
export class AGVNewsletterInscriptionEntity extends CoreEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ default: "" })
  email!: string;
  @Column({ default: AGVNewsletterInscriptionStatusEnum.Waiting })
  status!: AGVNewsletterInscriptionStatusEnum;
}
