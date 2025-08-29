import { Algoliasearch, algoliasearch } from "algoliasearch";

import { logger } from "../instances/logger";
import { AlgoliaConfig } from "../instances/services";

const DEBUG = false;

export class SearchService {
  private client: Algoliasearch;

  constructor(protected config: AlgoliaConfig) {
    if (DEBUG) {
      logger.info("Initializing Algolia search client", {
        appId: config.appId,
        indexName: config.indexName,
        apiKeyPrefix: config.apiKey.substring(0, 5) + "...",
      });
    }
    this.client = algoliasearch(config.appId, config.apiKey);
  }

  async search(query: string) {
    if (DEBUG) logger.debug("search", { query });

    const res = await this.client.search({
      requests: [
        {
          indexName: this.config.indexName,
          query: query,
        },
      ],
    });

    const firstResult = res.results[0];
    const ids: string[] = [];

    if (DEBUG) logger.debug("search result", { firstResult });

    if (
      firstResult &&
      "hits" in firstResult &&
      Array.isArray(firstResult.hits)
    ) {
      firstResult.hits.forEach((hit: any) => {
        if (hit && typeof hit.objectID === "string") {
          ids.push(hit.objectID);
        }
      });
    }

    if (DEBUG) logger.debug("search result ids", { ids });

    return { ids };
  }
}
