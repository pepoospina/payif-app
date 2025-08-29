export interface CommonQuery {
  amount: number;
  ownerId?: string;
  fromId?: string;
}

export interface Indexed {
  id: string;
  rank: number;
  ownerId: string;
}
