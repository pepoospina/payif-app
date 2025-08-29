import { CreatePayment, Payment } from "../@shared/types/types.payments";
import { IndexedRepository } from "../db/indexed.repository";
import { DBInstance } from "../db/instance";

export class PaymentsRepository extends IndexedRepository<
  Payment,
  CreatePayment
> {
  constructor(protected db: DBInstance) {
    super(db.collections.payments);
  }
}
