import { Repository } from "typeorm";
import LabelEntity from "../../database/entities/Finance/LabelEntity";
import { IContextBase } from "@wisegar-org/wgo-base-models";

export class FinanceLabelService {
  private ctx: IContextBase;
  private repo: Repository<LabelEntity>;
  constructor(ctx: IContextBase) {
    this.ctx = ctx;
    this.repo = this.ctx.dataSource.getRepository(LabelEntity);
  }

  async addLabel(numberId: number, title: string): Promise<LabelEntity> {
    const result = await this.repo.findOne({
      where: {
        id: numberId,
      },
    });
    if (result !== null) {
      return result;
    }

    const label = new LabelEntity(numberId, title);
    return await this.repo.manager.save(label);
  }

  async updateOrInsertLabel(
    numberId: number,
    title: string
  ): Promise<LabelEntity> {
    let label = await this.repo.findOne({
      where: {
        id: numberId,
      },
    });
    if (label !== null) {
      label.title = title;
      return await label.save();
    } else {
      label = new LabelEntity(numberId, title);
      return await this.repo.manager.save(label);
    }
  }

  async findLabelById(numberId: number): Promise<LabelEntity | null> {
    return await this.repo.findOne({
      where: {
        id: numberId,
      },
    });
  }

  async getAllLabels(): Promise<LabelEntity[]> {
    return await this.repo.find();
  }
}
