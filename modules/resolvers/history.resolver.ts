import { Arg, Authorized, Ctx, Query, Resolver } from "type-graphql";
import {
  HISTORIC_PATH_GET_FILTERS,
  HISTORIC_PATH_GET_PAGE,
  IContextBase,
} from "@wisegar-org/wgo-base-models";
import { HistoricPageInput } from "./history.inputs";
import {
  HistoricFiltersResponse,
  HistoricPageResponse,
} from "./history.responses";
import { HistoryEntity } from "../database/entities/HistoryEntity";
import { HistoryService } from "../services/historic.service";

@Resolver()
export class HistoricResolver {
  @Authorized()
  @Query(() => HistoricPageResponse, { name: HISTORIC_PATH_GET_PAGE })
  async getHistoricPage(
    @Arg("data") data: HistoricPageInput,
    @Ctx() ctx: IContextBase
  ) {
    const historyService = new HistoryService(HistoryEntity, ctx);
    const filter: { [key: string]: string } = {};
    if (data.filter?.action) filter.action = data.filter.action;
    if (data.filter?.entity) filter.entity = data.filter.entity;
    if (data.filter?.username) filter.username = data.filter.username;

    const order = data.sortBy
      ? { [data.sortBy]: data.descending ? "DESC" : "ASC" }
      : { id: "DESC" };

    const histories = await historyService.getHistoricPageByCriteria(
      filter,
      order,
      data.skip,
      data.take
    );
    return {
      histories: histories[0].map((history) =>
        HistoryService.ParseHistoricResponse(history)
      ),
      count: histories[1],
    };
  }

  @Authorized()
  @Query(() => HistoricFiltersResponse, { name: HISTORIC_PATH_GET_FILTERS })
  async getHistoricFilters(@Ctx() ctx: IContextBase) {
    const historyService = new HistoryService(HistoryEntity, ctx);
    const filters = await historyService.getHistoricFilters();
    return filters;
  }
}
