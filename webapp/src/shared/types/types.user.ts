/** Support types */
export type DefinedIfTrue<V, R> = V extends true ? R : R | undefined;

export type HexStr = `0x${string}`;

export const toHexStr = (str: string): HexStr => {
  if (str.startsWith("0x")) {
    return str as HexStr;
  } else {
    throw new Error(`Invalid HexStr ${str}`);
  }
};

/** The AppUser object combines the details of each platform */
export interface UserWithId {
  clerkId: string;
  userId: string;
}

export interface UserWithSettings {
  signupDate: number;
  email: string;
}

export interface UserWithAccounts {
  profilesIds: string[]; // redundant, used to index users with accounts
}

export interface Address {
  address: string;
  address2: string;
  country: string;
  city: string;
  zip: string;
}

export interface UserWithAddress {
  address?: Address;
}

export interface ContactDetails {
  email: string;
  phone: string;
}

export interface UserWithContact {
  contactDetails?: ContactDetails;
}

export interface UserWithPhone {
  phone?: string;
}

/**
 * AppUser is the entire User object (include credentials) and MUST be
 * kept inside the backend, never sent to the user. We use AppUserRead
 * to send the user profiles to the frontend.
 */
export interface AppUser
  extends UserWithId,
    UserWithSettings,
    UserWithAccounts,
    UserWithAddress,
    UserWithContact,
    UserWithPhone {}

export interface GetLoggedUserPayload {
  connect?: boolean;
  subscriptions?: boolean;
}

/** details sent to the logged in user about themeselves */
export interface AppUserRead
  extends UserWithId,
    UserWithSettings,
    UserWithAddress,
    UserWithContact,
    UserWithPhone {}

/** Test users support for mocks and tests */
export interface TestUserCredentials {
  userId: string;
  clerkId: string;
}
