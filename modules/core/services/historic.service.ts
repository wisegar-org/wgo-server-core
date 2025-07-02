import { DataSource, ObjectType, Repository } from "typeorm";
import {
  DEFAULT_EDIT_MESSAGE,
  WRONG_CONTEXT_USER,
  WRONG_CONTEXT_USER_EMAIL,
  WRONG_CONTEXT_USER_ID,
  WRONG_ENTITY_ID_UNDEFINED,
  Actions,
  IContextBase,
} from "@wisegar-org/wgo-base-models";
import { HistoryEntity } from "../database/entities/HistoryEntity";
import { WGBaseEntity } from "../database/entities/WGBaseEntity";
import { UserEntity } from "../database/entities/UserEntity";

export class HistoryService<TEntity extends WGBaseEntity> {
  private dataSource: DataSource;
  private repository: Repository<HistoryEntity>;
  private readonly type: ObjectType<TEntity>;
  private context?: IContextBase;
  /**
   *
   */
  constructor(type: ObjectType<TEntity>, context: IContextBase) {
    this.context = context;
    this.dataSource = this.context.dataSource;
    this.repository = this.dataSource.getRepository(HistoryEntity);
    this.type = type;
  }

  public async getHistoric(entityRecordId: number): Promise<HistoryEntity[]> {
    const historic = await this.repository.find({
      where: { entity: this.type.name, recordId: entityRecordId },
    });
    return historic;
  }

  public async getAllHistoric() {
    const historic = await this.repository.find({
      where: { entity: this.type.name },
    });
    return historic;
  }

  public async getAllHistoricByUser(userId: number) {
    const historic = await this.repository.find({
      where: { entity: this.type.name, userId: userId },
    });
    return historic;
  }

  public getHistoricModel(entity: TEntity) {
    if (!this.context?.user) throw WRONG_CONTEXT_USER;
    if (!this.context.user.id) throw WRONG_CONTEXT_USER_ID;
    if (!this.context.user.email) throw WRONG_CONTEXT_USER_EMAIL;

    if (!entity.id) throw WRONG_ENTITY_ID_UNDEFINED;

    const {
      user: { id, email },
    } = this.context;

    return {
      action: Actions.Unknown,
      entity: this.type.name,
      message: DEFAULT_EDIT_MESSAGE,
      recordId: entity.id,
      userId: id,
      username: email,
      snapshot: "{}",
    };
  }

  public async getHistoricPage(skip: number, take: number) {
    return await this.getHistoricPageByCriteria(
      {
        entity: this.type.name,
      },
      { id: "DESC" },
      skip,
      take
    );
  }

  public async getHistoricPageByCriteria(
    whereQuery: any,
    orderQuery: any,
    skip: number,
    take: number
  ) {
    const historic = await this.repository.findAndCount({
      where: whereQuery,
      order: orderQuery,
      skip,
      take,
    });
    return historic;
  }

  public async create(entity: HistoryEntity): Promise<HistoryEntity> {
    if (!!entity.id)
      throw `Impossibile creare una nuova entity con un id valido`;
    const result = await this.repository.insert(entity);
    if (!result.identifiers || result.identifiers.length === 0)
      throw `Non è stato possibile registrare il nuovo record!`;

    return result.raw;
  }

  public async createMany(
    historicEntities: HistoryEntity[]
  ): Promise<HistoryEntity[]> {
    if (!this.context) return [];
    const inserResult = await this.repository.insert(historicEntities);
    if (!inserResult.identifiers || inserResult.identifiers.length === 0)
      throw `Non è stato possibile registrare il nuovo record!`;

    return inserResult.raw;
  }

  public async createRegisterHistoric(
    entity: UserEntity,
    customMessage?: string
  ) {
    const historicModel = {
      action: Actions.Add,
      entity: this.type.name,
      message: !customMessage ? `Creato` : customMessage,
      recordId: entity.id,
      userId: entity.id,
      username: entity.email,
      snapshot: "{}",
    };
    return this.create(Object.assign(new HistoryEntity(), historicModel));
  }

