export class AgvNewsletterInscriptionInput {
  id!: number;
  email!: string;
  status!: string;
}

export class AgvNewsletterInscriptionFilterInput {
  email!: string;
  status!: string;
}

export class AgvNewsletterInscriptionPageInput {
  skip!: number;
  take!: number;
  descending!: boolean;
  sortBy!: string;
  filter!: AgvNewsletterInscriptionFilterInput;
}

export class AgvNewsletterInscriptionResponse {
  id!: number;
  email!: string;
  status!: string;
}

export class AgvNewsletterGetInscriptionResponse {
  inscription!: AgvNewsletterInscriptionResponse;
}

export class AgvNewsletterInscriptionsPageResponse {
  inscriptions!: AgvNewsletterInscriptionResponse[];
  count!: number;
}

export class AgvNewsletterMessageInput {
  id!: number;
  message!: string;
  title!: string;
  status!: string;
}

export class AgvNewsletterMessageFilterInput {
  title!: string;
  status!: string;
}

export class AgvNewsletterMessagePageInput {
  skip!: number;
  take!: number;
  descending!: boolean;
  sortBy!: string;
  filter!: AgvNewsletterMessageFilterInput;
}

export class AgvNewsletterMessageResponse {
  id!: number;
  title!: string;
  message!: string;
  status!: string;
}

export class AgvNewsletterMessagesPageResponse {
  messages!: AgvNewsletterMessageResponse[];
  count!: number;
}

export class AgvNewsletterGetMessagesResponse {
  message!: AgvNewsletterMessageResponse;
}
