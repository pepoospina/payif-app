import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";

import { FUNCTIONS_BASE } from "../app/config";
import { DefinedIfTrue } from "../shared/types/types.user";
import { useAuth } from "@clerk/clerk-react";
import {
  QueriesOptions,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { GetProductPayload } from "../shared/types/types.fetch";
import { ProductInDB, ProductFull } from "../shared/types/types.payments";
import { Order } from "../shared/types/types.payments";
import { useAccountContext } from "../user-login/contexts/AccountContext";

// Add type declaration for Clerk on window object
declare global {
  interface Window {
    Clerk?: {
      publishableKey?: string;
    };
  }
}

const DEBUG = true;

export interface AppFetch {
  post<T = unknown, R = AxiosResponse["data"], D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise;
}

export const _appFetch = async <
  T = unknown,
  D = unknown,
  S extends boolean = true,
>(
  path: string,
  payload?: D,
  shouldThrow?: S,
  accessToken?: string | null
): Promise => {
  try {
    const headers: AxiosRequestConfig["headers"] = {};

    if (accessToken) {
      headers["authorization"] = `Bearer ${accessToken}`;
    }

    const res = await axios.post<{ data: T }>(
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      FUNCTIONS_BASE + path,
      payload || {},
      {
        headers,
      }
    );

    if (DEBUG)
      console.log(`appFetch: ${path}`, { payload, data: res.data.data });

    if (shouldThrow) {
      if (!res.data.data) {
        throw new Error(`Error fetching ${path} - no data`);
      }
    }

    return res.data.data as DefinedIfTrue;
  } catch (e) {
    console.error(e);
    if (e instanceof Error) {
      const axiosError = e as { response?: { data?: { error?: string } } };
      const errorMessage = axiosError.response?.data?.error ?? "Unknown error";
      throw new Error(`Error fetching ${path} - ${errorMessage}`);
    }

    throw new Error(`Error fetching ${path} - Unknown error`);
  }
};

export const useAppFetch = () => {
  const { getToken } = useAuth();

  const appFetch = useCallback(
    async <T, D = unknown, S extends boolean = true>(
      path: string,
      data?: D,
      shouldThrow?: S,
      auth = false
    ) => {
      const token = await getToken();
      const publishableKey = window.Clerk?.publishableKey;

      if (DEBUG) {
        console.log("appFetch", { path, data, token, publishableKey });
      }

      if (auth && !token) {
        throw new Error("No token available");
      }

      return _appFetch<T, D, S>(path, data, shouldThrow, token);
    },
    [getToken]
  );

  return appFetch;
};

interface ProductQueryBase<T> {
  queryKey: (string | boolean | undefined)[];
  staleTime: number;
  enabled: boolean;
  queryFn: () => Promise;
}

export function getProductQueryKey(
  id?: string,
  includeRecipe?: boolean
): (string | boolean | undefined)[] {
  return ["product", id, includeRecipe];
}

function getProductQuery(
  id?: string,
  getToken?: () => Promise,
  includeRecipe?: false
): ProductQueryBase;
function getProductQuery(
  id?: string,
  getToken?: () => Promise,
  includeRecipe?: true
): ProductQueryBase;
function getProductQuery(
  id?: string,
  getToken?: () => Promise,
  includeRecipe?: boolean
) {
  return {
    queryKey: getProductQueryKey(id, includeRecipe),
    queryFn: async () => {
      const token = await getToken?.();

      if (!id) {
        return null;
      }

      if (includeRecipe) {
        const product = await _appFetch<ProductFull, GetProductPayload, false>(
          "/products/get",
          { id, includeRecipe },
          false,
          token
        );

        if (DEBUG) console.log("getProductQuery", { product });

        return product;
      } else {
        const product = await _appFetch<ProductInDB, GetProductPayload, false>(
          "/products/get",
          { id, includeRecipe },
          false,
          token
        );

        if (DEBUG) console.log("getProductQuery", { product });

        return product;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id,
  };
}

export const useProductFetch = (id?: string) => {
  const { getToken } = useAuth();
  return useQuery(getProductQuery(id, getToken, true));
};

/** from a bunch of ids, derive the query keys to trigger a tanquery for each */
export const useProductsFetch = (_ids?: string[]) => {
  const { getToken } = useAuth();
  const ids = _ids || [];

  const [queries, setQueries] = useState<QueriesOptions>([]);

  useEffect(() => {
    // Derive current keys from existing queries' queryKey and compare using getProductQueryKey(id, false)
    const currentKeys = new Set(
      queries
        .map((q) => JSON.stringify(q.queryKey))
        .filter((v): v is string => typeof v === "string" && v.length > 0)
    );

    const newKeys = new Set(
      ids.map((id) => JSON.stringify(getProductQueryKey(id, undefined)))
    );

    // Check if the sets are different (different keys or different sizes)
    const keysAreDifferent =
      currentKeys.size !== newKeys.size ||
      Array.from(newKeys).some((key) => !currentKeys.has(key));

    if (keysAreDifferent) {
      const newQueries = ids.map((id) => getProductQuery(id, getToken));
      setQueries(newQueries);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids]);

  const options = useMemo(() => {
    return {
      queries,
      combine: (results: UseQueryResult[]) => {
        const products = results
          .map((result) => result.data as ProductInDB)
          .filter((p) => p !== undefined);

        if (DEBUG) console.log("combine products", products);

        return {
          products,
          isPending: results.some((result) => result.isPending),
          error: results.some((result) => result.error),
        };
      },
    };
  }, [queries]);

  const queriesResults = useQueries(options);

  return queriesResults;
};

export const useProductDelete = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken?.();

      try {
        await _appFetch<void, unknown>(
          "/products/update",
          { id, delete: true },
          true,
          token
        );
      } catch (e) {
        console.error(e);
        throw new Error((e as Error).message);
      }
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: getProductQueryKey(id, true) });
    },
  });
};

export const useOrders = () => {
  const { connectedUser } = useAccountContext();
  const appFetch = useAppFetch();

  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      try {
        const orders = await appFetch<Order[], unknown>("/orders/getMany", {});

        return orders;
      } catch (e) {
        console.error(e);
        throw new Error((e as Error).message);
      }
    },
    enabled: !!connectedUser,
  });
};

export const useOrder = (orderId?: string) => {
  const { connectedUser } = useAccountContext();
  const appFetch = useAppFetch();

  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      if (!orderId) {
        throw new Error("No order id");
      }

      try {
        const order = await appFetch<Order, unknown>(
          `/orders/get`,
          { orderId },
          true
        );

        return order;
      } catch (e) {
        console.error(e);
        throw new Error((e as Error).message);
      }
    },
    enabled: !!connectedUser && !!orderId,
  });
};
