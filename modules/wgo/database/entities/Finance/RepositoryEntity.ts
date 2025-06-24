import { Entity, Column, BaseEntity, PrimaryColumn, OneToMany, ManyToOne, ManyToMany } from 'typeorm'
import { AccountEntity } from './AccountEntity'
import { IssueEntity } from './IssueEntity'

@Entity()
export class RepositoryEntity extends BaseEntity {
  @PrimaryColumn() id: number
  @Column() title: string

  @OneToMany(() => IssueEntity, (issue) => issue.repositoryId)
  issues?: IssueEntity[]

  @ManyToMany(() => AccountEntity, (repo) => repo.repos)
  accounts?: AccountEntity[]

  constructor(numberId: number, title: string) {
    super()
    this.id = numberId
    this.title = title
  }
}

export default RepositoryEntity
