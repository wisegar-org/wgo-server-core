import { UploadedFile } from "express-fileupload";
import { Connection, Repository } from "typeorm";
import { writeFileSync, existsSync, mkdirSync } from "fs-extra";
import { join, normalize, extname } from "path";
import { MediaEntityTypeEnum } from "../models/enums/media-entitytype.enum";
import MediaEntity from "../database/entities/MediaEntity";

export class MediaService {
  private connection: Connection;
  private mediaRepository: Repository<MediaEntity>;
  constructor(conn: Connection) {
    this.connection = conn;
    this.mediaRepository = this.connection.getRepository(MediaEntity);
  }

  async saveImage(uploadedFile: UploadedFile, options: { isPublic: boolean }) {
    return await this.saveMedia(
      uploadedFile,
      options,
      MediaEntityTypeEnum.image
    );
  }

  async saveDocument(
    uploadedFile: UploadedFile,
    options: { isPublic: boolean }
  ) {
    return await this.saveMedia(
      uploadedFile,
      options,
      MediaEntityTypeEnum.document
    );
  }

  async saveFile(uploadedFile: UploadedFile, options: { isPublic: boolean }) {
    return await this.saveMedia(
      uploadedFile,
      options,
      MediaEntityTypeEnum.file
    );
  }

  async saveMedia(
    uploadedFile: UploadedFile,
    options: { isPublic: boolean },
    mediaType: MediaEntityTypeEnum
  ) {
    const { name, data, md5, mimetype } = uploadedFile;
    const fileExt = extname(name);
    const fileName = `${md5}${fileExt}`;
    let mediaEntity = await this.mediaRepository.findOne({
      where: { fileName: fileName },
    });

    if (!mediaEntity) {
      mediaEntity = new MediaEntity();
      mediaEntity.fileName = fileName;
      mediaEntity.fileExt = fileExt;
      mediaEntity.mediaType = mediaType;
      mediaEntity.displayName = name;
      mediaEntity.fileContent = data;
      mediaEntity.isPublic = options.isPublic;
      mediaEntity.mimeType = mimetype;
    }

    if (options.isPublic) {
      const pathInPublic = await this.saveBufferInPublicFolder(
        fileName,
        data,
        mediaType
      );
      mediaEntity.path = `${mediaType}/${fileName}`;
    }

    mediaEntity = await this.mediaRepository.manager.save(mediaEntity);
    return mediaEntity;
  }
  async saveMediaEntity(mediaEntity: MediaEntity): Promise<MediaEntity> {
    const mediaEntityFounded = await this.mediaRepository.findOne({
      where: { fileName: mediaEntity.fileName },
    });
    if (mediaEntity.isPublic) {
      const pathInPublic = await this.saveBufferInPublicFolder(
        mediaEntity.fileName,
        mediaEntity.fileContent,
        mediaEntity.mediaType
      );
      mediaEntity.path = `${mediaEntity.mediaType}/${mediaEntity.fileName}`;
    }
    mediaEntity = await this.mediaRepository.manager.save(mediaEntity);
    return mediaEntity;
  }
  async saveMediaEntityInPublicFolder(mediaEntity: MediaEntity) {
    return await this.saveBufferInPublicFolder(
      mediaEntity.fileName,
      mediaEntity.fileContent,
      mediaEntity.mediaType
    );
  }

  private async saveBufferInPublicFolder(
    name: string,
    data: Buffer,
    path?: string | undefined
  ) {
    const publicName = "public";
    const dirname = __dirname.split("node_modules");
    const buildPath = __dirname.split("build");
    const srcPath = __dirname.split("src");
    let pathPublic = "";
    if (dirname.length > 1) {
      pathPublic = normalize(join(dirname[0], publicName));
    } else if (buildPath.length > 1) {
      pathPublic = normalize(join(buildPath[0], publicName));
    } else if (srcPath.length > 1) {
      pathPublic = normalize(join(srcPath[0], publicName));
    } else {
      throw "Media Service Error: Can't resolve public folder path";
    }
    if (!existsSync(pathPublic)) {
      mkdirSync(pathPublic);
    }

    if (path) {
      const pathInPublic = join(pathPublic, path);
      if (!existsSync(pathInPublic)) {
        mkdirSync(pathInPublic);
      }
      pathPublic = pathInPublic;
    }

    return await this.saveBufferInFolder(name, pathPublic, data);
  }

  async saveMediaEntityInFolder(
    mediaEntity: MediaEntity,
    folderPath: string,
    displayName: boolean
  ) {
    return await this.saveBufferInFolder(
      displayName ? mediaEntity.displayName : mediaEntity.fileName,
      folderPath,
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
    return await this.mediaRepository.findOne({
      where: { id: id },
    });
  }
  async getMediaByName(fileName: string): Promise<MediaEntity | null> {
    return await this.mediaRepository.findOne({
      where: { fileName: fileName },
    });
  }
  async getAllMediaByType(
    typeMedia: MediaEntityTypeEnum
  ): Promise<MediaEntity[]> {
    return await this.mediaRepository.find({
      where: { mediaType: typeMedia },
    });
  }
  async getAllMedia(): Promise<MediaEntity[]> {
    return await this.mediaRepository.find();
  }
}
