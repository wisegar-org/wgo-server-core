import { AGVInscriptionModel } from "../../models/Inscription/InscriptionModel";
import { IContextBase } from "@wisegar-org/wgo-base-models";
import {
  AGVInscriptionInput,
  AGVInscriptionPageInput,
} from "./AGVInscriptionInputs";
import {
  AGVInscriptionAddResponse,
  AGVInscriptionGetPageResponse,
  AGVInscriptionResponse,
} from "./AGVInscriptionResponses";
import { Resolver, Query, Ctx, Arg, Mutation } from "type-graphql";

@Resolver()
export class AGVInscriptionResolver {
  @Query(() => [AGVInscriptionResponse])
  async agvAllInscriptions(@Ctx() ctx: IContextBase) {
    const inscriptionModel = new AGVInscriptionModel(ctx);
    return await inscriptionModel.all();
  }

  @Query(() => AGVInscriptionGetPageResponse)
  async agvAllInscriptionsByPage(
    @Arg("data") data: AGVInscriptionPageInput,
    @Ctx() ctx: IContextBase
  ) {
    const inscriptionModel = new AGVInscriptionModel(ctx);
    return await inscriptionModel.getPage(data);
  }

  @Mutation(() => AGVInscriptionAddResponse)
  async agvCreateInscription(
    @Arg("data") data: AGVInscriptionInput,
    @Ctx() ctx: IContextBase
  ) {
    const inscriptionModel = new AGVInscriptionModel(ctx);
    return (await inscriptionModel.create(data)) as AGVInscriptionAddResponse;
  }

  // @Authorized(RolEntityEnum.admin)
  // @Mutation(() => Boolean)
  // async agvModifyInscription(@Arg('data') data: AGVEventInput, @Ctx() ctx: Context) {
  //   const inscriptionModel = new AGVInscriptionModel(this.connection, ctx)
  //   return await this.inscriptionModel.modify(data);
  // }
}
