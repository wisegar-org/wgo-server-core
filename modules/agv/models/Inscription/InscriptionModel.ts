import { ILike, Repository } from "typeorm";
import AGVEventEntity from "../../database/entities/AGVEventEntity";
import { AGVInscriptionEntity } from "../../database/entities/AGVInscriptionEntity";
import {
  AGVInscriptionInput,
  AGVInscriptionPageInput,
} from "../../resolvers/Inscription/AGVInscriptionInputs";
import {
  AGVInscriptionAddResponse,
  AGVInscriptionGetPageResponse,
  AGVInscriptionResponse,
} from "../../resolvers/Inscription/AGVInscriptionResponses";
import { IContextBase } from "@wisegar-org/wgo-base-models";
import { AGVEventModel } from "../Event/EventModel";
import { HistoryService } from "../../../services/historic.service";

export class AGVInscriptionModel {
  private inscriptionRepository: Repository<AGVInscriptionEntity>;
  private eventModel: AGVEventModel;
  private historyModel: HistoryService<AGVInscriptionEntity>;

  /**
   *
   */
  constructor(ctx: IContextBase) {
    this.inscriptionRepository =
      ctx.dataSource.getRepository(AGVInscriptionEntity);
    this.eventModel = new AGVEventModel(ctx);
    this.historyModel = new HistoryService(AGVInscriptionEntity, ctx);
  }

  public async getPage(
    data: AGVInscriptionPageInput
  ): Promise<AGVInscriptionGetPageResponse> {
    const filter: { [key: string]: any } = {};
    if (data.filter.class) filter.class = data.filter.class;
    if (data.filter.email) filter.email = ILike(`%${data.filter.email}%`);
    if (data.filter.eventClass || data.filter.eventTitle) filter.event = {};
    if (data.filter.eventClass) filter.event.class = data.filter.eventClass;
    if (data.filter.eventTitle)
      filter.event.title = ILike(`%${data.filter.eventTitle}%`);
    if (data.filter.phone) filter.phone = ILike(`%${data.filter.phone}%`);

    const filters: any = [];
    const nomes = (data.filter.nome || "")
      .split(" ")
      .filter((item) => !!item)
      .map((nome) => ILike(`%${nome}%`));
    if (data.filter.nome && nomes.length > 1) {
      for (const nome of nomes) {
        filters.push({
          ...filter,
          nome: nome,
        });
        filters.push({
          ...filter,
          cognome: nome,
        });
      }

      const inscriptions = await this.inscriptionRepository.findAndCount({
        where: filters.length ? filters : {},
        relations: ["event"],
        order: data.sortBy
          ? { [data.sortBy]: data.descending ? "DESC" : "ASC" }
          : { id: "DESC" },
      });

      const inscriptionsResult = inscriptions[0].filter(
        (inscrpt) =>
          `${inscrpt.nome} ${inscrpt.cognome}`
            .toLocaleLowerCase()
            .indexOf(data.filter.nome.toLocaleLowerCase()) !== -1
      );

      const inscriptionsResponses: AGVInscriptionResponse[] = [];
      const inscriptionsResultSelected = inscriptionsResult.slice(
        data.skip,
        data.skip + data.take
      );

      for (const inscription of inscriptionsResultSelected) {
        inscriptionsResponses.push(this.parseInscription(inscription));
      }

      return {
        count: inscriptionsResult.length,
        inscriptions: inscriptionsResponses,
      };
    } else if (nomes.length === 1) {
      filters.push(
        {
          ...filter,
          nome: nomes[0],
        },
        {
          ...filter,
          cognome: nomes[0],
        }
      );
    } else {
      Object.keys(filter).length ? filters.push(filter) : null;
    }

    const inscriptions = await this.inscriptionRepository.findAndCount({
      where: filters.length ? filters : {},
      relations: ["event"],
      order: data.sortBy
        ? { [data.sortBy]: data.descending ? "DESC" : "ASC" }
        : { id: "DESC" },
      take: data.take,
      skip: data.skip,
    });

    const inscriptionsResponses: AGVInscriptionResponse[] = [];

    for (const inscription of inscriptions[0]) {
      inscriptionsResponses.push(this.parseInscription(inscription));
    }

    return {
      count: inscriptions[1],
      inscriptions: inscriptionsResponses,
    };
  }

  public async all(): Promise<AGVInscriptionResponse[]> {
    const inscriptions = await this.inscriptionRepository.find({
      relations: ["event"],
    });

    const inscriptionList: AGVInscriptionResponse[] = [];
    inscriptions.map((inscrpt) => {
      inscriptionList.push(<AGVInscriptionResponse>{
        id: inscrpt.id,
        nome: inscrpt.nome,
        cognome: inscrpt.cognome,
        email: inscrpt.email,
        phone: inscrpt.phone,
        message: inscrpt.message,
        class: inscrpt.class,
        eventId: inscrpt.event.id,
        eventTitle: inscrpt.event.title,
        eventClass: inscrpt.event.class,
        date: inscrpt.inscriptionDate,
      });
    });
    return inscriptionList;
  }

  public async allByCriteria(criteria: any) {
    const inscriptions = await this.inscriptionRepository.find({
      where: criteria,
    });

    return inscriptions;
  }

  public async create(
    agvInscription: AGVInscriptionInput
  ): Promise<AGVInscriptionAddResponse> {
    const response = new AGVInscriptionAddResponse();
    const entityResult = await this.inscriptionRepository.findOne({
      where: {
        nome: agvInscription.nome,
        cognome: agvInscription.cognome,
        email: agvInscription.email,
        phone: agvInscription.phone,
        class: agvInscription.class,
        eventId: agvInscription.eventId,
      },
    });
    if (entityResult) {
      response.exist = true;
      return response;
    }
    const inscription = new AGVInscriptionEntity();
    inscription.nome = agvInscription.nome;
    inscription.cognome = agvInscription.cognome;
    inscription.email = agvInscription.email;
    inscription.phone = agvInscription.phone;
    inscription.message = agvInscription.message;
    inscription.class = agvInscription.class;

    if (agvInscription.eventId) {
      inscription.event = (await this.eventModel.getEvent(
        agvInscription.eventId,
        "",
        false
      )) as AGVEventEntity;
    }
    const result = await this.inscriptionRepository.manager.save(inscription);
    response.create = !!result;
    response.error = !result;
    return response;
  }

  public parseInscription(inscription: AGVInscriptionEntity) {
    return <AGVInscriptionResponse>{
      id: inscription.id,
      nome: inscription.nome,
      cognome: inscription.cognome,
      email: inscription.email,
      phone: inscription.phone,
      message: inscription.message,
      class: inscription.class,
      eventId: inscription.event.id,
      eventTitle: inscription.event.title,
      eventClass: inscription.event.class,
      date: inscription.inscriptionDate,
    };
  }
}
