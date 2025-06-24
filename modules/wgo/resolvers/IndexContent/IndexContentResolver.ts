import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { IIndexContentInput } from "../../models/IndexContent";
import { IndexContentService } from "../../services/IndexContentService";
import { IContextBase } from "@wisegar-org/wgo-base-models";
import { IndexContentInputs } from "./IndexContentInputs";
import { IndexContentResponse } from "./IndexContentResponses";

@Resolver()
export class IndexContentResolver {
  @Query(() => IndexContentResponse)
  async getIndexContent(
    @Arg("urlApi") urlApi: string,
    @Ctx() ctx: IContextBase
  ) {
    const indexContent = new IndexContentService(ctx);
    return await indexContent.getFinanceIndexContent(urlApi);
  }

  @Mutation(() => Boolean)
  async setIndexContent(
    @Arg("data") data: IndexContentInputs,
    @Ctx() ctx: IContextBase
  ) {
    const indexContent = new IndexContentService(ctx);
    return await indexContent.setFinanceIndexContent(
      data as IIndexContentInput
    );
  }
}
