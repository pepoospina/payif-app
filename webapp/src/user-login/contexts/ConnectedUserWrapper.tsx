import { PropsWithChildren, createContext } from "react";

import { AccountContext } from "./AccountContext";
import { DisconnectUserContext } from "./DisconnectUserContext";
import { NavHistoryContext } from "./NavHistoryContext";
import { ClerkContext } from "./ClerkContext";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConnectedUserContextType {}

const ConnectedUserWrapperValue = createContext<
  ConnectedUserContextType | undefined
>(undefined);

/**
 * A wrapper of all context related to the connected user and its connection
 * to multiple platforms.
 *
 * Hooks designed ot be consumed are all implemented in the ConnectedUserContext
 */
export const ConnectedUserWrapper = (props: PropsWithChildren) => {
  return (
    <ConnectedUserWrapperValue.Provider value={{}}>
      <ClerkContext>
        <AccountContext>
          <DisconnectUserContext>
            <NavHistoryContext>{props.children}</NavHistoryContext>
          </DisconnectUserContext>
        </AccountContext>
      </ClerkContext>
    </ConnectedUserWrapperValue.Provider>
  );
};
