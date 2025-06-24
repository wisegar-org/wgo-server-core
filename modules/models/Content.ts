export interface IComitatoPageContent {
  comitatoMembri: string;
}

export interface ISocialMediaPageContent {
  facebook: string;
  instagram: string;
}

export interface IPageContent
  extends IComitatoPageContent,
    ISocialMediaPageContent {}
