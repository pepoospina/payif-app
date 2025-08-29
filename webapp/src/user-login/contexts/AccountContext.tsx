import { useAuth, useClerk, useUser } from "@clerk/clerk-react";

import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAppFetch } from "../../api/app.fetch";
import {
  AppUserRead,
  GetLoggedUserPayload,
} from "../../shared/types/types.user";

const DEBUG = false;

export type AccountContextType = {
  signIn: () => void;
  connectedUser?: ConnectedUser;
  isConnected: boolean;
  disconnect: () => void;
  refresh: (payload?: GetLoggedUserPayload) => Promise<void>;
};

const AccountContextValue = createContext<AccountContextType | undefined>(
  undefined
);

// assume one profile per platform for now
export interface ConnectedUser extends AppUserRead {}

// export type ConnectedUser = AppUserRead;

/**
 * Manages the logged-in user. We use JWT tokens to authenticate
 * a logged in user to our backend. The JWT is set when the user
 * logsin or sign up with any supported platform, and is stored
 * in the localStorage
 */
export const AccountContext = (props: PropsWithChildren) => {
  /** clark does its things, then isSignedIn is tru, we call getToken, then token is defined,
   * we refresh connected user (the backend will create the user in our DB, if the user does not exist)
   */

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const appFetch = useAppFetch();
  const { isSignedIn } = useUser();
  const { signOut } = useAuth();
  const { openSignIn } = useClerk();

  const signIn = () => {
    openSignIn();
  };

  const [connectedUser, setConnectedUser] = useState<ConnectedUser | null>();

  const refresh = useCallback(
    async (payload?: GetLoggedUserPayload) => {
      try {
        const user = await appFetch<AppUserRead, GetLoggedUserPayload>(
          "/auth/me",
          payload,
          true
        );
        if (DEBUG) console.log("set connectedUser after fetch", { user });

        /** set user */
        setConnectedUser(user);
      } catch (e) {
        console.error(`Error getting logged in user`, e);
        signOut().catch(console.error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSignedIn]
  );

  /** keep the conneccted user linkted to the current token */
  useEffect(() => {
    if (isSignedIn) {
      refresh({ connect: true, subscriptions: true }).catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  const disconnect = () => {
    if (DEBUG) console.log(`disconnect called`);

    signOut().catch(console.error);
    setConnectedUser(undefined);
  };

  return (
    <AccountContextValue.Provider
      value={{
        signIn,
        connectedUser: connectedUser === null ? undefined : connectedUser,
        isConnected: connectedUser !== undefined && connectedUser !== null,
        disconnect,
        refresh,
      }}
    >
      {props.children}
    </AccountContextValue.Provider>
  );
};

export const useAccountContext = (): AccountContextType => {
  const context = useContext(AccountContextValue);
  if (!context) throw Error("context not found");
  return context;
};
