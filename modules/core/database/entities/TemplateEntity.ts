import { PrimaryGeneratedColumn, Entity, Column } from "typeorm";
import { WGBaseEntity } from "./WGBaseEntity";

@Entity({ name: "templates" })
export class TemplateEntity extends WGBaseEntity {
  @Column()
  title!: string;
  @Column({ type: "text" })
  body!: string;
  @Column({ default: "" })
  documentType!: string;
}
