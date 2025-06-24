import { DataSource } from "typeorm";
import { LANGUAGE_EN } from "@wisegar-org/wgo-base-models";
import { LanguageEntity } from "../entities/LanguageEntity";

export const languageDataSeeder = async (dataSource: DataSource) => {
  const languageRepository = dataSource.getRepository(LanguageEntity);
  const languageEntityResult = await languageRepository.findOne({
    where: { code: LANGUAGE_EN },
  });

  if (!languageEntityResult) {
    const languageEntity = new LanguageEntity();
    languageEntity.code = LANGUAGE_EN;
    languageEntity.default = true;
    languageEntity.enabled = true;

    const languageEntityCreated = await languageRepository.save(languageEntity);
    if (!!languageEntityCreated) {
      console.debug(`Language default created: ${languageEntityCreated.code}`);
    }
  }
};
