import {
  AUTH_PATH_CLEAR_LOCAL_STORAGE,
  AUTH_PATH_GET_LOCAL_STORAGE,
  AUTH_PATH_SET_KEY_LOCAL_STORAGE,
  IContextBase,
} from "@wisegar-org/wgo-base-models";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { CoreService } from "../core/services/CoreService";
import { LocalStorageResponse } from "./core.responses";

@Resolver()
export class CoreResolver {
  /**
   *
   */
  constructor() {}
  @Query(() => String)
  async serverVersion(@Ctx() ctx: IContextBase) {
    const apiService = new CoreService(ctx);
    return apiService.getApiVersion();
  }

  @Query(() => LocalStorageResponse, { name: AUTH_PATH_GET_LOCAL_STORAGE })
  async getLocalStorage(@Ctx() ctx: IContextBase) {
    const apiService = new CoreService(ctx);
    console.log(ctx);
    return {
      storage: apiService.getLocalStorage(`${ctx.user?.id || 0}`),
    } as LocalStorageResponse;
  }

  @Mutation(() => Boolean, { name: AUTH_PATH_SET_KEY_LOCAL_STORAGE })
  async setKeyLocalStorage(
    @Arg("key") key: string,
    @Arg("value") value: string,
    @Ctx() ctx: IContextBase
  ) {
    const apiService = new CoreService(ctx);
    console.log(ctx);
    return apiService.setKeyLocalStorage(
      `${ctx.user?.id || 0}` || "0",
      key,
      value
    );
  }

  @Mutation(() => Boolean, { name: AUTH_PATH_CLEAR_LOCAL_STORAGE })
  async clearLocalStorage(@Ctx() ctx: IContextBase) {
    const apiService = new CoreService(ctx);
    console.log(ctx);
    return apiService.cleanLocalStorage(`${ctx.user?.id || 0}` || "0");
  }
}
