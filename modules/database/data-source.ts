import { DataSource, DataSourceOptions } from "typeorm";
import {
  GetDBHostKey,
  GetDBNameKey,
  GetDBPasswordKey,
  GetDBPortKey,
  GetDBUserNameKey,
} from "wgo-settings";

import { RoleEntity } from "./entities/RoleEntity";
import SettingsEntity from "./entities/SettingsEntity";
import StorageEntity from "./entities/StorageEntity";
import { SchemaUpdate1738946546572 } from "./migrations/1738946546572-schema-update";
import { LanguageEntity } from "./entities/LanguageEntity";
import { TranslationEntity } from "./entities/TranslationEntity";
import { HistoryEntity } from "./entities/HistoryEntity";
import MediaEntity from "./entities/MediaEntity";
import { UserEntity } from "./entities/UserEntity";

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: GetDBHostKey() || "localhost",
  port: parseInt(`${GetDBPortKey() || 5432}`),
  username: GetDBUserNameKey() || "postgres",
  password: GetDBPasswordKey() || "postgres",
  database: GetDBNameKey() || "wgo-project",
  useUTC: true,
  migrationsRun: true,
  synchronize: false,
  entities: [
    UserEntity,
    RoleEntity,
    LanguageEntity,
    TranslationEntity,
    SettingsEntity,
    HistoryEntity,
    MediaEntity,
    StorageEntity,
  ],
  migrations: [SchemaUpdate1738946546572],
  subscribers: [],
  dropSchema: false,
  logging: false,
  logger: "file",
};

export const PostgresDataSource = new DataSource(dataSourceOptions);
