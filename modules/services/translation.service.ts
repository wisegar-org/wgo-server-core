import { DataSource, ILike, In } from "typeorm";
import { TranslationEntity } from "../database/entities/TranslationEntity";
import {
  IGetAllTranslationsByKeyArg,
  IGetAllTranslationArg,
  ITransaltionsType,
  ITranslationModel,
  IContextBase,
  ILanguageModel,
  StorageKeys,
} from "@wisegar-org/wgo-base-models";
import { UtilService } from "../core/services/UtilService";
import { LanguageService } from "./language.service";
import { HistoryService } from "./historic.service";

export class TranslationService {
  private ctx: IContextBase;
  private dataSoure: DataSource;
  private historicModel: HistoryService<TranslationEntity>;

  /**
   *
   */
  constructor(ctx: IContextBase) {
    this.ctx = ctx;
    this.dataSoure = ctx.dataSource;
    this.historicModel = new HistoryService(TranslationEntity, ctx);
  }

  async getAllTranslation(data: IGetAllTranslationArg) {
    const translations = await this.getTranslationsByFilter(
      data.languageId,
      data.search
    );
    return translations;
  }

  async getAllTranslationByKeys(data: IGetAllTranslationsByKeyArg) {
    if (data.languageId === 0) {
      return [];
    }
    const translations: ITranslationModel[] = await this.getTranslations(
      data.languageId,
      data.keys
    );
    return translations;
  }

  async getTranslations(lang: number, keys: string[]) {
    const translationRepository =
      this.dataSoure.getRepository(TranslationEntity);
    let translations = await translationRepository.find({
      where: {
        key: In(keys),
        languageId: lang,
      },
    });

    const findKeys: { [key: string]: boolean } = {};
    translations.forEach((trns) => (findKeys[trns.key] = true));
    const entitiesToCreate: TranslationEntity[] = [];
    keys.forEach((key) => {
      if (!findKeys[key]) {
        const toInsert = new TranslationEntity();
        toInsert.key = key;
        toInsert.value = key;
        toInsert.languageId = lang;
        entitiesToCreate.push(toInsert);
      }
    });

    if (entitiesToCreate.length) {
      translationRepository.insert(entitiesToCreate);
      translations = translations.concat(entitiesToCreate);
    }

    return translations.map((translation) =>
      this.mapTranslationEntity(translation)
    );
  }

  async getTranslation(lang: number, key: string, create: boolean = true) {
    const translationRepository =
      this.dataSoure.getRepository(TranslationEntity);
    let translation = await translationRepository.findOne({
      where: {
        key: key,
        languageId: lang,
      },
    });
    if (!translation) {
      translation = new TranslationEntity();
      translation.key = key;
      translation.value = key;
      translation.languageId = lang;

      if (create) translation = await translationRepository.save(translation);
    }

    return this.mapTranslationEntity(translation);
  }

  async getTranslationValue(lang: number, key: string) {
    const translationRepository =
      this.dataSoure.getRepository(TranslationEntity);
    let translation = await translationRepository.findOne({
      where: {
        key: key,
        languageId: lang,
      },
    });
    return translation ? translation.value : key;
  }

  async getTranslationsByCriteria(criteria: any) {
    const translationRepository =
      this.dataSoure.getRepository(TranslationEntity);
    const translations = await translationRepository.find({ where: criteria });
    return translations;
  }

  async setTranslation(
    lang: number,
    key: string,
    value: string,
    historic: boolean = true
  ) {
    const translationRepository =
      this.dataSoure.getRepository(TranslationEntity);
    let translation = await translationRepository.findOne({
      where: {
        key: key,
        languageId: lang,
      },
    });
    if (!translation) {
      translation = new TranslationEntity();
      translation.key = key;
      translation.languageId = lang;
    }
    translation.value = value;
    const translationResult = await translationRepository.save(translation);
    if (historic) await this.historicModel.createPutHistoric(translationResult);
    return this.mapTranslationEntity(translationResult);
  }

  async setTranslationOptionalHistoric(
    lang: number,
    key: string,
    value: string
  ) {
    return await this.setTranslation(lang, key, value, !!this.ctx.user);
  }

