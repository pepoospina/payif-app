import { useCallback, useEffect, useMemo, useState } from "react";

import { useAppFetch } from "../api/app.fetch";
import { useAccountContext } from "../user-login/contexts/AccountContext";
import {
  CommonQuery,
  FeedResult,
  GetProductsPayload,
} from "../shared/types/types.fetch";

const DEBUG = false;

export const PAGE_SIZE = 5;

export interface FetcherInterface<E> {
  nameDebug: string;
  elements?: E[];
  isLoading: boolean;
  isFetching: boolean;
  errorFetching?: Error;
  fetch: () => void;
  moreToFetch: boolean;
  deleteElement: (id: string) => void;
}

export interface FetcherConfig {
  endpoint: string;
  queryParams: CommonQuery;
  subscribe?: boolean;
  DEBUG_PREFIX?: string;
  enabled?: boolean;
}

/**
 * Handles one array of posts by keeping track of the top and bottom post ids and
 * fething up and down posts as requested by a consuming component
 */
export const useElementsFetcher = <E extends { id: string }>(
  input: FetcherConfig
): FetcherInterface<E> => {
  const { connectedUser } = useAccountContext();

  const { endpoint, queryParams, enabled = true } = input;

  const DEBUG_PREFIX = input.DEBUG_PREFIX || "";

  const appFetch = useAppFetch();

  const [elements, setElements] = useState<E[] | undefined>(undefined);
  const [fetchedFirst, setFetchedFirst] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [errorFetching, setErrorFetching] = useState<Error>();

  const [moreToFetch, setMoreToFetch] = useState(true);

  // for debug
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      if (DEBUG) console.log(`${DEBUG_PREFIX}usePostsFetcher mounted`);
    }
    return () => {
      mounted = false;
      if (DEBUG) console.log(`${DEBUG_PREFIX}usePostsFetcher unmounted`);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addElements = useCallback(
    (candidateNewElements: E[]) => {
      if (DEBUG)
        console.log(`${DEBUG_PREFIX}addElements called`, {
          elements: candidateNewElements,
        });

      /** add posts  */
      setElements((prev) => {
        /** filter existing elements */
        const newElements =
          prev !== undefined
            ? candidateNewElements.filter(
                (element) =>
                  !prev.find((prevElement) => prevElement.id === element.id)
              )
            : candidateNewElements;

        const allElements = prev ? prev.concat(newElements) : newElements;

        if (DEBUG)
          console.log(`${DEBUG_PREFIX}pushing posts`, { prev, allElements });

        return allElements;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [DEBUG_PREFIX]
  );

  const removeAllElements = () => {
    if (DEBUG) console.log(`${DEBUG_PREFIX}settings elements to empty array`);
    setElements([]);
  };

  const deleteElement = useCallback(
    (id: string) => {
      if (DEBUG) console.log(`${DEBUG_PREFIX}deleting element with id: ${id}`);
      setElements((prev) => {
        if (!prev) return prev;
        return prev.filter((element) => element.id !== id);
      });
    },
    [DEBUG_PREFIX]
  );

  const reset = () => {
    if (DEBUG) console.log(`${DEBUG_PREFIX}resetting elements`);
    removeAllElements();
    setFetchedFirst(false);
    setIsLoading(true);
    setMoreToFetch(true);
  };

  const bottomPostsId = useMemo((): string | undefined => {
    const bottomId = elements?.[elements.length - 1]?.id;
    if (DEBUG)
      console.log(`${DEBUG_PREFIX}recomputing bottom ${bottomId || ""}`);
    return bottomId;
  }, [DEBUG_PREFIX, elements]);

  /** fetch for more post backwards, receives an optional oldestPostId and is updated when the queryParameters change */
  const fetchCallback = useCallback(
    async (bottomPostsId?: string) => {
      if (DEBUG)
        console.log(`${DEBUG_PREFIX}fetching down`, {
          bottomPostsId,
          connectedUser,
        });

      if (DEBUG)
        console.log(`${DEBUG_PREFIX}fetching down`, {
          bottomPostsId,
        });

      try {
        const query: CommonQuery = {
          ...queryParams,
          fromId: bottomPostsId,
        };

        if (DEBUG) console.log(`${DEBUG_PREFIX}fetching down`, query);
        const result = await appFetch<FeedResult<E>, GetProductsPayload>(
          endpoint,
          {
            query,
          }
        );

        if (DEBUG)
          console.log(`${DEBUG_PREFIX}fetching down retrieved`, result);
        addElements(result.elements);
        setIsLoading(false);

        if (result.end) {
          if (DEBUG)
            console.log(`${DEBUG_PREFIX} more to fetch set to false`, {
              readPosts: result.elements.length,
              end: result.end,
              expectedAmount: queryParams.amount,
            });
          setMoreToFetch(false);
        } else {
          setMoreToFetch(true);
        }
      } catch (e) {
        console.error(`${DEBUG_PREFIX}error fetching down`, {
          e,
        });
        setErrorFetching(e as Error);
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [connectedUser, queryParams, endpoint]
  );

  const _fetchDown = (bottomPostsIds?: string) => {
    setIsFetching(true);
    fetchCallback(bottomPostsIds)
      .then(() => {
        setIsFetching(false);
      })
      .catch((e) => {
        console.error(e);
        setIsFetching(false);
      });
  };

  /** public function to trigger fetching for older posts since the current oldest one */
  const fetchDown = useCallback(() => {
    if (DEBUG) console.log(`${DEBUG_PREFIX}external fetchDown`);
    _fetchDown(bottomPostsId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bottomPostsId]);

  /** reset at every status change  */
  useEffect(() => {
    if (DEBUG)
      console.log(
        `${DEBUG_PREFIX}resetting and _fetchDown due to connectedUser, queryParams, endpoint, enabled change`,
        {
          queryParams,
          endpoint,
          fetchedFirst,
        }
      );
    reset();
    if (!enabled) {
      return;
    }

    setIsFetching(true);
    fetchCallback(undefined)
      .then(() => {
        setIsFetching(false);
      })
      .catch((e) => {
        console.error(e);
        setIsFetching(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams, endpoint, enabled]);

  /** turn off errors automatically */
  useEffect(() => {
    if (errorFetching) {
      setErrorFetching(undefined);
    }
  }, [errorFetching]);

  const feed = useMemo((): FetcherInterface<E> => {
    return {
      elements,
      fetch: fetchDown,
      isFetching,
      errorFetching,
      isLoading,
      moreToFetch,
      nameDebug: DEBUG_PREFIX,
      deleteElement,
    };
  }, [
    elements,
    fetchDown,
    isFetching,
    errorFetching,
    isLoading,
    moreToFetch,
    DEBUG_PREFIX,
    deleteElement,
  ]);

  return feed;
};
