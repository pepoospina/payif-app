import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export function useBack(enabled: boolean, actionOnBack: () => void) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const prevLocation = useRef(location);

  useEffect(() => {
    if (navigationType === "POP" && enabled) {
      if (prevLocation.current.key !== location.key) {
        actionOnBack();
      }
    }

    prevLocation.current = location;
  }, [location, navigationType, actionOnBack, enabled]);
}
