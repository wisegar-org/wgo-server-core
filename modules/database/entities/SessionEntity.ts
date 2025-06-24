import { Entity, Column } from "typeorm";
import { ISessionLicenze } from "../../core/models/Models";
import { WGBaseEntity } from "./WGBaseEntity";

@Entity({ name: "sessions" })
export class SessionEntity extends WGBaseEntity {
  @Column()
  userId!: string;
  @Column()
  email!: string;
  @Column("text", { array: true, default: "{}" })
  roles!: string[];
  @Column("json", { nullable: true })
  permissions!: { [key: string]: string };
  @Column({ type: "jsonb", nullable: true })
  extra!: { [key: string]: unknown };
  @Column({ type: "jsonb", nullable: true })
  applicazioni!: ISessionLicenze;
  uuid!: string;
}
