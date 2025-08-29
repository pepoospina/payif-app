// persistWithIndexedDB.ts
import {
  PersistedClient,
  Persister,
} from "@tanstack/query-persist-client-core";
import { get, set, del } from "idb-keyval";

export function createIDBPersister(
  idbValidKey: IDBValidKey = "reactQueryCache"
) {
  return {
    persistClient: async (client: PersistedClient) => {
      await set(idbValidKey, client);
    },
    restoreClient: async () => {
      return await get<PersistedClient>(idbValidKey);
    },
    removeClient: async () => {
      await del(idbValidKey);
    },
  } as Persister;
}
