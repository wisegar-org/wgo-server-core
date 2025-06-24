export enum AGVNewsletterInscriptionStatusEnum {
  Waiting = "In sospeso",
  Confirmed = "Confermato",
  Cancelled = "Annullato",
}

export enum AGVNewsletterMessageStatusEnum {
  Waiting = "In sospeso",
  Sended = "Inviato",
}

export interface AGVNewsletterInscriptionModel {
  id: number;
  email: string;
  status: AGVNewsletterInscriptionStatusEnum;
}

export interface AGVNewsletterMessageModel {
  id: number;
  title: string;
  message: string;
  status?: string;
}
