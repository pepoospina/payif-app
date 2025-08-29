import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useCallback } from "react";

import { useAuth } from "@clerk/clerk-react";
import { FUNCTIONS_BASE } from "../app/config";
import { DefinedIfTrue } from "../shared/types/types.user";

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
  post<T = unknown, R = AxiosResponse<T>["data"], D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
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
): Promise<DefinedIfTrue<S, T>> => {
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

    return res.data.data as DefinedIfTrue<S, T>;
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
