export enum Language {
  SPA = "spa",
  CAT = "cat",
  ENG = "eng",
}

export interface Translations {
  cat: string;
  spa?: string;
  eng?: string;
}

export interface Payment {
  id: string;
  token: string;
  amount: string;
  payer: string;
  receiver: string;
}

export type CreatePayment = Omit<Payment, "id">;
