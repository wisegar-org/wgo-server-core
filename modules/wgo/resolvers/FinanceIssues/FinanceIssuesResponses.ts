import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class FinanceCollaboratorResponse {
  @Field(() => Number, { nullable: false }) id!: number;
  @Field(() => String, { nullable: true }) name!: string;
  @Field(() => String, { nullable: true }) lastName!: string;
  @Field(() => String, { nullable: false }) login!: string;
  @Field(() => String, { nullable: false }) email!: string;
}

@ObjectType()
export class FinanceProjectResponse {
  @Field(() => Number, { nullable: false }) id!: number;
}

@ObjectType()
export class FinanceRepositoryResponse {
  @Field(() => Number, { nullable: false }) id!: number;
}

@ObjectType()
export class FinanceAccountResponse {
  @Field(() => Number, { nullable: false }) id!: number;
}

@ObjectType()
export class FinanceIssuesResponse {
  @Field(() => Number, { nullable: false }) id!: number;
  @Field(() => String, { nullable: false }) owner!: string;
  @Field(() => String, { nullable: false }) repo!: string;
  @Field(() => String, { nullable: false }) title!: string;
  @Field(() => String, { nullable: false }) status!: string;
  @Field(() => Number, { nullable: false }) hours!: number;
  @Field(() => String, { nullable: false }) labels!: string;
  @Field(() => String, { nullable: false }) milestones!: string;
  @Field(() => String, { nullable: true }) last_comment!: string;
  @Field(() => Date, { nullable: false }) created_at!: Date;
  @Field(() => Date, { nullable: false }) closed_at!: Date;
  @Field(() => Date, { nullable: false }) updated_at!: Date;
  @Field(() => Number, { nullable: false }) number!: number;
  @Field(() => String, { nullable: false }) description!: string;
  @Field(() => String, { nullable: false }) url!: string;
  @Field(() => Number, { nullable: true }) assignedToId!: number;
  @Field(() => FinanceCollaboratorResponse, { nullable: true })
  assignedTo!: FinanceCollaboratorResponse;
  @Field(() => Number, { nullable: true }) projectId!: number;
  @Field(() => FinanceProjectResponse, { nullable: true })
  project!: FinanceProjectResponse;
  @Field(() => Number, { nullable: false }) repositoryId!: number;
  @Field(() => FinanceRepositoryResponse, { nullable: false })
  repository!: FinanceRepositoryResponse;
  @Field(() => Number, { nullable: true }) accountId!: number;
  @Field(() => FinanceAccountResponse, { nullable: true })
  account!: FinanceAccountResponse;
}

@ObjectType()
export class FinanceIssuesPageResponse {
  @Field(() => Number) issuesCount!: number;
  @Field(() => [FinanceIssuesResponse]) issues!: FinanceIssuesResponse[];
}
