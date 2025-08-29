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

export interface UserWithId {
  userId: string;
}

export interface AppUser extends UserWithId {
  signupDate?: Date;
}

export interface AppUserCreate extends AppUser {}

export interface AppUserRead extends AppUser {}

export interface AppUserUpdate extends AppUser {}
