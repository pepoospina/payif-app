import { Query } from "firebase-admin/firestore";

import { CommonQuery, Indexed } from "../@shared/types/types.feed";
import { logger } from "../instances/logger";
import { filterByEqual } from "./filters";
import { BaseRepository } from "./repo.base";
import { TransactionManager } from "./transaction.manager";

const DEBUG = false;
const DEBUG_PREFIX = "RankedRepository";

const RANK_KEY: keyof Indexed = "rank";
const OWNER_ID_KEY: keyof Indexed = "ownerId";

interface StartAfter {
  id: string;
  rank: number;
}

export class IndexedRepository<
  T extends Indexed,
  C extends Omit<T, "id">,
> extends BaseRepository<T, C> {
  /** Cannot be part of a transaction */
  public async getMany(queryParams: CommonQuery, manager: TransactionManager) {
    /** type protection against properties renaming */
    if (DEBUG) logger.debug("getMany", queryParams, DEBUG_PREFIX);

    let query: Query = this.collection;

    query = filterByEqual(query, OWNER_ID_KEY, queryParams.ownerId);

    /** get the pagination page details */
    const startAfter = await (async (): Promise<StartAfter | undefined> => {
      const elementId = queryParams.fromId;

      if (elementId) {
        const element = await this.get(elementId, manager, true);
        if (DEBUG) logger.debug("startAfter", element, DEBUG_PREFIX);

        const rank = element.rank;

        return {
          id: elementId,
          rank,
        };
      }

      /** if no until or sinceId provided, first page */
      return undefined;
    })();

    const paginated = await (async (_base: Query) => {
      const ordered = _base
        .orderBy(`${RANK_KEY}`, "desc")
        .orderBy("__name__", "desc");

      if (!startAfter) {
        return ordered;
      }

      return ordered.startAfter(startAfter.rank, startAfter.id);
    })(query);

    const postsIds = await paginated
      .limit(queryParams.amount)
      .select("id")
      .get();

    const docIds = postsIds.docs.map((doc) => doc.id);
    return docIds;
  }

  public async getAllIdsOfQuery(
    queryParams: CommonQuery,
    manager: TransactionManager,
    limit?: number
  ) {
    let stillPending = true;
    const allPostsIds: string[] = [];
    const allPostIdsSet = new Set<string>();

    while (stillPending) {
      if (DEBUG) logger.debug("getAllOfQuery", queryParams, DEBUG_PREFIX);
      const postsIds = await this.getMany(queryParams, manager);

      stillPending = postsIds.length === queryParams.amount;

      if (DEBUG)
        logger.debug(
          `getAllOfQuery - got ${postsIds.length} posts`,
          { stillPending, n: allPostsIds.length },
          DEBUG_PREFIX
        );

      allPostsIds.push(...postsIds);
      postsIds.forEach((id) => {
        if (!allPostIdsSet.has(id)) {
          allPostIdsSet.add(id);
        } else {
          throw new Error(`Duplicate post id ${id}`);
        }
      });

      if (limit && allPostsIds.length >= limit) {
        if (DEBUG)
          logger.debug(
            `getAllOfQuery - limit reached`,
            { limit, n: allPostsIds.length },
            DEBUG_PREFIX
          );

        stillPending = false;
      }

      if (postsIds.length > 0) {
        const lastPostId = postsIds[postsIds.length - 1];

        queryParams.fromId = lastPostId;
        if (DEBUG)
          logger.debug(
            `getAllOfQuery - fromId updated to ${queryParams.fromId}`,
            undefined,
            DEBUG_PREFIX
          );
      }
    }

    return limit ? allPostsIds.slice(0, limit) : allPostsIds;
  }

  public async getAllOfQuery(
    queryParams: CommonQuery,
    manager: TransactionManager,
    limit?: number
  ) {
    const ids = await this.getAllIdsOfQuery(queryParams, manager, limit);
    return this.getFromIds(ids);
  }
}
