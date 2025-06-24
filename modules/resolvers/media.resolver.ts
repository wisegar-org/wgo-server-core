import { Arg, Authorized, Ctx, Query, Resolver } from "type-graphql";
import {
  MEDIA_PATH_DELETE_FILES,
  MEDIA_PATH_GET_FILE,
  IContextBase,
} from "@wisegar-org/wgo-base-models";
import { MediaService } from "../services/media.service";
import { MediaInputArg, MediasInputArg } from "./media.inputs";
import { MediaResponse } from "./media.responses";

@Resolver()
export class MediaResolver {
  async saveFilePrivate(
    data: MediaInputArg,
    urlApi: string,
    ctx: IContextBase
  ) {
    const mediaModel = new MediaService(ctx);
    return await mediaModel.saveMedia(data.file, {
      isPublic: data.isPublic,
      urlApi: urlApi,
    });
  }

  async saveFilesPrivate(
    data: MediasInputArg,
    urlApi: string,
    ctx: IContextBase
  ) {
    const result: MediaResponse[] = [];
    for (const fileItem of data.files) {
      const media = await this.saveFilePrivate(fileItem as any, urlApi, ctx);
      if (!!media) result.push(media);
    }
    return result;
  }

  @Query(() => MediaResponse, { name: MEDIA_PATH_GET_FILE })
  async getFile(@Arg("id") id: number, @Ctx() ctx: IContextBase) {
    const mediaModel = new MediaService(ctx);
    return await mediaModel.getMediaById(id);
  }

  @Authorized()
  @Query(() => Boolean, { name: MEDIA_PATH_DELETE_FILES })
  async deleteFile(@Arg("id") id: number, @Ctx() ctx: IContextBase) {
    const mediaModel = new MediaService(ctx);
    return await mediaModel.deleteMedia(id);
  }
}
