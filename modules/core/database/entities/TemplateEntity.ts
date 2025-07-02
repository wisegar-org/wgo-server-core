import { PrimaryGeneratedColumn, Entity, Column } from "typeorm";
import { CoreEntity } from "./core.entity";

@Entity({ name: "templates" })
export class TemplateEntity extends CoreEntity {
  @Column()
  title!: string;
  @Column({ type: "text" })
  body!: string;
  @Column({ default: "" })
  documentType!: string;
}
