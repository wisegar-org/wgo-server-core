import { IMediaModel } from "@wisegar-org/wgo-base-models";
import { ITranslationArg } from "@wisegar-org/wgo-base-models";

export interface IIndexContentModel {
  image: IMediaModel;
}

export interface IIndexContentInput {
  imageId: number;
  translations: ITranslationArg[];
}
