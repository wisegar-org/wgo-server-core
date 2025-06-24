import { DataSource, Repository } from "typeorm";
import { writeFileSync, existsSync, mkdirSync, unlinkSync } from "fs-extra";
import { join, normalize, extname } from "path";
import { v4 as uuidv4 } from "uuid";
import { MediaResponse } from "../resolvers/media.responses";
import { UtilService } from "../core/services/UtilService";
import {
  MEDIA_FILES_PATH,
  IContextBase,
  IMediaModel,
} from "@wisegar-org/wgo-base-models";
import MediaEntity from "../database/entities/MediaEntity";
import { HistoryService } from "./historic.service";

export class MediaService {
  private ctx: IContextBase;
  private dataSource: DataSource;
  private web_root: string;
  private mediaRepository: Repository<MediaEntity>;
  private historicModel: HistoryService<MediaEntity>;
  constructor(ctx: IContextBase) {
    this.ctx = ctx;
    this.dataSource = ctx.dataSource;
    this.mediaRepository = this.dataSource.getRepository(MediaEntity);
    this.web_root = ctx.web_root;
    this.historicModel = new HistoryService(MediaEntity, ctx);
  }

  async saveMedia(
    uploadedFile: Promise<any>,
    options: { isPublic: boolean; urlApi: string }
  ) {
    const fileInput = await uploadedFile;
    const { createReadStream, filename, mimetype, encoding } = fileInput as any;
    const stream: any = createReadStream();
    const fileContent = (await UtilService.readStreamData(stream)) as Buffer;
    const fileExt = extname(filename);
    const fileName = `${uuidv4()}${fileExt}`;
    let mediaEntity = await this.mediaRepository.findOne({
      where: {
        fileName: fileName,
      },
    });
    const existMedia = !!mediaEntity;

    if (!mediaEntity) {
      mediaEntity = new MediaEntity();
      mediaEntity.fileName = fileName;
      mediaEntity.fileExt = fileExt;
      mediaEntity.displayName = filename;
      mediaEntity.fileContent = fileContent;
      mediaEntity.isPublic = options.isPublic;
      mediaEntity.mimeType = mimetype;
    }

    if (options.isPublic) {
      const pathInPublic = await this.saveBufferInPublicFolder(
        fileName,
        fileContent,
        MEDIA_FILES_PATH
      );
    }

    mediaEntity = await this.mediaRepository.manager.save(mediaEntity);
    (await existMedia)
      ? this.historicModel.createPutHistoric(mediaEntity)
      : this.historicModel.createPostHistoric(mediaEntity);
    return this.getMediaResponse(mediaEntity, options.urlApi);
  }
  async saveMediaEntity(mediaEntity: MediaEntity): Promise<MediaEntity> {
    if (mediaEntity.isPublic) {
      const pathInPublic = await this.saveBufferInPublicFolder(
        mediaEntity.fileName,
        mediaEntity.fileContent,
        MEDIA_FILES_PATH
      );
    }
    const mediaResult = await this.mediaRepository.manager.save(mediaEntity);
    (await mediaEntity.id)
      ? this.historicModel.createPutHistoric(mediaResult)
      : this.historicModel.createPostHistoric(mediaResult);
    return mediaResult;
  }

  async saveMediaEntityInPublicFolder(mediaEntity: MediaEntity) {
    return await this.saveBufferInPublicFolder(
      mediaEntity.fileName,
      mediaEntity.fileContent,
      MEDIA_FILES_PATH
    );
  }

  private async saveBufferInPublicFolder(
    name: string,
    data: Buffer,
    path?: string | undefined
  ) {
    const publicPath = this.getPublicPath(path || "");
    return await this.saveBufferInFolder(name, publicPath, data);
  }

  async saveMediaEntityInFolder(
    mediaEntity: MediaEntity,
    folderPath: string,
    displayName: boolean
  ) {
    return await this.saveBufferInFolder(
      displayName ? mediaEntity.displayName : mediaEntity.fileName,
      this.getPublicPath(folderPath),
      mediaEntity.fileContent
    );
  }

