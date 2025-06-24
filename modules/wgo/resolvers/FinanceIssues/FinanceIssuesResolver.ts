import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { FinanceIssuesService } from "../../services/Finance/FinanceIssuesService";
import { IContextBase } from "@wisegar-org/wgo-base-models";
import { FinanceIssuesPageInput } from "./FinanceIssuesInputs";
import { FinanceIssuesPageResponse } from "./FinanceIssuesResponses";

@Resolver()
export class FinanceIssuesResolver {
  @Query(() => FinanceIssuesPageResponse)
  async getFinanceIssues(
    @Arg("data") data: FinanceIssuesPageInput,
    @Ctx() ctx: IContextBase
  ) {
    const issuesService = new FinanceIssuesService(ctx);
    return await issuesService.getFinanceIssues(data);
  }
}
