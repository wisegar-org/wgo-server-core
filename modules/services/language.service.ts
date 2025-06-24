import { DataSource } from "typeorm";
import { LanguageEntity } from "../database/entities/LanguageEntity";
import {
  WRONG_LANGUAGE_CODE,
  WRONG_LANGUAGE_DONT_EXIST,
  WRONG_LANGUAGE_POST,
  WRONG_LANGUAGE_PUT,
  ILanguagePostArg,
  ILanguageModel,
  IContextBase,
  IIdInput,
} from "@wisegar-org/wgo-base-models";
import { HistoryService } from "./historic.service";

export class LanguageService {
  private dataSoure: DataSource;
  private ctx: IContextBase;
  private historicModel: HistoryService<LanguageEntity>;

  /**
   *
   */
  constructor(ctx: IContextBase) {
    this.ctx = ctx;
    this.dataSoure = ctx.dataSource;
    this.historicModel = new HistoryService(LanguageEntity, ctx);
  }

  async getAllLanguage() {
    const repository = this.dataSoure.getRepository(LanguageEntity);
    const languages = await repository.find({
      order: { code: "ASC" },
    });
    return languages.map((lang) => this.mapLanguageEntity(lang));
  }

  async getLanguage(data: IIdInput) {
    const repository = this.dataSoure.getRepository(LanguageEntity);
    const language = await repository.findOne({
      where: { id: data.id },
    });
    if (!!language) return this.mapLanguageEntity(language);

    throw new Error(WRONG_LANGUAGE_DONT_EXIST);
  }

  async postLanguage(data: ILanguagePostArg) {
    const repository = this.dataSoure.getRepository(LanguageEntity);
    const languages = await repository.find({
      where: { code: data.code },
    });

    if (languages.length > 0) throw new Error(WRONG_LANGUAGE_CODE);
    if (data.default) await this.unsetDefaultLanguage();

    const languageEntity = new LanguageEntity();
    languageEntity.code = data.code;
    languageEntity.enabled = data.enabled || data.default;
    languageEntity.default = data.default;
    const languageEntityCreated = await repository.save(languageEntity);

    if (!!languageEntityCreated) {
      await this.historicModel.createPostHistoric(languageEntityCreated);
      return this.mapLanguageEntity(languageEntityCreated);
    }

    throw new Error(WRONG_LANGUAGE_POST);
  }

  async putLanguage(data: ILanguageModel) {
    const repository = this.dataSoure.getRepository(LanguageEntity);
    const languageEntity = await repository.findOne({
      where: { id: data.id },
    });

    if (!languageEntity) throw new Error(WRONG_LANGUAGE_DONT_EXIST);
    if (data.default && !languageEntity.default)
      await this.unsetDefaultLanguage();

    languageEntity.code = data.code;
    languageEntity.default = languageEntity.default || data.default;
    languageEntity.enabled = data.enabled || languageEntity.default;
    const languageEntityUpdated = await repository.save(languageEntity);

    if (!!languageEntityUpdated) {
      await this.historicModel.createPutHistoric(languageEntityUpdated);
      return this.mapLanguageEntity(languageEntityUpdated);
    }

    throw new Error(WRONG_LANGUAGE_PUT);
  }

  async unsetDefaultLanguage() {
    const repository = this.dataSoure.getRepository(LanguageEntity);
    const defaultLanguage = await repository.find({
      where: { default: true },
    });

    if (defaultLanguage.length) {
      for (const lang of defaultLanguage) {
        lang.default = false;
        await repository.save(lang);
        await this.historicModel.createPutHistoric(lang);
      }
    }
  }

  async getDefaultLanguage() {
    const repository = this.dataSoure.getRepository(LanguageEntity);
    const language = await repository.findOne({
      where: { default: true },
    });
    if (!!language) return this.mapLanguageEntity(language);

    throw new Error(WRONG_LANGUAGE_DONT_EXIST);
  }

  mapLanguageEntity(language: LanguageEntity) {
    return {
      id: language.id,
      code: language.code,
      default: language.default,
      enabled: language.enabled,
    } as ILanguageModel;
  }
}
