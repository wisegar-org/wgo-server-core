import {
  Like,
  Repository,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
  Not,
  IsNull,
} from "typeorm";
import AccountEntity from "../../database/entities/Finance/AccountEntity";
import IssueEntity from "../../database/entities/Finance/IssueEntity";
import { IFinanceIssuesPageInput } from "../../models/Finance";
import { IContextBase } from "@wisegar-org/wgo-base-models";
import { FinanceCollaboratorService } from "./FinanceCollaboratorService";
import { FinanceProjectService } from "./FinanceProjectService";
import { FinanceRepositoryService } from "./FinanceRepositoryService";
import {
  setLabel as SetLabelGithub,
  removeLabel as RemoveLabelGithub,
} from "@wisegar-org/wgo-github";
import {
  ObjectDictionary,
  StringDictionary,
} from "@wisegar-org/wgo-base-models";

export class FinanceIssuesService {
  ctx: IContextBase;
  repo: Repository<IssueEntity>;
  collaboratorService: FinanceCollaboratorService;
  projectService: FinanceProjectService;
  repositoryService: FinanceRepositoryService;

  constructor(ctx: IContextBase) {
    this.ctx = ctx;
    this.repo = this.ctx.dataSource.getRepository(IssueEntity);
    this.collaboratorService = new FinanceCollaboratorService(ctx);
    this.projectService = new FinanceProjectService(ctx);
    this.repositoryService = new FinanceRepositoryService(ctx);
  }

  async getFinanceIssues(data: IFinanceIssuesPageInput) {
    const filter: ObjectDictionary = {};
    const order: StringDictionary = {};
    if (data.filter.assignedTo) {
      filter.assignedTo = { login: data.filter.assignedTo };
    }
    if (data.filter.labels) {
      filter.labels = Like(`%${data.filter.labels}%`);
    }
    if (data.filter.project) {
      filter.projectId = data.filter.project;
    }
    if (data.filter.repository) {
      filter.repository = { title: data.filter.repository };
    }
    if (data.filter.status) {
      filter.accountId = data.filter.status === 1 ? Not(IsNull()) : IsNull();
    }
    if (data.filter.minDate && data.filter.maxDate) {
      filter.closed_at = Between(data.filter.minDate, data.filter.maxDate);
    } else if (data.filter.minDate) {
      filter.closed_at = MoreThanOrEqual(data.filter.minDate);
    } else if (data.filter.maxDate) {
      filter.closed_at = LessThanOrEqual(data.filter.maxDate);
    }
    if (data.sortBy) {
      order[data.sortBy] = data.descending ? "DESC" : "ASC";
    } else {
      order.id = data.descending ? "DESC" : "ASC";
    }

    const result = await this.repo.findAndCount({
      where: filter,
      order: order,
      relations: ["assignedTo", "repository"],
      skip: data.skip,
      take: data.take,
    });
    //get issues by page

    return {
      issuesCount: result[1],
      issues: result[0],
    };
  }

  async addIssue(
    numberId: number,
    owner: string,
    repository: string,
    title: string,
    status: string,
    hours: number,
    last_comment: string,
    created_at: Date,
    closed_at: Date,
    updated_at: Date,
    number: number,
    description: string,
    url: string,
    collaboratorId?: number,
    projectId?: number,
    repositoryId?: number,
    labels?: string[],
    milestones?: string
  ): Promise<IssueEntity> {
    const result = await this.repo.findOne({
      where: {
        id: numberId,
      },
    });
    if (!!result) {
      return result;
    }

    const collaborator = collaboratorId
      ? await this.collaboratorService.findCollaboratorById(collaboratorId)
      : null;
    const project = projectId
      ? await this.projectService.findProjectById(projectId)
      : null;
    const repo = repositoryId
      ? await this.repositoryService.findRepositoryById(repositoryId)
      : null;

    const proj = new IssueEntity(
      numberId,
      owner,
      repository,
      title,
      status,
      hours,
      created_at,
      closed_at,
      updated_at,
      number,
      description,
      url,
      last_comment,
      collaborator,
      project,
      repo,
      labels,
      milestones
    );
    return await this.repo.save(proj);
  }

