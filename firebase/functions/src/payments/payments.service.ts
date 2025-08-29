import { CreatePayment, Payment } from "../@shared/types/types.payments";
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
    return this.repos.payments.create(payload, manager);
  }

  /*** userId MUST be the authenticated user */
  async update(
    payload: UpdateProduct,
    manager: TransactionManager,
    userId?: string
  ): Promise<void> {
    const product = await this.repos.products.get(payload.id, manager, true);

    if (!product) {
      throw new Error(`Product with id ${payload.id} not found`);
    }

    if (product.ownerId !== userId) {
      throw new Error(
        `User ${userId} is not the owner of product ${product.id}`
      );
    }

    if (!payload.delete) {
      if (!payload.product) {
        throw new Error("Product is required");
      }

      const _product = this.getInitProduct(
        payload.product,
        product.owner,
        product.ownerId
      );

      this.repos.products.update(payload.id, _product, manager);
    } else {
      this.repos.products.delete(product.id, manager);
    }
  }

  async get(id: string, manager: TransactionManager, shouldThrow?: boolean) {
    return this.repos.products.get(id, manager, shouldThrow);
  }

  async searchPayment(query: string): Promise<SearchProductsResult> {
    const ids = await this.search.search(query);
    return ids;
  }
}
