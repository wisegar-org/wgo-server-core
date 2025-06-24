import { In, Repository } from "typeorm";
import RepositoryEntity from "../../database/entities/Finance/RepositoryEntity";
import { IContextBase } from "@wisegar-org/wgo-base-models";

export class FinanceRepositoryService {
  private ctx: IContextBase;
  private repo: Repository<RepositoryEntity>;
  constructor(ctx: IContextBase) {
    this.ctx = ctx;
    this.repo = this.ctx.dataSource.getRepository(RepositoryEntity);
  }

  async addRepository(
    numberId: number,
    title: string
  ): Promise<RepositoryEntity> {
    const result = await this.repo.findOne({
      where: { id: numberId },
    });
    if (result !== null) {
      return result;
    }

    const repo = new RepositoryEntity(numberId, title);
    return await this.repo.manager.save(repo);
  }

  async updateOrInsertRepository(
    numberId: number,
    title: string
  ): Promise<RepositoryEntity> {
    let repository = await this.repo.findOne({
      where: { id: numberId },
    });
    if (repository !== null) {
      repository.title = title;
      return await repository.save();
    } else {
      repository = new RepositoryEntity(numberId, title);
      return await this.repo.manager.save(repository);
    }
  }

  async findRepositoryById(numberId: number): Promise<RepositoryEntity | null> {
    return await this.repo.findOne({
      where: { id: numberId },
    });
  }

  async findRepositoriesById(reposIds: number[]) {
    return await this.repo.find({
      where: {
        id: In(reposIds),
      },
    });
  }

  async getAllRepository(): Promise<RepositoryEntity[]> {
    return await this.repo.find();
  }
}
