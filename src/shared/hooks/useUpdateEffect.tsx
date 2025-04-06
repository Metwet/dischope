import { useEffect, useRef } from "react";

export const useUpdateEffect = (
  effect: () => void,
  deps: React.DependencyList
): void => {
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
