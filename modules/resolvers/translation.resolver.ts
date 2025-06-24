import { Arg, Mutation, Query, Resolver, Ctx } from "type-graphql";
import { TranslationResponse as TranslationsResponse } from "./translation.responses";
import { TranslationService } from "../services/translation.service";

import {
  DeleteTranslationInput,
  ExportTranslationInput,
  GetAllTranslationInput as GetAllTranslationsInput,
  GetTranslationByKeysInput,
  ImportTranslationsInput,
  SetTranslationInput,
} from "./translation.inputs";
import { GraphQLUpload } from "graphql-upload";
import {
  TRANSLATION_PATH_DELETE_TRANSLATION,
  TRANSLATION_PATH_EXPORT_TRANSLATION,
  TRANSLATION_PATH_GET_ALL_BY_KEYS,
  TRANSLATION_PATH_GET_ALL_TRANSLATION,
  TRANSLATION_PATH_SET_TRANSLATION,
  IContextBase,
  TRANSLATION_PATH_IMPORT_TRANSLATION,
} from "@wisegar-org/wgo-base-models";

@Resolver()
export class TranslationsResolver {
  @Query(() => [TranslationsResponse], {
    name: TRANSLATION_PATH_GET_ALL_TRANSLATION,
  })
  async getAllTranslations(
    @Arg("data") data: GetAllTranslationsInput,
    @Ctx() ctx: IContextBase
  ) {
    const translationModel = new TranslationService(ctx);
    const translations = await translationModel.getAllTranslation(data);
    return translations;
  }

  @Query(() => [TranslationsResponse], {
    name: TRANSLATION_PATH_GET_ALL_BY_KEYS,
  })
  async getAllTranslationsByKey(
    @Arg("data") data: GetTranslationByKeysInput,
    @Ctx() ctx: IContextBase
  ) {
    const translationModel = new TranslationService(ctx);
    const translations = await translationModel.getAllTranslationByKeys(data);
    return translations;
  }

  @Mutation(() => [TranslationsResponse], {
    name: TRANSLATION_PATH_SET_TRANSLATION,
  })
  async setTranslation(
    @Arg("data") data: SetTranslationInput,
    @Ctx() ctx: IContextBase
  ) {
    const translationModel = new TranslationService(ctx);
    if (data.translation) {
      const translation = await translationModel.setTranslation(
        data.translation.languageId,
        data.translation.key,
        data.translation.value
      );
      return [translation];
    } else if (data.translations) {
      const result: TranslationsResponse[] = [];
      for (const translation of data.translations) {
        const translationResult = await translationModel.setTranslation(
          translation.languageId,
          translation.key,
          translation.value
        );
        result.push(translationResult);
      }
      return result;
    }

    return [];
  }

  @Mutation(() => Boolean, { name: TRANSLATION_PATH_DELETE_TRANSLATION })
  async deleteTranslation(
    @Arg("data") data: DeleteTranslationInput,
    @Ctx() ctx: IContextBase
  ) {
    const translationModel = new TranslationService(ctx);
    return await translationModel.deleteTranslation(data.key);
  }

  @Query(() => String, { name: TRANSLATION_PATH_EXPORT_TRANSLATION })
  async exportTranslations(
    @Arg("data") data: ExportTranslationInput,
    @Ctx() ctx: IContextBase
  ) {
    const translationModel = new TranslationService(ctx);
    const result = await translationModel.exportTranslations(
      data.languagesId || []
    );
    return result;
  }

  @Mutation(() => Boolean, { name: TRANSLATION_PATH_IMPORT_TRANSLATION })
  async importTranslations(
    @Arg("data") data: ImportTranslationsInput,
    @Ctx() ctx: IContextBase
  ) {
    const result = await this.importTranslationsPrivate(data, ctx);
    return result;
  }

  async importTranslationsPrivate(
    data: { file: typeof GraphQLUpload },
    ctx: IContextBase
  ) {
    const translationModel = new TranslationService(ctx);
    const file = await data.file;
    const result = await translationModel.inportTranslations(file);
    return result;
  }
}
