import { Firestore } from "firebase-admin/firestore";

import { DBInstance } from "../db/instance";
import { PaymentsRepository } from "../payments/payments.repository";
import { PaymentsService } from "../payments/payments.service";
import { SearchService } from "../search/search.service";
import { TimeService } from "../time/time.service";
import { UsersRepository } from "../users/users.repository";
import { UsersService } from "../users/users.service";
import { logger } from "./logger";

const DEBUG = false;

export interface ClerkConfig {
  publishableKey: string;
  secretKey: string;
}

export interface StripeConfig {
  secretKey: string;
  domain: string;
}

export interface AlgoliaConfig {
  appId: string;
  apiKey: string;
  indexName: string;
}

export interface Repositories {
  users: UsersRepository;
  payments: PaymentsRepository;
}

export interface Services {
  users: UsersService;
  time: TimeService;
  db: DBInstance;
  payments: PaymentsService;
  search: SearchService;
}

export interface ServicesConfig {
  clerk: ClerkConfig;
  stripe: StripeConfig;
  search: AlgoliaConfig;
  isEmulator: boolean;
  mock: {};
}

export const createServices = (
  firestore: Firestore,
  config: ServicesConfig
) => {
  if (DEBUG) logger.info("Creating services");

  const db = new DBInstance(firestore);
  const time = new TimeService();
  const userRepo = new UsersRepository(db);

  // Initialize Algolia search client
  const search = new SearchService(config.search);

  const repos: Repositories = {
    users: userRepo,
    payments: new PaymentsRepository(db),
  };

  const payments = new PaymentsService(db, repos, search);
  const usersService = new UsersService(db, userRepo, payments, time);

  const services: Services = {
    users: usersService,
    time,
    db,
    payments,
    search,
  };

  if (DEBUG) {
    logger.debug("services", {});
  }
  return services;
};
