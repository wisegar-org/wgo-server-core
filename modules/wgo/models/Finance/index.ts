import { IHandlerSettings } from "@wisegar-org/wgo-base-models";

export interface IFinanceCollaboratorModel {
  id: number;
  id_github: number;
  name: string;
  login: string;
  node_id: string;
  type: string;
  avatar_url: string;
  url: string;
  location: string;
  email: string;
  bio: string;
  isCollaborator: boolean;
  card_number?: string;
  pay_by_hours?: number;
  address?: string;
  cap?: string;
  place?: string;
  issues?: IFinanceIssuesModel[];
  accounts?: IFinanceAccountModel[];
}

export interface IFinanceProjectModel {
  id: number;
  title: string;
  issues?: IFinanceIssuesModel[];
  accounts?: IFinanceAccountModel[];
}

export interface IFinanceRepositoryModel {
  id: number;
  title: string;
  issues?: IFinanceIssuesModel[];
  accounts?: IFinanceAccountModel[];
}

export enum AccountingStatus {
  Pending = 1,
  Confirmed = 2,
  Cancelled = 3,
}

export interface IFinanceAccountModel {
  id: number;
  date: Date;
  initDate: Date;
  endDate: Date;
  total_hours: number;
  total_projects: number;
  total_issues: number;
  total_repos: number;
  pay_by_hours: number;
  pay_to_internet: number;
  internet_cost: number;
  taxes: number;
  details: string;
  payment_comment: string;
  payment_code: string;
  status: AccountingStatus;
  value: number;
  contributorId: number;
  contributor: IFinanceCollaboratorModel;
  issues?: IFinanceIssuesModel[];
  projects?: IFinanceProjectModel[];
  repos?: IFinanceRepositoryModel[];
}

export interface IFinanceIssuesModel {
  id: number;
  owner: string;
  repo: string;
  title: string;
  status: string;
  hours: number;
  labels: string;
  milestones: string;
  last_comment?: string;
  created_at: Date;
  closed_at: Date;
  updated_at: Date;
  number: number;
  description: string;
  url: string;
  assignedToId?: number;
  assignedTo: IFinanceCollaboratorModel;
  projectId: number;
  project: IFinanceProjectModel;
  repositoryId: number;
  repository: IFinanceRepositoryModel;
  accountId: number | null;
  account: IFinanceAccountModel | null;
}

export interface IFinanceIssuesFilter {
  project: number;
  repository: string;
  assignedTo: string;
  labels: string;
  minDate: string;
  maxDate: string;
  status: number;
}

export interface IFinanceIssuesPageInput {
  skip: number;
  take: number;
  filter: IFinanceIssuesFilter;
  sortBy: string;
  descending: boolean;
}

export interface IFinanceIssuesPageModel {
  issuesCount: number;
  issues: IFinanceIssuesModel[];
}

export interface IFinanceOrganizationModel {
  name: string;
  description: string;
  address: string;
  phone: string;
  cap: number;
  no: string;
  place: string;
  email: string;
  web: string;
  accountingInternetPrice: number;
  accountingUnit: string;
  accountingCoin: string;
  accountingLabel: string;
  bankName: string;
  bankBIC: string;
  bankIBAN: string;
  bankNo: string;
  banCap: string;
  bankPlace: string;
  bankAddress: string;
  bankValidDays: number;
}

export interface FinanceOrganizationSettings {
  FINANCE_ORGANIZATION_NAME: string;
  FINANCE_ORGANIZATION_DESCRIPTION: string;
  FINANCE_ORGANIZATION_ADDRESS: string;
  FINANCE_ORGANIZATION_PLACE: string;
  FINANCE_ORGANIZATION_NO: string;
  FINANCE_ORGANIZATION_CAP: number;
  FINANCE_ORGANIZATION_PHONE: string;
  FINANCE_ORGANIZATION_EMAIL: string;
  FINANCE_ORGANIZATION_WEB: string;
  FINANCE_ACCOUNTING_UNIT: string;
  FINANCE_ACCOUNTING_COIN: string;
  FINANCE_ACCOUNTING_LABEL: string;
  FINANCE_BANCK_NAME: string;
  FINANCE_BANCK_BIC: string;
  FINANCE_BANCK_IBAN: string;
  FINANCE_BANCK_NO: string;
  FINANCE_BANCK_CAP: string;
  FINANCE_BANCK_PLACE: string;
  FINANCE_BANCK_ADDRESS: string;
  FINANCE_BANCK_VALID_DAYS: number;
  FINANCE_ISSUES_ZINC_TIME: number;
  FINANCE_ISSUES_TOKEN: string;
}

export const FinanceIssuesZincTime: IHandlerSettings = {
  event: "zincIssuesTime",
  keyListeners: ["FINANCE_ISSUES_ZINC_TIME"],
};

export const FinanceIssuesToken: IHandlerSettings = {
  event: "zincIssuesToken",
  keyListeners: ["FINANCE_ISSUES_TOKEN", "FINANCE_ACCOUNTING_LABEL"],
};

export const WRONG_TOKEN = "WGO_SETTINGS_WRONG_EMPTY_TOKEN";

export const serverFinanceTranslations = [WRONG_TOKEN];
