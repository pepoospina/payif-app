import { PropsWithChildren, createContext, useContext } from "react";
import { useAccountContext } from "./AccountContext";

export type ConnectedUserContextType = {
  disconnect: () => void;
};

const ConnectedUserContextValue = createContext<
  ConnectedUserContextType | undefined
>(undefined);

/** Disconnect from all platforms */
export const DisconnectUserContext = (props: PropsWithChildren) => {
  const { disconnect: disconnectServer } = useAccountContext();

  const disconnect = () => {
    disconnectServer();
  };

  return (
    <ConnectedUserContextValue.Provider
      value={{
        disconnect,
      }}
    >
      {props.children}
    </ConnectedUserContextValue.Provider>
  );
};

export const useDisconnectContext = (): ConnectedUserContextType => {
  const context = useContext(ConnectedUserContextValue);
  if (!context) throw Error("context not found");
  return context;
};
