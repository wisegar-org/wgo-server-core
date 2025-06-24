import {
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Entity,
  Column,
  BaseEntity,
  OneToMany,
  BeforeInsert,
} from "typeorm";
import { RepositoryEntity } from "./RepositoryEntity";
import { ProjectEntity } from "./ProjectEntity";
import { CollaboratorEntity } from "./CollaboratorEntity";
import { IssueEntity } from "./IssueEntity";
import { GetMaskedDate } from "wgo-extensions";

export enum AccountingStatus {
  Pending = 1,
  Confirmed = 2,
  Cancelled = 3,
}

@Entity()
export class AccountEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  date: Date;
  @Column({ nullable: true })
  initDate: Date;
  @Column({ nullable: true })
  endDate: Date;
  @Column({ type: "float" })
  total_hours: number;
  @Column({ default: 0 })
  total_projects: number;
  @Column({ default: 0 })
  total_issues: number;
  @Column({ default: 0 })
  total_repos: number;
  @Column({ type: "float", default: 0 })
  pay_by_hours: number;
  @Column({ type: "float", default: 0 })
  pay_to_internet: number;

  @Column({ type: "float", nullable: true, default: 0 })
  internet_cost: number;

  @Column({ type: "float", nullable: true, default: 0 })
  taxes: number;
  @Column({ type: "text", nullable: true, default: "" })
  details: string;
  @Column({ nullable: true, default: "" })
  payment_comment: string;

  @Column({ default: "" })
  payment_code: string;

  @Column({ default: AccountingStatus.Pending })
  status: AccountingStatus;

  @Column({ type: "float", default: 0 })
  value: number;

  @Column({ nullable: true })
  contributorId!: number;
  @ManyToOne(() => CollaboratorEntity, (coll) => coll.accounts, {
    nullable: true,
  })
  contributor!: CollaboratorEntity;

  @OneToMany(() => IssueEntity, (issue) => issue.accountId, { cascade: true })
  issues?: IssueEntity[];

  @ManyToMany(() => ProjectEntity, (project) => project.accounts, {
    cascade: true,
  })
  @JoinTable()
  projects?: ProjectEntity[];

  @ManyToMany(() => RepositoryEntity, (repo) => repo.accounts, {
    cascade: true,
  })
  @JoinTable()
  repos?: RepositoryEntity[];

  constructor(
    total_hours: number,
    total_issues: number,
    total_projects: number,
    total_repos: number,
    pay_by_hours: number,
    pay_to_internet: number,
    internet_cost: number,
    taxes: number,
    details: string,
    payment_comment: string,
    contributor: CollaboratorEntity | undefined,
    projects: ProjectEntity[] | undefined,
    repos: RepositoryEntity[] | undefined,
    initDate: Date,
    endDate: Date
  ) {
    super();
    let contributorCode = "NC";

    this.date = new Date(Date.now());
    this.total_hours = total_hours;
    this.total_issues = total_issues;
    this.total_projects = total_projects;
    this.total_repos = total_repos;
    this.pay_by_hours = pay_by_hours;
    this.pay_to_internet = pay_to_internet;
    this.initDate = initDate;
    this.endDate = endDate;

    if (contributor) {
      this.contributorId = contributor.id;
      this.contributor = contributor;
      const nameContributor = !!contributor.name
        ? contributor.name
            .split(" ")
            .map((strg) => strg[0])
            .join("")
            .toUpperCase()
        : this.contributor.login.slice(0, 3).toUpperCase();
      contributorCode = nameContributor;
    }

    if (projects) {
      this.projects = projects;
    }

    if (repos) {
      this.repos = repos;
    }

    this.internet_cost = internet_cost;
    this.taxes = taxes;
    this.details = details;
    this.payment_comment = payment_comment;
    this.payment_code = `${contributorCode}${GetMaskedDate(
      this.date,
      "YYYYMM"
    )}`;
    this.status = AccountingStatus.Pending;
    this.value = this.getTotalToPay();
  }

  @BeforeInsert()
  beforeInsertSetValue() {
    if (this.value === 0) {
      this.value = this.getTotalToPay();
    }
  }

  getTotalToPay(): number {
    const total_to_pay =
      (this.total_hours * (this.pay_by_hours * 1000) +
        this.total_hours * this.pay_to_internet * this.internet_cost * 1000 -
        this.taxes * 1000) /
      1000;
    return total_to_pay;
  }
}

export default AccountEntity;
