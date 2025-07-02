import { IsString } from "wgo-extensions";
import { DataSource, Like, Repository } from "typeorm";
import { MediaService } from "./media.service";
import {
  IMediaModel,
  IContextBase,
  IStorageResponse,
  StringDictionary,
  StorageKeys,
  StorageItem,
} from "@wisegar-org/wgo-base-models";
import { TranslationService } from "./translation.service";
import StorageEntity from "../database/entities/StorageEntity";
import { HistoryService } from "./historic.service";

export class StorageService {
  dataSource: DataSource;
  storageRepository: Repository<StorageEntity>;
  ctx: IContextBase;
  private mediaModel: MediaService;
  private translationModel: TranslationService;
  private historicModel: HistoryService<StorageEntity>;

  /**
   *
   */
  constructor(ctx: IContextBase) {
    this.ctx = ctx;
    this.dataSource = ctx.dataSource;
    this.storageRepository = this.dataSource.getRepository(StorageEntity);
    this.mediaModel = new MediaService(ctx);
    this.translationModel = new TranslationService(ctx);
    this.historicModel = new HistoryService<StorageEntity>(StorageEntity, ctx);
  }

  async allByType(type: string, relations: string[] = [], search: string = "") {
    return this.allByCriteria({ type: type }, relations, search);
  }

  async allByTypePage(
    type: string,
    relations: string[] = [],
    skip: number = 0,
    take: number = 0,
    search: string = "",
    sortBy: string = "",
    descending: boolean = false
  ) {
    const result = await this.allByCriteria(
      { type: type },
      relations,
      search,
      sortBy,
      descending
    );
    return {
      storageItemsCount: result.length,
      storageItems: result.slice(skip, skip + take),
    };
  }

  async allByCriteria(
    condition: any,
    relations: string[] = [],
    search: string = "",
    sortBy: string = "",
    descending: boolean = false
  ) {
    const fields = await this.storageRepository.find({
      where: condition,
      relations: relations,
      order: { id: "ASC" },
    });

    let result = fields;
    const translations = await this.translationModel.getTranslationsByCriteria({
      key: Like(`%${StorageKeys}%`),
      value: Like(`%${search}%`),
      languageId: this.ctx.language,
    });

    const translationValues: StringDictionary = {};
    translations.map((item) => {
      translationValues[item.key] = item.value;
    });

    if (search) {
      const keys = translations.map((item) => item.key);
      result = result.filter((item) => {
        const content = JSON.stringify(item.content);
        const findItems = keys.filter((key) => content.indexOf(key) !== -1);
        return (
          JSON.stringify(item.content).indexOf(search) !== -1 ||
          findItems.length > 0
        );
      });
    }

    if (sortBy) {
      result = result.sort((item1: StorageEntity, item2: StorageEntity) => {
        if (!item1.content[sortBy] || !item2.content[sortBy]) return 0;
        if (
          item1.content[sortBy] > item2.content[sortBy] ||
          translationValues[item1.content[sortBy]] >
            translationValues[item2.content[sortBy]]
        )
          return descending ? -1 : 1;
        if (
          item1.content[sortBy] < item2.content[sortBy] ||
          translationValues[item1.content[sortBy]] <
            translationValues[item2.content[sortBy]]
        )
          return descending ? 1 : -1;
        return 0;
      });
    }

    return result;
  }

  async oneByCriteria(condition: any, relations: string[] = []) {
    const field = await this.storageRepository.findOne({
      where: condition,
      relations: relations,
    });

    return field;
  }

  async create(storageItem: StorageItem<any>) {
    let model = new StorageEntity();
    model = await this.storageRepository.manager.save(model);
    model = await this.setProperties(model, storageItem);
    const result = await this.storageRepository.manager.save(model);
    await this.historicModel.createPostHistoric(result);
    return !!result;
  }

  async modify(storageItem: StorageItem<any>) {
    let model = await this.oneByCriteria({ id: storageItem.id });
    if (!!model) {
      model = await this.setProperties(model, storageItem);
      const result = await this.storageRepository.manager.save(model);
      await this.historicModel.createPutHistoric(result);
      return !!result;
    }
    return false;
  }

  async delete(id: number) {
    const model = await this.oneByCriteria({ id: id });
    if (!!model) {
      if (model.content) {
        for (const valueKey of Object.values(model.content)) {
          if (IsString(valueKey) && `${valueKey}`.startsWith(StorageKeys)) {
            await this.translationModel.deleteTranslation(valueKey as string);
          }
        }
      }
      const result = await this.storageRepository.manager.softRemove(model);
      if (result) await this.historicModel.createDeleteHistoric(model);
      return !!result;
    }
    return false;
  }

  async setProperties(model: StorageEntity, storageItem: StorageItem<any>) {
    model.type = storageItem.type;
    const modelContent = IsString(model.content)
      ? JSON.parse(model.content as string)
      : model.content;

    if (!!storageItem.content) {
      const content = storageItem.content;
      for (const prop of Object.keys(content)) {
        if (content[prop] instanceof Array) {
          const key = this.getKeyToProperty(model.id, prop);
          for (const trans of content[prop]) {
            const translation = trans as { languageId: number; value: string };
            await this.translationModel.setTranslation(
              translation.languageId,
              key,
              translation.value
            );
          }
          modelContent[prop] = key;
        } else {
          modelContent[prop] = content[prop];
        }
      }
      model.content = modelContent;
    }

    const media = storageItem.imageId
      ? await this.mediaModel.getMediaList([storageItem.imageId])
      : null;
    if (media && media.length > 0) {
      model.image = media[0];
    }

    const mediaList = storageItem.imageListId
      ? await this.mediaModel.getMediaList(storageItem.imageListId)
      : null;
    if (mediaList) {
      model.imageList = mediaList;
    }
    return model;
  }

  getKeyToProperty(idModel: number, property: string) {
    return `${StorageKeys}_${property}_${idModel}`.toUpperCase();
  }

  async getResponseList(
    models: StorageEntity[],
    lang: number,
    urlApi = "",
    loadTranslations = false
  ) {
    const results: IStorageResponse[] = [];
    for (const model of models) {
      const item = this.getStorageResponses(model, urlApi);
      const content = item.content as any;
      for (const key of Object.keys(content)) {
        if (content[key].indexOf(StorageKeys) !== -1) {
          content[key + "Key"] = content[key];
          content[key] = !loadTranslations
            ? content[key]
            : (await this.translationModel.getTranslation(lang, content[key]))
                .value;
        }
      }
      item.content = JSON.stringify(content);
      results.push(item);
    }
    return results;
  }

  async getAllHistory(id: number) {
    return await this.historicModel.getHistoric(id);
  }

  getStorageResponses(model: StorageEntity, urlApi = "") {
    let image = undefined;
    const imageList: IMediaModel[] = [];

    if (!!model.image) {
      image = this.mediaModel.getMediaResponse(model.image, urlApi);
    }

    if (!!model.imageList) {
      model.imageList.forEach((img) => {
        imageList.push(this.mediaModel.getMediaResponse(img, urlApi));
      });
    }

    return <IStorageResponse>{
      content: model.content,
      id: model.id,
      type: model.type,
      image: image,
      imageList: imageList,
    };
  }
}
