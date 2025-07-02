import { JoinTable, ManyToMany, ManyToOne, Entity, Column } from "typeorm";
import { WGBaseEntity } from "./WGBaseEntity";
import MediaEntity from "./MediaEntity";

/**
 * To be used as generic data storage
 */
@Entity({ name: "storages" })
export class StorageEntity extends WGBaseEntity {
  @Column({ default: "" })
  type!: string;

  @Column({ type: "json", default: {} })
  content: any;

  @Column({ nullable: true })
  imageId!: number;
  @ManyToOne(() => MediaEntity, (media) => media.id)
  image!: MediaEntity;

  @ManyToMany(() => MediaEntity)
  @JoinTable({ name: "storages_medias" })
  imageList!: MediaEntity[];
}

export default StorageEntity;
