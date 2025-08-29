export enum Language {
  SPA = "spa",
  CAT = "cat",
  ENG = "eng",
}

export interface Payment {
  id: string;
  token: string;
  amount: string;
  payer: string;
  receiver: string;
}

export type CreatePayment = Omit;
