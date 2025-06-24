import { IContextBase } from "@wisegar-org/wgo-base-models";
import { MediaService } from "../../services/media.service";

export const mediaPublicSeeder = async (ctx: IContextBase) => {
  const mediaModel = new MediaService(ctx);
  await mediaModel.saveAllPublicMediaOnFiles();
};
