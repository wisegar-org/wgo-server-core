import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  BaseEntity,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class AGVPollEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: "" }) email!: string;
  @Column({ default: "" }) name!: string;
  @Column({ default: "" }) class!: string;
  @Column({ default: false }) allowPhoto!: boolean;
  @Column({ default: false }) allergy!: boolean;
  @Column({ default: "" }) foodAllergy!: string;
  @Column({ default: false }) intolerance!: boolean;
  @Column({ default: "" }) foodIntolerance!: string;
  @Column({ default: "" }) parentName!: string;
  @Column({ default: "" }) parentEmail!: string;
  @Column({ default: "" }) phone!: string;
  @Column({ default: false }) disposition!: boolean;
  @Column({ default: false }) interest!: boolean;
  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  date!: Date;
}

export default AGVPollEntity;
