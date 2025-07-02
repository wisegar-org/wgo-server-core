import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CoreEntity } from "./core.entity";
import MediaEntity from "./MediaEntity";

@Entity({ name: "languages" })
export class LanguageEntity extends CoreEntity {
  @Column({ default: "" })
  code!: string;
  @Column({ default: false })
  enabled!: boolean;
  @Column({ default: false })
  default!: boolean;
  @Column({ nullable: true })
  logoId!: number;
  @ManyToOne(() => MediaEntity, (media) => media.id)
  logo!: MediaEntity;
}
