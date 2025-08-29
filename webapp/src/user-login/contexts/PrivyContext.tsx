import { PrivyProvider } from "@privy-io/react-auth";
import { PropsWithChildren, createContext, useContext } from "react";

export type PrivyContextType = object;

const privyAppId = process.env.PUBLIC_PRIVY_APP_ID;
const privyClientId = process.env.PUBLIC_PRIVY_CLIENT_ID;

const PrivyContextValue = createContext<PrivyContextType | undefined>(
  undefined
);

/** Manages the authentication process with Orcid */
export const PrivyContext = (props: PropsWithChildren) => {
  if (privyAppId === undefined) {
    throw Error("Privy app id not found");
  }

  return (
    <PrivyContextValue.Provider value={{}}>
      <PrivyProvider
        appId={privyAppId}
        clientId={privyClientId}
        config={{
          // Create embedded wallets for users who don't have a wallet
          embeddedWallets: {
            ethereum: {
              createOnLogin: "users-without-wallets",
            },
          },
        }}
      >
        {props.children}
      </PrivyProvider>
    </PrivyContextValue.Provider>
  );
};

export const usePrivyContext = (): PrivyContextType => {
  const context = useContext(PrivyContextValue);
  if (!context) throw Error("context not found");
  return context;
};
