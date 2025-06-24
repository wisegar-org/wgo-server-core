import { IMediaResponse } from "@wisegar-org/wgo-base-models/build/storage";

export const AGV_ADMIN_ROLE = "admin";

export interface AgvEventResponseModel {
  id: number;
  title: string;
  description: string;
  shortDescription?: string;
  class: string;
  type: string;
  state: string;
  startDate?: Date;
  endDate?: Date;
  visible: boolean;
  enrollment: boolean;
  inscriptions: number;
  imgTitle?: IMediaResponse;
  imgList?: IMediaResponse[];
}

export interface AgvEventsPageResponseModel {
  count: number;
  events: AgvEventResponseModel[];
}

export interface AgvEventGetNextsResponseModel {
  evento?: AgvEventResponseModel;
  corso?: AgvEventResponseModel;
}

export interface AgvEventInputModel {
  id: number;
  title: string;
  description: string;
  shortDescription?: string;
  class: string;
  type: string;
  state: string;
  startDate?: Date;
  endDate?: Date;
  visible: boolean;
  enrollment: boolean;
  imgTitle?: number;
  imgList?: number[];
}

export interface AgvInscriptionInputModel {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  phone: string;
  message: string;
  class: string;
  eventId: number;
}
export interface AgvInscriptionResponseModel {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  phone: string;
  message: string;
  class: string;
  eventId?: number;
  eventTitle?: string;
  eventClass?: string;
  event?: AgvEventResponseModel;
  date: Date;
}

export interface AgvInscriptionAddModel {
  create: boolean;
  exist: boolean;
  error: boolean;
}
export interface AgvInscriptionsPageResponseModel {
  count: number;
  inscriptions: AgvInscriptionResponseModel[];
}
