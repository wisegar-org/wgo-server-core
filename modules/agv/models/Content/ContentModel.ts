import StorageEntity from "../../../database/entities/StorageEntity";
import { StorageService } from "../../../services/storage.service";
import { AGVContentsInput } from "../../resolvers/Content/AGVContentsInputs";
import { StorageItem, IContextBase } from "@wisegar-org/wgo-base-models";

const agvContentsType = "AGV_CONTENTS_TYPE";

export class AGVContentModel {
  private storageModel: StorageService;

  /**
   *
   */
  constructor(ctx: IContextBase) {
    this.storageModel = new StorageService(ctx);
  }

  async getContents() {
    const result = await this.storageModel.oneByCriteria({
      type: agvContentsType,
    });

    if (!result) {
      const storage = {} as StorageItem<any>;
      storage.type = agvContentsType;
      storage.content = {};
      await this.storageModel.create(storage);
    }

    return result?.content || {};
  }

  async setContents(contents: AGVContentsInput) {
    let storage = await this.storageModel.oneByCriteria({
      type: agvContentsType,
    });
    if (!storage) {
      storage = new StorageEntity();
      storage.type = agvContentsType;
      storage.content = {};
      await this.storageModel.create({
        content: storage.content,
        type: agvContentsType,
        imageId: 0,
        imageListId: [],
        id: 0,
      });
      storage = await this.storageModel.oneByCriteria({
        type: agvContentsType,
      });
    }
    const content = JSON.parse(contents.contents);
    return await this.storageModel.modify({
      content: { ...storage?.content, ...content },
      type: agvContentsType,
      imageId: storage?.imageId || 0,
      imageListId: [],
      id: storage?.id || 0,
    });
  }

  async getAllHistory() {
    const result = await this.storageModel.oneByCriteria({
      type: agvContentsType,
    });
    return result ? await this.storageModel.getAllHistory(result.id) : [];
  }
}
