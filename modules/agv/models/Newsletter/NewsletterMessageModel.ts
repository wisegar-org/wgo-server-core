import { GetEmailSenderKey, GetEmailSenderNameKey } from "wgo-settings";
import { ILike, Repository } from "typeorm";
import { AGVNewsletterInscriptionEntity } from "../../database/entities/AGVNewsletterInscriptionEntity";
import { AGVNewsletterMessageEntity } from "../../database/entities/AGVNewsletterMessageEntity";
import {
  AGVNewsletterInscriptionStatusEnum,
  AGVNewsletterMessageStatusEnum,
  IContextBase,
  INewsletterMessageInput,
  INewsletterMessageModel,
  INewsletterMessagePageInput,
} from "@wisegar-org/wgo-base-models";
import { AGVNewsletterInscriptionModel } from "./NewsletterInscriptionModel";
import { HandlebarsTemplateService } from "@wisegar-org/wgo-templating";
import { EmailService } from "../../../services/email.service";
import { getInlineStyle } from "../../../utils/email-style.utils";
import { HistoryService } from "../../../services/historic.service";

export class AGVNewsletterMessageModel {
  private repository: Repository<AGVNewsletterMessageEntity>;
  private historyModel: HistoryService<AGVNewsletterMessageEntity>;
  private WGEmailModel: EmailService;
  private inscriptionModel: AGVNewsletterInscriptionModel;
  private handlebardService: HandlebarsTemplateService;
  /**
   *
   */
  constructor(ctx: IContextBase) {
    this.repository = ctx.dataSource.getRepository(AGVNewsletterMessageEntity);
    this.historyModel = new HistoryService(AGVNewsletterMessageEntity, ctx);
    this.WGEmailModel = new EmailService(ctx);
    this.inscriptionModel = new AGVNewsletterInscriptionModel(ctx);
    this.handlebardService = new HandlebarsTemplateService();
  }

  public async getMessageById(id: number) {
    const message = await this.repository.findOne({ where: { id } });
    return message;
  }

  async getMessagePage(data: INewsletterMessagePageInput) {
    const filter: { [key: string]: any } = {};
    if (data.filter?.title) filter.title = ILike(`%${data.filter.title}%`);
    if (data.filter?.status) filter.status = data.filter.status;
    const order = data.sortBy
      ? { [data.sortBy]: data.descending ? "DESC" : "ASC" }
      : { id: "DESC" };
    const result = await this.getMessagePageByCriteria(
      filter,
      order,
      data.skip,
      data.take
    );
    return {
      messages: result[0].map((item) =>
        AGVNewsletterMessageModel.ParseMessageResponse(item)
      ),
      count: result[1],
    };
  }

  public async getMessagePageByCriteria(
    whereQuery: any,
    orderQuery: any,
    skip: number,
    take: number
  ) {
    const messages = await this.repository.findAndCount({
      where: whereQuery,
      order: orderQuery,
      skip,
      take,
    });
    return messages;
  }

  async addMessage(message: INewsletterMessageInput) {
    const messageEntity = new AGVNewsletterMessageEntity();
    messageEntity.message = message.message;
    messageEntity.title = message.title;
    messageEntity.status =
      message.status || AGVNewsletterMessageStatusEnum.Waiting;
    const result = await this.repository.manager.save(messageEntity);
    if (result) {
      await this.historyModel.createPostHistoric(result);
    }
    return !!result;
  }

  async editMessage(message: INewsletterMessageModel) {
    const messageEntity = await this.repository.findOne({
      where: {
        id: message.id,
      },
    });
    if (messageEntity) {
      messageEntity.title = message.title;
      messageEntity.message = message.message;
      messageEntity.status = message.status;

      const result = await this.repository.manager.save(messageEntity);
      if (result) await this.historyModel.createPutHistoric(result);
      return !!result;
    }

    return false;
  }

  async deleteMessage(id: number) {
    const messageEntity = await this.repository.findOne({ where: { id } });
    if (messageEntity) {
      const result = await this.repository.softDelete({ id });
      if (result.affected) {
        await this.historyModel.createDeleteHistoric(messageEntity);
        return true;
      }
    }
    return false;
  }

  async sendMessage(id: number) {
    const messageEntity = await this.repository.findOne({
      where: {
        id,
      },
    });
    if (!messageEntity) return false;
    const inscriptions = await this.inscriptionModel.getInscriptionsByCriteria({
      status: AGVNewsletterInscriptionStatusEnum.Confirmed,
    });

    const msg = await getInlineStyle(messageEntity.message);

    inscriptions.forEach(
      (inscription: AGVNewsletterInscriptionEntity, index: number) => {
        const body = this.handlebardService.getTemplateData(msg, {
          utente: {
            email: inscription.email,
          },
        });
        setTimeout(async () => {
          await this.WGEmailModel.sendEmail({
            subject: "Collettivo dell'Assemblea Genitori di Vezia",
            to: inscription.email,
            from: `<${GetEmailSenderKey()}> ${GetEmailSenderNameKey()}`,
            html: body,
          });
        }, 30 * index);
      }
    );

    if (messageEntity.status === AGVNewsletterMessageStatusEnum.Waiting) {
      messageEntity.status = AGVNewsletterMessageStatusEnum.Sended;
      await this.repository.manager.save(messageEntity);
      await this.historyModel.createPutHistoric(messageEntity);
    }

    return true;
  }

  static ParseMessageResponse(message: AGVNewsletterMessageEntity) {
    return {
      id: message.id,
      title: message.title,
      message: message.message,
      status: message.status,
    };
  }
}
