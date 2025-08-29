import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Box } from "grommet";
import { createContext, useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import { AppHomePage } from "../pages/AppHomePage";
import { RouteNames } from "../route.names";
import { ResponsiveApp } from "../ui-components/ResponsiveApp";
import { ThemedApp, useThemeContext } from "../ui-components/ThemedApp";
import { ConnectedUserWrapper } from "../user-login/contexts/ConnectedUserWrapper";
import { LoadingContext } from "./LoadingContext";
import { GlobalStyles } from "./layout/GlobalStyles";
import { ViewportContainer } from "./layout/Viewport";
import { createIDBPersister } from "./IndexedDBPersister";
import { CreatePaymentPage } from "../pages/CreatePaymentPage";

export interface SetPageTitleType {
  prefix: string;
  main: string;
}

const DEBUG = false;
const DEBUG_PREFIX = ``;

export type AppContainerContextType = object;

const AppContainerContextValue = createContext<
  AppContainerContextType | undefined
>(undefined);

const queryClient = new QueryClient();

export const AppContainer0 = (props: React.PropsWithChildren) => {
  // for debug
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      if (DEBUG) console.log(`${DEBUG_PREFIX}AppContainer0 mounted`);
    }
    return () => {
      mounted = false;
      if (DEBUG) console.log(`${DEBUG_PREFIX}AppContainer0 unmounted`);
    };
  }, []);

  return (
    <>
      <GlobalStyles />
      <ThemedApp>
        <ResponsiveApp>
          <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister: createIDBPersister() }}
          >
            <LoadingContext>
              <ConnectedUserWrapper>
                <AppContainer></AppContainer>
              </ConnectedUserWrapper>
            </LoadingContext>
          </PersistQueryClientProvider>
        </ResponsiveApp>
      </ThemedApp>
    </>
  );
};

export const AppContainer = (props: React.PropsWithChildren) => {
  const { constants } = useThemeContext();

  const topHeight = "0px";

  return (
    <>
      <AppContainerContextValue.Provider value={{}}>
        <ViewportContainer
          style={{
            backgroundColor: constants.colors.shade,
          }}
        >
          <Box style={{ height: `calc(100% - ${topHeight})` }}>
            <Routes>
              <Route
                path={`/${RouteNames.CreatePayment}`}
                element={<CreatePaymentPage></CreatePaymentPage>}
              ></Route>
              <Route
                path={RouteNames.AppHome}
                element={<AppHomePage />}
              ></Route>
            </Routes>
          </Box>
        </ViewportContainer>
      </AppContainerContextValue.Provider>
    </>
  );
};

export const useAppContainer = (): AppContainerContextType => {
  const context = useContext(AppContainerContextValue);
  if (!context) throw Error("context not found");
  return context;
};
