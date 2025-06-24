import { Entity, Column, BaseEntity, PrimaryColumn, OneToMany, ManyToOne, ManyToMany } from 'typeorm'
import { AccountEntity } from './AccountEntity'
import { IssueEntity } from './IssueEntity'

@Entity()
export class ProjectEntity extends BaseEntity {
  @PrimaryColumn() id: number
  @Column() title: string

  @OneToMany(() => IssueEntity, (issue) => issue.projectId)
  issues?: IssueEntity[]

  @ManyToMany(() => AccountEntity, (acc) => acc.projects)
  accounts?: AccountEntity[]

  constructor(numberId: number, title: string) {
    super()
    this.id = numberId
    this.title = title
  }
}

export default ProjectEntity
