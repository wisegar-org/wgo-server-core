export enum ITemType {
  Course = "Corso",
  Event = "Evento",
}

export interface IItemImg {
  id: number;
  url: string;
}

export enum ItemState {
  Waiting = "In sospeso",
  Confirmed = "Confermato",
  Cancelled = "Annullato",
}

export interface IItem {
  id: number;
  imgTitle: string;
  imgList: IItemImg[];
  title: string;
  description: string;
  shortDescription: string;
  class: string;
  type: ITemType;
  startDate: Date;
  endDate: Date;
  visible: boolean;
  enrollment: boolean;
  state: ItemState;
}

export interface IAddressItem {
  img: string;
  name: string;
  url: string;
}