  async updateOrInsertIssue(
    numberId: number,
    owner: string,
    repository: string,
    title: string,
    status: string,
    hours: number,
    last_comment: string,
    created_at: Date,
    closed_at: Date,
    updated_at: Date,
    number: number,
    description: string,
    url: string,
    collaboratorId?: number,
    projectId?: number,
    repositoryId?: number,
    labels?: string[],
    milestones?: string
  ): Promise<IssueEntity> {
    let issue = await this.repo.findOne({
      where: {
        id: numberId,
      },
    });

    const collaborator = collaboratorId
      ? await this.collaboratorService.findCollaboratorById(collaboratorId)
      : null;
    const project = projectId
      ? await this.projectService.findProjectById(projectId)
      : null;
    const repo = repositoryId
      ? await this.repositoryService.findRepositoryById(repositoryId)
      : null;
    if (issue !== null) {
      issue.title = title || issue.title;
      issue.status = status || issue.status;
      issue.hours = hours || 0;
      issue.assignedToId = collaborator ? collaborator.id : issue.assignedToId;
      issue.projectId = project ? project.id : issue.projectId;
      issue.labels = labels ? labels.join(", ") : issue.labels;
      issue.milestones = milestones || issue.milestones;
      issue.last_comment = last_comment || issue.last_comment;

      issue.created_at = created_at || issue.created_at;
      issue.closed_at = closed_at || issue.closed_at;
      issue.updated_at = updated_at || issue.updated_at;

      issue.number = number || issue.number;
      issue.owner = owner || issue.owner;
      issue.repo = repository || issue.repo;

      issue.description = description || issue.description;
      issue.url = url || issue.url;

      if (collaborator) {
        issue.assignedToId = collaborator.id;
        issue.assignedTo = collaborator;
      }
      if (project) {
        issue.projectId = project.id;
        issue.project = project;
      }
      if (repo) {
        issue.repositoryId = repo.id;
        issue.repository = repo;
      }

      issue.accountId = issue.accountId;
      issue.account = issue.account;

      return await issue.save();
    } else {
      const proj = new IssueEntity(
        numberId,
        owner,
        repository,
        title,
        status,
        hours,
        created_at,
        closed_at,
        updated_at,
        number,
        description,
        url,
        last_comment,
        collaborator,
        project,
        repo,
        labels,
        milestones
      );
      return await this.repo.manager.save(proj);
    }
  }

  async updateAccount(id: number, accountId: number, account: AccountEntity) {
    let issue = await this.repo.findOne({
      where: {
        id: id,
      },
    });
    if (issue !== null) {
      issue.account = account;
      issue.accountId = accountId;
      return await this.repo.manager.save(issue);
    }
  }

  async setLabel(
    owner: string,
    repo: string,
    issueNumber: number,
    label: string,
    token: string
  ) {
    await SetLabelGithub(owner, repo, issueNumber, label, token);
  }

  async removeLabel(
    owner: string,
    repo: string,
    issueNumber: number,
    label: string,
    token: string
  ) {
    await RemoveLabelGithub(owner, repo, issueNumber, label, token);
  }

  async removeAccount(accountId: number, accountLabel: string, token: string) {
    let issues = await this.repo.find({
      where: {
        accountId: accountId,
      },
    });
    issues.forEach(async (issue) => {
      if (issue !== null) {
        issue.accountId = null;
        await this.repo.manager.save(issue);

        // remove label from github
        this.removeLabel(
          issue.owner,
          issue.repo,
          issue.number,
          accountLabel,
          token
        );
      }
    });
  }

  async findIssueById(numberId: number): Promise<IssueEntity | null> {
    return await this.repo.findOne({
      where: {
        id: numberId,
      },
    });
  }

  async findIssuesById(issuesIds: number[]) {
    return await this.repo.findByIds(issuesIds);
  }

  async getAllIssues(): Promise<IssueEntity[]> {
    const filter = await this.collaboratorService.getFilterByCollaborator(
      "assignedToId"
    );
    return await this.repo.find({
      where: { ...filter },
      relations: ["assignedTo", "project", "repository", "account"],
      order: { id: "DESC" },
    });
  }

  async getIssuesFromAccount(accountId: number): Promise<IssueEntity[]> {
    return await this.repo.find({
      where: { accountId: accountId },
      relations: ["assignedTo", "project", "repository", "account"],
    });
  }

  async getStats(idCollaborator: number) {
    const query = await this.repo
      .createQueryBuilder("iss")
      .select("date_part('week', iss.closed_at::date)", "week_number")
      .addSelect("date_trunc('week', iss.closed_at::date)", "weekly")
      .addSelect("COUNT(iss.id)", "count_task")
      .addSelect("SUM(iss.hours)", "hours")
      .addSelect("SUM(iss.hours)/5", "average")
      .where("iss.assignedToId = :id", { id: idCollaborator })
      .groupBy("week_number, weekly")
      .orderBy("weekly");

    const statsWeek = await query.getRawMany();

    return statsWeek.map((item: any) => {
      return item;
    });
  }
}
