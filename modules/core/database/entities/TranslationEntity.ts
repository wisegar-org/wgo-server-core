import { Entity, Column, ManyToOne } from "typeorm";
import { CoreEntity } from "./core.entity";
import { LanguageEntity } from "./LanguageEntity";

@Entity({ name: "translations" })
export class TranslationEntity extends CoreEntity {
  @Column({ nullable: false }) key!: string;
  @Column({ default: "Empty" }) value!: string;

  @Column({ nullable: true }) languageId!: number;
  @ManyToOne(() => LanguageEntity, (lang) => lang.id)
  language!: LanguageEntity;
}