  async deleteTranslation(key: string) {
    const translationRepository =
      this.dataSoure.getRepository(TranslationEntity);
    await translationRepository.softDelete({
      key: key,
    });
    return true;
  }

  mapTranslationEntity(translation: TranslationEntity) {
    return {
      id: translation.key,
      key: translation.key,
      languageId: translation.languageId,
      value: translation.value,
    } as ITranslationModel;
  }

  async getTranslationsByFilter(lang: number, search: string = "") {
    const searchTranslationskeys: { [key: string]: boolean } = {};
    const translationsFile: ITransaltionsType = {};
    const languageService = new LanguageService(this.ctx);
    const langs: ILanguageModel[] = await languageService.getAllLanguage();
    for (const language of langs) {
      await this.getKeysByFilterInDB(
        language.id,
        search,
        searchTranslationskeys,
        lang === language.id ? translationsFile : null
      );
    }

    const translationsKeys = Object.keys(searchTranslationskeys);
    const keys = translationsKeys.sort();

    const translations: ITranslationModel[] = [];
    keys.forEach((key) => {
      translations.push({
        id: key,
        key: key,
        value: translationsFile[key] || key,
        languageId: lang,
      });
    });

    return translations;
  }

  async inportTranslations(buffer: any) {
    const languageService = new LanguageService(this.ctx);
    const { createReadStream } = buffer;
    const stream: any = createReadStream();
    const fileContent = await UtilService.readStreamData(stream);

    let doc = Buffer.from(fileContent as any, "base64").toString();
    const format = " __*__,";

    const langs: ILanguageModel[] = await languageService.getAllLanguage();
    const langByCodes: { [key: string]: ILanguageModel } = {};
    langs.forEach((lang) => {
      langByCodes[lang.code] = lang;
    });

    Object.keys(langByCodes).forEach((lang) => {
      doc = doc.split(`\n${lang}`).join(`${format}${lang}`);
    });

    const translations = doc.split(format).slice(1);
    for (const str of translations) {
      const trans = str.split(",");
      const lang = langByCodes[trans[0]];
      if (trans[1] !== trans[2] && !!lang) {
        await this.setTranslation(lang.id, trans[1], trans[2]);
      }
    }

    return true;
  }

  async exportTranslations(langIds: number[]) {
    const searchTranslationskeys: { [key: string]: boolean } = {};
    const translationsFile: { [key: number]: ITransaltionsType } = {};
    const languageService = new LanguageService(this.ctx);
    const langs: ILanguageModel[] = await languageService.getAllLanguage();
    const validLanguages = langs.filter(
      (lang) => langIds.length === 0 || langIds.indexOf(lang.id) !== -1
    );
    for (const language of validLanguages) {
      translationsFile[language.id] = {};
      await this.getKeysByFilterInDB(
        language.id,
        "",
        searchTranslationskeys,
        translationsFile[language.id]
      );
    }

    const translationsKeys = Object.keys(searchTranslationskeys).filter(
      (translation) => !translation.startsWith(StorageKeys)
    );
    const keys = translationsKeys.sort();

    let result: string = '" Language "," Key "," Value ",\n';
    Object.values(validLanguages).forEach((lang) => {
      keys.forEach((key) => {
        result += `${lang.code},${key},${
          translationsFile[lang.id][key] || key
        },\n`;
      });
    });

    return Buffer.from(result).toString("base64");
  }

  private async getKeysByFilterInDB(
    language: number,
    filter = "",
    searchTranslationskeys: { [key: string]: boolean },
    translationFile: ITransaltionsType | null = null
  ) {
    const search = filter.toLowerCase();
    const filterLanguage = { languageId: language };
    const translationRepository =
      this.dataSoure.getRepository(TranslationEntity);
    const translations = await translationRepository.find({
      where: search
        ? [
            { ...filterLanguage, key: ILike(`%${search}%`) },
            { ...filterLanguage, value: ILike(`%${search}%`) },
          ]
        : filterLanguage,
      order: { key: "DESC" },
    });
    translations.forEach((translation) => {
      searchTranslationskeys[translation.key] = true;
      if (translationFile) {
        translationFile[translation.key] = translation.value;
      }
    });
  }
}
