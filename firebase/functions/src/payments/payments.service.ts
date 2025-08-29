import { CommonQuery } from "@shared/types/types.feed";
import { SearchProductsResult } from "@shared/types/types.search";
import {
  CreatePayment,
  Payment,
  UpdatePayment,
} from "../@shared/types/types.payments";
import { DBInstance } from "../db/instance";
import { TransactionManager } from "../db/transaction.manager";
import { Repositories } from "../instances/services";
import { SearchService } from "../search/search.service";

const DEBUG = false;

export class PaymentsService {
  constructor(
    protected db: DBInstance,
    public repos: Repositories,
    protected search: SearchService
  ) {}

  async create(
    payload: CreatePayment,
    manager: TransactionManager,
    ownerId?: string
  ): Promise<Payment> {
    if (DEBUG) console.log("payload", payload);
    return this.repos.payments.create(payload, manager);
  }

  /*** userId MUST be the authenticated user */
  async update(
    payload: UpdatePayment,
    manager: TransactionManager,
    userId?: string
  ): Promise<void> {
    const product = await this.repos.payments.get(payload.id, manager, true);

    if (!product) {
      throw new Error(`Product with id ${payload.id} not found`);
    }

    if (product.ownerId !== userId) {
      throw new Error(
        `User ${userId} is not the owner of product ${product.id}`
      );
    }

    if (!payload.delete) {
      if (!payload.payment) {
        throw new Error("Product is required");
      }

      this.repos.payments.update(payload.id, payload.payment, manager);
    } else {
      this.repos.payments.delete(product.id, manager);
    }
  }

  async get(id: string, manager: TransactionManager, shouldThrow?: boolean) {
    return this.repos.payments.get(id, manager, shouldThrow);
  }

  async getMany(query: CommonQuery, manager: TransactionManager) {
    return this.repos.payments.getMany(query, manager);
  }

  async searchPayment(query: string): Promise<SearchProductsResult> {
    const ids = await this.search.search(query);
    return ids;
  }
}
