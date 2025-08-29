import { Box, BoxExtendedProps, Text } from "grommet";
import { useEffect, useRef, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import React from "react";

import { useToastContext } from "./ToastsContext";
import { HmmIcon } from "./icons/HmmIcon";
import { BoxCentered } from "../ui-components/BoxCentered";
import { LoadingDiv } from "../ui-components/LoadingDiv";
import { useIsAtBottom } from "../ui-components/hooks/IsAtBottom";
import { FetcherInterface } from "./elements.fetcher.hook";
import { GeneralKeys } from "../i18n/i18n.general";

const DEBUG = false;

export interface FilterOption {
  value: string;
  pretty: string;
}

export interface OverlayConfig {
  post: boolean;
  ref: boolean;
  user: boolean;
}

export const CARD_BORDER = "1px solid var(--Neutral-300, #D1D5DB)";

/**
 * Interface for element renderers that support delete functionality
 */
export interface ElementRenderer extends ReactElement {
  onDelete?: (id: string) => void;
}

/**
 * Default element renderer that displays the element's ID
 */
const DefaultElementRenderer = <E extends { id: string }>({
  element,
}: {
  element: E;
}) => {
  return (
    <Box
      pad="medium"
      border={{ color: "light-3", size: "small" }}
      round="small"
    >
      <Text>Element ID: {element.id}</Text>
    </Box>
  );
};

/**
 * Receives a PostFetcherInterface object (with the posts array and methods
 * to interact with it) and renders it as a feed of PostCard.
 * It includes the infinite scrolling
 */
export const ElementsFetcher = <E extends { id: string }>(props: {
  feed: FetcherInterface<E>;
  overlayConfig?: OverlayConfig;
  boxProps?: BoxExtendedProps;
  renderer?: ReactElement;
}) => {
  const { show: showToast } = useToastContext();
  const { t } = useTranslation();

  const { feed, boxProps, renderer } = props;

  const {
    fetch,
    elements,
    isFetching,
    nameDebug,
    isLoading,
    moreToFetch,
    errorFetching,
    deleteElement,
  } = feed;

  const elementsContainerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const { isAtBottom } = useIsAtBottom(elementsContainerRef, bottomRef);

  useEffect(() => {
    if (DEBUG)
      console.log(`${nameDebug}useEffect isAtBottom`, {
        isAtBottom,
        isLoading,
        moreToFetch,
      });

    if (isAtBottom && !isLoading && moreToFetch) {
      if (DEBUG)
        console.log(`${nameDebug}fetchDown due to isAtBottom`, {
          isAtBottom,
          isLoading,
          moreToFetch,
        });

      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAtBottom, moreToFetch, isLoading]);

  useEffect(() => {
    if (errorFetching) {
      showToast({
        title: "Error getting users posts",
        message: errorFetching.message,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorFetching]);

  const showLoading = [1, 2, 4, 5].map((ix) => (
    <LoadingDiv key={ix}></LoadingDiv>
  ));

  const showNoElements = (
    <BoxCentered style={{ height: "100%" }} pad={{ top: "large" }}>
      <BoxCentered
        style={{
          height: "60px",
          width: "60px",
          borderRadius: "40px",
          backgroundColor: "#CEE2F2",
        }}
        margin={{ bottom: "16px" }}
      >
        <HmmIcon size={40}></HmmIcon>
      </BoxCentered>
    </BoxCentered>
  );

  const showElements = elements ? (
    <>
      {elements.map((element, ix) => (
        <Box
          key={ix}
          id={`element-${element.id}`}
          style={{ flexShrink: 0 }}
          margin={{ bottom: "medium" }}
        >
          {renderer ? (
            React.cloneElement(renderer, {
              product: element,
              onDelete: deleteElement,
            })
          ) : (
            <DefaultElementRenderer element={element} />
          )}
        </Box>
      ))}

      {isFetching && (
        <Box style={{ flexShrink: 0 }}>
          <LoadingDiv height="120px" width="100%"></LoadingDiv>
        </Box>
      )}

      <Box
        margin={{ vertical: "medium", horizontal: "medium" }}
        align="center"
        justify="center"
        style={{ flexShrink: 0, minHeight: "2px" }}
        ref={bottomRef}
      >
        {moreToFetch && !isFetching && (
          <Text
            style={{
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: "500",
              lineHeight: "16px",
              color: "grey",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => fetch()}
          >
            {t(GeneralKeys.loadMore)}
          </Text>
        )}
      </Box>

      {!moreToFetch && (
        <Box
          style={{
            flexShrink: 0,
          }}
          pad={{ vertical: "large", horizontal: "medium" }}
          align="center"
          justify="center"
        >
          <Text
            style={{
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: "500",
              lineHeight: "16px",
              color: "grey",
            }}
          >
            {t(GeneralKeys.noMorePosts)}
          </Text>
        </Box>
      )}
    </>
  ) : (
    <></>
  );

  return (
    <Box
      fill
      style={{
        position: "relative",
        ...boxProps?.style,
      }}
      justify="start"
      {...boxProps}
    >
      <Box
        ref={elementsContainerRef}
        style={{
          height: "100%",
          overflowY: "auto",
        }}
        pad={{ horizontal: "4px" }}
      >
        {!elements || isLoading
          ? showLoading
          : elements.length === 0
            ? showNoElements
            : showElements}
      </Box>
    </Box>
  );
};
