import { Entity, Column, BaseEntity, PrimaryColumn } from 'typeorm'

@Entity()
export class LabelEntity extends BaseEntity {
  @PrimaryColumn({ type: 'bigint' }) id: number
  @Column() title: string

  constructor(numberId: number, title: string) {
    super()
    this.id = numberId
    this.title = title
  }
}

export default LabelEntity
