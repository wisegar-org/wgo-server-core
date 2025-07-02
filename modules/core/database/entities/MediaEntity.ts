import { Entity, Column } from "typeorm";

import { CoreEntity } from "./core.entity";

@Entity({ name: "medias" })
export class MediaEntity extends CoreEntity {
  @Column({ default: "" })
  displayName!: string;
  @Column({ default: "" })
  fileName!: string;
  @Column({ default: "" })
  fileExt!: string;
  @Column({ default: "" }) mimeType!: string;
  @Column({ type: "bytea" }) fileContent!: Buffer;

  @Column({ nullable: true, default: false })
  isPublic!: boolean;

  @Column({ default: "" })
  mediaType!: string;

  @Column({ nullable: true, default: "" })
  path!: string;
}

export default MediaEntity;