  public async createAccessHistoric(
    entity: UserEntity,
    customMessage?: string
  ) {
    const historicModel = {
      action: Actions.Access,
      entity: this.type.name,
      message: !customMessage ? `Accesso` : customMessage,
      recordId: entity.id,
      userId: entity.id,
      username: entity.email,
      snapshot: "{}",
    };
    return this.create(Object.assign(new HistoryEntity(), historicModel));
  }

  public async createPostHistoric(entity: TEntity, customMessage?: string) {
    if (!this.context) return undefined;
    const historicModel = this.getHistoricModel(entity);

    historicModel.message = !customMessage ? `Creato` : customMessage;
    historicModel.action = Actions.Add;
    return this.create(Object.assign(new HistoryEntity(), historicModel));
  }

  public async createPutHistoric(entity: TEntity, customMessage?: string) {
    if (!this.context) return undefined;
    const historicModel = this.getHistoricModel(entity);
    historicModel.action = Actions.Update;
    historicModel.message = !customMessage ? `Modificato` : customMessage;
    return this.create(Object.assign(new HistoryEntity(), historicModel));
  }

  public async createPutManyHistoric(
    entities: TEntity[],
    customMessage?: string
  ) {
    if (!this.context) return undefined;
    const historicModels = entities.map((entity) =>
      this.getHistoricModel(entity)
    );
    for (let HistoricEntityModel of historicModels) {
      HistoricEntityModel.action = Actions.Update;
      HistoricEntityModel.message = !customMessage
        ? `Modificato da modifica massiva`
        : customMessage;
    }
    const historicEntities = historicModels.map((historicModel) =>
      Object.assign(new HistoryEntity(), historicModel)
    );
    return await this.createMany(historicEntities);
  }

  public async createDeleteHistoric(entity: TEntity, customMessage?: string) {
    if (!this.context) return undefined;
    const historicModel = this.getHistoricModel(entity);
    historicModel.action = Actions.SoftDelete;
    historicModel.message = !customMessage ? `Cancellato soft` : customMessage;
    historicModel.snapshot = JSON.stringify(entity);
    return this.create(Object.assign(new HistoryEntity(), historicModel));
  }

  public async createDeleteHardHistoric(
    entity: TEntity,
    customMessage?: string
  ) {
    if (!this.context) return undefined;
    const historicModel = this.getHistoricModel(entity);
    historicModel.action = Actions.Delete;
    historicModel.message = !customMessage ? `Cancellato` : customMessage;
    historicModel.snapshot = JSON.stringify(entity);
    return this.create(Object.assign(new HistoryEntity(), historicModel));
  }

  public async createRestoreHistoric(entity: TEntity, customMessage?: string) {
    if (!this.context) return undefined;
    const historicModel = this.getHistoricModel(entity);
    historicModel.action = Actions.Restore;
    historicModel.message = !customMessage ? `Restore` : customMessage;
    historicModel.snapshot = JSON.stringify(entity);
    return this.create(Object.assign(new HistoryEntity(), historicModel));
  }

  public async getHistoricFilters() {
    const entitiesFilter = await this.repository
      .createQueryBuilder("")
      .select("distinct entity", "entity")
      .orderBy("entity", "ASC")
      .getRawMany();
    const actionsFilter = await this.repository
      .createQueryBuilder("")
      .select("distinct action", "action")
      .orderBy("action", "ASC")
      .getRawMany();
    const usernamesFilter = await this.repository
      .createQueryBuilder("")
      .select("distinct username", "username")
      .orderBy("username", "ASC")
      .getRawMany();

    return {
      entities: entitiesFilter.map((item) => item.entity),
      actions: actionsFilter.map((item) => item.action),
      usernames: usernamesFilter.map((item) => item.username),
    };
  }

  public static ParseHistoricResponse(historicEntity: HistoryEntity) {
    return {
      action: historicEntity.action,
      creatoIl: historicEntity.creatoIl,
      id: historicEntity.id,
      message: historicEntity.message,
      modificatoIl: historicEntity.modificatoIl,
      userId: historicEntity.userId,
      username: historicEntity.username,
      snapshot: historicEntity.snapshot,
      entity: historicEntity.entity,
    };
  }
}