  private async saveBufferInFolder(
    nameFile: string,
    pathFolder: string,
    data: Buffer
  ) {
    const namePath = normalize(join(pathFolder, nameFile));
    if (!existsSync(namePath)) {
      writeFileSync(namePath, data);
    }
    return namePath;
  }

  async getMediaById(id: number): Promise<MediaEntity | null> {
    return await this.mediaRepository.findOne({ where: { id } });
  }

  async getMediaByName(fileName: string): Promise<MediaEntity | null> {
    return await this.mediaRepository.findOne({
      where: {
        fileName,
      },
    });
  }

  async getAllMediaByType(fileExt: string): Promise<MediaEntity[]> {
    return await this.mediaRepository.find({
      where: {
        fileExt: fileExt,
      },
    });
  }

  async getAllMedia(): Promise<MediaEntity[]> {
    return await this.mediaRepository.find();
  }

  getRelativeFileUrl(isPublic: boolean, filename: string) {
    if (!isPublic) return "";
    return `${MEDIA_FILES_PATH}/${filename}`;
  }

  async getMediaShortResponse(id: number, urlApi: string) {
    const media = await this.mediaRepository
      .createQueryBuilder("media")
      .where(`media.id = ${id}`)
      .select("media.isPublic", "isPublic")
      .addSelect("media.fileName", "fileName")
      .getRawOne();
    const publicPath = media.isPublic
      ? this.getPublicPath(MEDIA_FILES_PATH)
      : "";
    const filePath = join(publicPath, media.fileName);
    if (filePath && !existsSync(filePath)) {
      const mediaEntity = await this.mediaRepository.findOne({
        where: {
          id,
        },
      });
      return mediaEntity
        ? await this.getMediaResponse(mediaEntity, urlApi, false)
        : undefined;
    }

    return <MediaResponse>{
      isPublic: media.isPublic,
      id,
      url: `${urlApi}/${this.getRelativeFileUrl(
        media.isPublic,
        media.fileName
      )}`,
    };
  }

  getMediaResponse(media: MediaEntity, urlApi: string, replace = false) {
    let path = ``;
    if (media.isPublic)
      this.saveMediaEntityInFolder(media, MEDIA_FILES_PATH, false);
    return {
      isPublic: media.isPublic,
      id: media.id,
      mimeType: media.mimeType,
      displayName: media.displayName,
      url: `${urlApi}/${this.getRelativeFileUrl(
        media.isPublic,
        media.fileName
      )}`,
    } as IMediaModel;
  }

  async getMediaList(listId: number[]) {
    const result: MediaEntity[] = [];
    await Promise.all(
      listId.map(async (id) => {
        const media = await this.mediaRepository.findOne({ where: { id } });
        if (media) {
          result.push(media);
        }
      })
    );
    return result;
  }

  async getFile(id: number) {
    const media = await this.getMediaById(id);
    if (!media) return false;
    return {
      isPublic: media.isPublic,
      id: media.id,
      displayName: media.displayName,
      mimeType: media.mimeType,
      data: media.fileContent.toString("base64"),
    } as IMediaModel;
  }

  private getPublicPath(path: string) {
    const publicName = "public";
    let publicPath = join(this.web_root, publicName);
    if (!existsSync(publicPath)) {
      mkdirSync(publicPath);
    }

    if (path) {
      const pathInPublic = join(publicPath, path);
      if (!existsSync(pathInPublic)) {
        mkdirSync(pathInPublic);
      }
      publicPath = pathInPublic;
    }

    return publicPath;
  }

  async deleteMedia(id: number) {
    const media = await this.getMediaById(id);
    if (!media) return false;
    if (media.isPublic) {
      const path = this.getPublicPath(MEDIA_FILES_PATH);
      const filePath = join(path, media.fileName);
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
    }

    await this.historicModel.createDeleteHardHistoric(media);
    await this.mediaRepository.remove(media);
    return true;
  }

  async saveAllPublicMediaOnFiles() {
    const medias = await this.mediaRepository.find({
      where: {
        isPublic: true,
      },
    });

    for (const media of medias) {
      await this.saveMediaEntityInPublicFolder(media);
    }
  }
}
