import { ILike, In, MoreThanOrEqual, Not, Repository } from "typeorm";
import AGVEventEntity from "../../database/entities/AGVEventEntity";
import { AGVInscriptionEntity } from "../../database/entities/AGVInscriptionEntity";
import {
  AGVEventInput,
  AGVEventPageInput,
} from "../../resolvers/Event/AGVEventInputs";
import {
  AGVEventGetNextsResponse,
  AGVEventGetPageResponse,
  AGVEventResponse,
} from "../../resolvers/Event/AGVEventResponses";
import {
  EventStateEnum,
  EventTypeEnum,
  IContextBase,
} from "@wisegar-org/wgo-base-models";
import { HistoryService } from "../../../services/historic.service";
import { MediaService } from "../../../services/media.service";
import { MediaResponse } from "../../../resolvers/media.responses";

export class AGVEventModel {
  private eventRepository: Repository<AGVEventEntity>;
  private inscriptionRepository: Repository<AGVInscriptionEntity>;
  private mediaModel: MediaService;
  private historicModels: HistoryService<AGVEventEntity>;

  /**
   *
   */
  constructor(ctx: IContextBase) {
    this.eventRepository = ctx.dataSource.getRepository(AGVEventEntity);
    this.inscriptionRepository =
      ctx.dataSource.getRepository(AGVInscriptionEntity);
    this.mediaModel = new MediaService(ctx);
    this.historicModels = new HistoryService(AGVEventEntity, ctx);
  }

  public async getNexts(urlApi: string): Promise<AGVEventGetNextsResponse> {
    const nowDate = new Date(Date.now());
    const resultCorso = await this.eventRepository.findOne({
      where: {
        startDate: MoreThanOrEqual(nowDate),
        type: EventTypeEnum.Course,
        visible: true,
        state: Not(EventStateEnum.Cancelled),
      },
      order: {
        startDate: "ASC",
      },
    });
    const resultEvento = await this.eventRepository.findOne({
      where: {
        startDate: MoreThanOrEqual(nowDate),
        type: EventTypeEnum.Event,
        visible: true,
        state: Not(EventStateEnum.Cancelled),
      },
      order: {
        startDate: "ASC",
      },
    });

    const result = {} as AGVEventGetNextsResponse;
    if (resultCorso) {
      result.corso = await this.ParseShortEvent(resultCorso, urlApi, false);
    }
    if (resultEvento) {
      result.evento = await this.ParseShortEvent(resultEvento, urlApi, false);
    }
    return result;
  }

  public async getPage(
    data: AGVEventPageInput,
    urlApi: string
  ): Promise<AGVEventGetPageResponse> {
    const filter: { [key: string]: any } = {};
    if (data.filter.class) filter.class = data.filter.class;
    if (data.filter.enrollment) filter.enrollment = data.filter.enrollment;
    if (data.filter.state) filter.state = data.filter.state;
    if (data.filter.title) filter.title = ILike(`%${data.filter.title}%`);
    if (data.filter.type) filter.type = data.filter.type;
    if (data.filter.visible) filter.visible = data.filter.visible;

    if (data.sortBy === "inscriptions") {
      const filterByInscriptions = await this.eventRepository.findAndCount({
        where: filter,
        relations: ["inscriptions"],
      });

      const ids = filterByInscriptions[0]
        .sort((a, b) => {
          if ((a.inscriptions || []).length > (b.inscriptions || []).length)
            return data.descending ? 1 : -1;
          if ((a.inscriptions || []).length < (b.inscriptions || []).length)
            return data.descending ? -1 : 1;
          return 0;
        })
        .slice(data.skip, data.skip + data.take)
        .map((event) => event.id);

      const items = await this.eventRepository.find({
        where: {
          id: In(ids),
        },
        relations: ["inscriptions"],
      });

      const result: AGVEventResponse[] = [];
      for (const id of ids) {
        const event = items.find((itm) => itm.id === id);
        if (event) result.push(await this.ParseShortEvent(event, urlApi, true));
      }

      return {
        count: filterByInscriptions[1],
        events: result,
      };
    }

    const events = await this.eventRepository.findAndCount({
      where: filter,
      relations: ["inscriptions"],
      order: data.sortBy
        ? { [data.sortBy]: data.descending ? "DESC" : "ASC" }
        : { id: "DESC" },
      take: data.take,
      skip: data.skip,
    });

    const eventResponses: AGVEventResponse[] = [];

    for (const evnt of events[0]) {
      eventResponses.push(await this.ParseShortEvent(evnt, urlApi));
    }

    return {
      count: events[1],
      events: eventResponses,
    };
  }

