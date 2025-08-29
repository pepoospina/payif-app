export interface CommonQuery {
  amount: number;
  ownerId?: string;
  fromId?: string;
}

export interface GetIndexedPayload {
  query: CommonQuery;
}

export interface Indexed {
  id: string;
  rank: number;
  ownerId: string;
}
