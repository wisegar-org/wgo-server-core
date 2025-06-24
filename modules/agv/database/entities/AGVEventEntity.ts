import {
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Entity,
  Column,
  OneToMany,
} from "typeorm";
import { AGVInscriptionEntity } from "./AGVInscriptionEntity";
import { EventStateEnum, EventTypeEnum } from "@wisegar-org/wgo-base-models";
import { WGBaseEntity } from "../../../database/entities/WGBaseEntity";
import MediaEntity from "../../../database/entities/MediaEntity";

@Entity()
export class AGVEventEntity extends WGBaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;
  @Column({ default: "", type: "text" })
  description!: string;
  @Column({ default: "", type: "text" })
  shortDescription!: string;
  @Column({ default: "" })
  class!: string;
  @Column({ default: EventTypeEnum.Event })
  type!: string;

  @Column({ nullable: true })
  startDate!: Date;
  @Column({ nullable: true })
  endDate!: Date;

  @Column({ default: true })
  visible!: boolean;
  @Column({ default: true })
  enrollment!: boolean;

  @Column({ default: EventStateEnum.Waiting })
  state!: string;

  @Column({ nullable: true })
  imgTitleId!: number;
  @ManyToOne(() => MediaEntity, (media) => media.id)
  imgTitle!: MediaEntity;

  @ManyToMany(() => MediaEntity)
  @JoinTable()
  imgList!: MediaEntity[];

  @OneToMany(() => AGVInscriptionEntity, (inscription) => inscription.event, {
    cascade: true,
  })
  inscriptions?: AGVInscriptionEntity[];
}

export default AGVEventEntity;
