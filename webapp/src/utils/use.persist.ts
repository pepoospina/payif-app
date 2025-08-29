import { useCallback, useEffect, useState } from "react";

const DEBUG = true;

export const usePersist = <T>(
  stateName: string,
  initialValue: T | null
): [T | undefined | null, (value: T | null) => void, () => void] => {
  const name = `persist/${stateName}`;

  const getFromStorage = <T>(name: string, defaultValue?: T | null) => {
    try {
      const item = localStorage.getItem(name);
      const val = item !== null ? (JSON.parse(item) as T) : null;
      if (val === null && defaultValue === null) {
        return null;
      }

      if (val !== null) {
        return val;
      } else {
        if (defaultValue !== undefined) {
          localStorage.setItem(name, JSON.stringify(defaultValue));
        }
        return defaultValue;
      }
    } catch {
      return defaultValue;
    }
  };

  const [state, setStateRaw] = useState<T | undefined | null>(() => {
    // Use function initializer to ensure proper initialization
    const stored = getFromStorage<T>(name, initialValue);
    return stored !== undefined ? stored : initialValue;
  });

  // Ensure hydration in case of SSR issues
  useEffect(() => {
    const stored = getFromStorage<T>(name, initialValue);
    if (stored !== undefined) {
      if (DEBUG) console.log(`usePersist ${name} - hydration`, { stored });
      setStateRaw(stored);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const setState = useCallback(
    (value: T | undefined | null) => {
      if (DEBUG) console.log(`setting usePersist ${name}`, value);
      setStateRaw(value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setStateRaw]
  );

  const deleteValue = useCallback(() => localStorage.removeItem(name), [name]);

  const setValue = useCallback(
    (value: T | null) => {
      if (value === null) {
        deleteValue();
        setState(undefined);
      } else {
        localStorage.setItem(name, JSON.stringify(value));
        setState(value);
      }
      if (DEBUG) console.log(`setting usePersist ${name}`, value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deleteValue, name]
  );

  return [state, setValue, deleteValue];
};
