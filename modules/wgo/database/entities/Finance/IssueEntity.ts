import { Entity, Column, BaseEntity, PrimaryColumn, ManyToOne } from "typeorm";
import { CollaboratorEntity } from "./CollaboratorEntity";
import { ProjectEntity } from "./ProjectEntity";
import { RepositoryEntity } from "./RepositoryEntity";
import { AccountEntity } from "./AccountEntity";

@Entity()
export class IssueEntity extends BaseEntity {
  @PrimaryColumn() id: number;
  @Column() owner: string;
  @Column() repo: string;
  @Column() title: string;
  @Column() status: string;
  @Column({ type: "float" }) hours: number;
  @Column() labels: string;
  @Column() milestones: string;
  @Column({ nullable: true }) last_comment?: string;
  @Column() created_at: Date;
  @Column() closed_at: Date;
  @Column() updated_at: Date;
  @Column() number: number;
  @Column({ nullable: true }) description: string;
  @Column() url: string;

  @Column({ nullable: true }) assignedToId!: number;
  @ManyToOne(() => CollaboratorEntity, (col) => col.issues, { nullable: true })
  assignedTo!: CollaboratorEntity;

  @Column({ nullable: true }) projectId!: number;
  @ManyToOne(() => ProjectEntity, (proj) => proj.issues, { nullable: true })
  project!: ProjectEntity;

  @Column({ nullable: true }) repositoryId!: number;
  @ManyToOne(() => RepositoryEntity, (repo) => repo.issues, { nullable: true })
  repository!: RepositoryEntity;

  @Column({ type: "integer", nullable: true }) accountId!: number | null;
  @ManyToOne(() => AccountEntity, (acc) => acc.issues, { nullable: true })
  account!: AccountEntity | null;

  constructor(
    numberId: number,
    owner: string,
    repository_name: string,
    title: string,
    status: string,
    hours: number,
    created_at: Date,
    closed_at: Date,
    updated_at: Date,
    number: number,
    description: string,
    url: string,
    last_comment?: string,
    collaborator?: CollaboratorEntity | null,
    project?: ProjectEntity | null,
    repo?: RepositoryEntity | null,
    labels?: string[],
    milestones?: string,
    account?: AccountEntity | null
  ) {
    super();
    this.id = numberId;
    this.title = title;
    this.status = status;
    this.hours = hours || 0;
    this.last_comment = last_comment;

    this.created_at = created_at;
    this.closed_at = closed_at;
    this.updated_at = updated_at;

    this.number = number;
    this.owner = owner;
    this.repo = repository_name;

    this.description = description;
    this.url = url;

    if (collaborator) {
      this.assignedToId = collaborator.id;
      this.assignedTo = collaborator;
    }
    if (project) {
      this.projectId = project.id;
      this.project = project;
    }
    if (repo) {
      this.repositoryId = repo.id;
      this.repository = repo;
    }
    if (account) {
      this.accountId = account.id;
      this.account = account;
    }
    this.labels = labels ? labels.join(", ") : "";
    this.milestones = milestones || "";
  }
}

export default IssueEntity;