  async getAllClass(type: string): Promise<string[]> {
    const result = await this.eventRepository
      .createQueryBuilder("event")
      .select("DISTINCT(event.class)", "class")
      .orderBy("event.class", "ASC")
      .where(`event.type = '${type}'`)
      .getRawMany();
    return result.map((item) => item.class);
  }

  public async all(urlApi: string): Promise<AGVEventResponse[]> {
    const events = await this.eventRepository.find({
      relations: ["imgTitle", "imgList"],
      order: { id: "DESC" },
    });

    const eventResponses: AGVEventResponse[] = [];

    for (const evnt of events) {
      const eventParse = await this.ParseEvent(evnt, urlApi);
      if (eventParse) eventResponses.push(eventParse);
    }

    return eventResponses;
  }

  public async create(agvEvent: AGVEventInput): Promise<Boolean> {
    let evnt = new AGVEventEntity();
    evnt = await this.setEventProperties(evnt, agvEvent);
    await this.historicModels.createPostHistoric(evnt);
    return !!evnt;
  }

  public async modify(agvEvent: AGVEventInput): Promise<Boolean> {
    let evnt = await this.eventRepository.findOne({
      where: { id: agvEvent.id },
    });
    if (evnt) {
      evnt = await this.setEventProperties(evnt, agvEvent);
      await this.historicModels.createPutHistoric(evnt);
    }
    return !!evnt;
  }

  private async setEventProperties(
    evnt: AGVEventEntity,
    agvEvent: AGVEventInput
  ) {
    evnt.class = agvEvent.class;
    evnt.description = agvEvent.description;
    evnt.endDate = agvEvent.endDate;
    evnt.enrollment = agvEvent.enrollment;
    evnt.shortDescription = agvEvent.shortDescription;
    evnt.startDate = agvEvent.startDate;
    evnt.state = agvEvent.state;
    evnt.title = agvEvent.title;
    evnt.type = agvEvent.type;
    evnt.visible = agvEvent.visible;

    const mediaTitle = agvEvent.imgTitle
      ? await this.mediaModel.getMediaList([agvEvent.imgTitle])
      : null;
    if (mediaTitle && mediaTitle.length > 0) {
      evnt.imgTitle = mediaTitle[0];
    }

    const mediaList = agvEvent.imgList
      ? await this.mediaModel.getMediaList(agvEvent.imgList)
      : null;
    if (mediaList) {
      evnt.imgList = mediaList;
    }

    return await this.eventRepository.manager.save(evnt);
  }

  public async getEvent(eventId: number, urlApi: string, parse = true) {
    const result = await this.eventRepository.findOne({
      where: {
        id: eventId,
      },
      relations: ["imgTitle", "imgList"],
    });

    return parse && result ? this.ParseEvent(result, urlApi, true) : result;
  }

  public async ParseShortEvent(
    evnt: AGVEventEntity,
    urlApi: string,
    loadInscriptionCount = false
  ) {
    let imgTitle = undefined;
    const imgList: MediaResponse[] = [];
    let inscriptionCount = 0;
    if (loadInscriptionCount) {
      inscriptionCount = evnt.inscriptions
        ? evnt.inscriptions.length
        : await this.inscriptionRepository.count({
            where: {
              eventId: evnt.id,
            },
          });
    }

    if (!!evnt.imgTitleId) {
      imgTitle = await this.mediaModel.getMediaShortResponse(
        evnt.imgTitleId,
        urlApi
      );
    }

    if (!!evnt.imgList) {
      evnt.imgList.forEach((img) => {
        imgList.push(this.mediaModel.getMediaResponse(img, urlApi));
      });
    }
    return {
      ...new AGVEventResponse(),
      ...evnt,
      imgTitle: imgTitle,
      imgList: imgList,
      inscriptions: inscriptionCount,
    };
  }

  public async ParseEvent(
    evnt: AGVEventEntity | undefined,
    urlApi: string,
    loadInscriptionCount = false
  ) {
    if (!evnt) return undefined;
    let imgTitle = undefined;
    const imgList: MediaResponse[] = [];
    let inscriptionCount = 0;
    if (loadInscriptionCount) {
      inscriptionCount = evnt.inscriptions
        ? evnt.inscriptions.length
        : await this.inscriptionRepository.count({
            where: {
              eventId: evnt.id,
            },
          });
    }

    if (!!evnt.imgTitle) {
      imgTitle = this.mediaModel.getMediaResponse(evnt.imgTitle, urlApi);
    }

    if (!!evnt.imgList) {
      evnt.imgList.forEach((img) => {
        imgList.push(this.mediaModel.getMediaResponse(img, urlApi));
      });
    }
    return {
      ...new AGVEventResponse(),
      ...evnt,
      imgTitle: imgTitle,
      imgList: imgList,
      inscriptions: inscriptionCount,
    };
  }
}
