import { In, Repository } from "typeorm";
import ProjectEntity from "../../database/entities/Finance/ProjectEntity";
import { IContextBase } from "@wisegar-org/wgo-base-models";

export class FinanceProjectService {
  private ctx: IContextBase;
  private repo: Repository<ProjectEntity>;
  constructor(ctx: IContextBase) {
    this.ctx = ctx;
    this.repo = this.ctx.dataSource.getRepository(ProjectEntity);
  }

  async addProject(numberId: number, title: string): Promise<ProjectEntity> {
    const result = await this.repo.findOne({
      where: {
        id: numberId,
      },
    });
    if (result !== null) {
      return result;
    }

    const proj = new ProjectEntity(numberId, title);
    return await this.repo.manager.save(proj);
  }

  async updateOrInsertProject(
    numberId: number,
    title: string
  ): Promise<ProjectEntity> {
    let project = await this.repo.findOne({
      where: {
        id: numberId,
      },
    });
    if (project !== null) {
      project.title = title;
      return await project.save();
    } else {
      project = new ProjectEntity(numberId, title);
      return await this.repo.manager.save(project);
    }
  }

  async findProjectById(numberId: number): Promise<ProjectEntity | null> {
    return await this.repo.findOne({
      where: {
        id: numberId,
      },
    });
  }

  async findProjectsById(projectsIds: number[]) {
    return await this.repo.find({
      where: {
        id: In(projectsIds),
      },
    });
  }

  async getAllProject(): Promise<ProjectEntity[]> {
    return await this.repo.find();
  }
}
