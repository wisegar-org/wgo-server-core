import { IContextBase } from "@wisegar-org/wgo-base-models";
import { Ctx, Query, Resolver } from "type-graphql";
import { FinanceCollaboratorService } from "../../services/Finance/FinanceCollaboratorService";
import { FinanceLabelService } from "../../services/Finance/FinanceLabelService";
import { FinanceProjectService } from "../../services/Finance/FinanceProjectService";
import { FinanceRepositoryService } from "../../services/Finance/FinanceRepositoryService";
import {
  FinanceAssignedToOption,
  FinanceLabelOption,
  FinanceProjectOption,
  FinanceRepositoryOption,
} from "./FinanceIssuesOptionsResponses";

@Resolver()
export class FinanceIssuesOptionsResolver {
  @Query(() => [FinanceLabelOption])
  async getFinanceIssuesLabelOptions(@Ctx() ctx: IContextBase) {
    const labelService = new FinanceLabelService(ctx);
    return await labelService.getAllLabels();
  }

  @Query(() => [FinanceAssignedToOption])
  async getFinanceIssuesAssignedToOptions(@Ctx() ctx: IContextBase) {
    const collaboratorService = new FinanceCollaboratorService(ctx);
    return await collaboratorService.getAllCollaborators();
  }

  @Query(() => [FinanceProjectOption])
  async getFinanceIssuesProjectOptions(@Ctx() ctx: IContextBase) {
    const projectService = new FinanceProjectService(ctx);
    return await projectService.getAllProject();
  }

  @Query(() => [FinanceRepositoryOption])
  async getFinanceIssuesRepositoryOptions(@Ctx() ctx: IContextBase) {
    const repositoryService = new FinanceRepositoryService(ctx);
    return await repositoryService.getAllRepository();
  }
}
