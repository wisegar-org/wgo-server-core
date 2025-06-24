import { AGVNewsletterInscriptionModel } from "../../models/Newsletter/NewsletterInscriptionModel";
import { AGVNewsletterMessageModel } from "../../models/Newsletter/NewsletterMessageModel";
import { IContextBase } from "@wisegar-org/wgo-base-models";
import {
  AGVNewsletterInscriptionInput,
  AGVNewsletterInscriptionPageInput,
  AGVNewsletterInscriptionSendEmailStatusInput,
} from "./AGVNewsletterInscriptionInputs";
import {
  AGVNewsletterGetInscriptionResponse,
  AGVNewsletterInscriptionsPageResponse,
} from "./AGVNewsletterInscriptionResponses";
import {
  AGVNewsletterMessageInput,
  AGVNewsletterMessagePageInput,
} from "./AGVNewsletterMessageInputs";
import {
  AGVNewsletterGetMessagesResponse,
  AGVNewsletterMessagesPageResponse,
} from "./AGVNewsletterMessageResponses";
import { Resolver, Query, Arg, Ctx, Mutation } from "type-graphql";

@Resolver()
export class AGVNewsletterResolver {
  //** Inscriptions */
  @Query(() => AGVNewsletterGetInscriptionResponse)
  async agvGetNewsletterInscriptionByEmail(
    @Arg("email") email: string,
    @Ctx() ctx: IContextBase
  ) {
    const inscriptionModel = new AGVNewsletterInscriptionModel(ctx);
    const result = await inscriptionModel.getInscriptionByEmail(email);
    return {
      inscription: result
        ? AGVNewsletterInscriptionModel.ParseInscriptionResponse(result)
        : undefined,
    };
  }

  @Query(() => AGVNewsletterInscriptionsPageResponse)
  async agvGetNewsletterInscriptionsPage(
    @Arg("data") data: AGVNewsletterInscriptionPageInput,
    @Ctx() ctx: IContextBase
  ) {
    const inscriptionModel = new AGVNewsletterInscriptionModel(ctx);
    const result = await inscriptionModel.getInscriptionPage(data);
    return result;
  }

  @Mutation(() => Boolean)
  async agvPostNewsletterInscription(
    @Arg("data") data: AGVNewsletterInscriptionInput,
    @Ctx() ctx: IContextBase
  ) {
    const inscriptionModel = new AGVNewsletterInscriptionModel(ctx);
    const result = await inscriptionModel.addInscription(data as any);
    return result;
  }

  @Mutation(() => Boolean)
  async agvPutNewsletterInscription(
    @Arg("data") data: AGVNewsletterInscriptionInput,
    @Ctx() ctx: IContextBase
  ) {
    const inscriptionModel = new AGVNewsletterInscriptionModel(ctx);
    const result = await inscriptionModel.editInscription(data as any);
    return result;
  }

  @Mutation(() => Boolean)
  async agvZyncNewsletterInscriptions(@Ctx() ctx: IContextBase) {
    const inscriptionModel = new AGVNewsletterInscriptionModel(ctx);
    const result = await inscriptionModel.zyncInscriptions();
    return result;
  }

  @Query(() => Boolean)
  async agvGetNewsletterInscriptionsResendStatus(
    @Arg("data") data: AGVNewsletterInscriptionSendEmailStatusInput,
    @Ctx() ctx: IContextBase
  ) {
    const inscriptionModel = new AGVNewsletterInscriptionModel(ctx);
    const result = await inscriptionModel.resendStatusInscription(data.emails);
    return result;
  }

  //** Messages */
  @Query(() => AGVNewsletterGetMessagesResponse)
  async agvGetNewsletterMessageById(
    @Arg("id") id: number,
    @Ctx() ctx: IContextBase
  ) {
    const messageModel = new AGVNewsletterMessageModel(ctx);
    const result = await messageModel.getMessageById(id);
    return {
      message: result
        ? AGVNewsletterMessageModel.ParseMessageResponse(result)
        : undefined,
    };
  }

  @Query(() => AGVNewsletterMessagesPageResponse)
  async agvGetNewsletterMessagesPage(
    @Arg("data") data: AGVNewsletterMessagePageInput,
    @Ctx() ctx: IContextBase
  ) {
    const messageModel = new AGVNewsletterMessageModel(ctx);
    const result = await messageModel.getMessagePage(data);
    return result;
  }

  @Mutation(() => Boolean)
  async agvPostNewsletterMessage(
    @Arg("data") data: AGVNewsletterMessageInput,
    @Ctx() ctx: IContextBase
  ) {
    const messageModel = new AGVNewsletterMessageModel(ctx);
    const result = await messageModel.addMessage(data as any);
    return result;
  }

  @Mutation(() => Boolean)
  async agvPutNewsletterMessage(
    @Arg("data") data: AGVNewsletterMessageInput,
    @Ctx() ctx: IContextBase
  ) {
    const messageModel = new AGVNewsletterMessageModel(ctx);
    const result = await messageModel.editMessage(data as any);
    return result;
  }

  @Mutation(() => Boolean)
  async agvDeleteNewsletterMessage(
    @Arg("id") id: number,
    @Ctx() ctx: IContextBase
  ) {
    const messageModel = new AGVNewsletterMessageModel(ctx);
    const result = await messageModel.deleteMessage(id);
    return result;
  }

  @Mutation(() => Boolean)
  async agvSendNewsletterMessage(
    @Arg("id") id: number,
    @Ctx() ctx: IContextBase
  ) {
    const messageModel = new AGVNewsletterMessageModel(ctx);
    const result = await messageModel.sendMessage(id);
    return result;
  }
}
