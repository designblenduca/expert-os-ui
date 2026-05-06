import { useLayoutEffect, useRef, useState } from 'react';

type AdaptivePageSizeOptions = {
  rowHeight: number;
  minRows?: number;
  maxRows?: number;
  headerHeight?: number;
  footerHeight?: number;
  bottomOffset?: number;
};

export const useAdaptivePageSize = <T extends HTMLElement>({
  rowHeight,
  minRows = 5,
  maxRows = 20,
  headerHeight = 54,
  footerHeight = 58,
  bottomOffset = 48,
}: AdaptivePageSizeOptions) => {
  const containerRef = useRef<T | null>(null);
  const [pageSize, setPageSize] = useState(minRows);

  useLayoutEffect(() => {
    let frameId = 0;

    const calculatePageSize = () => {
      const container = containerRef.current;
      if (!container) return;

      const { top } = container.getBoundingClientRect();
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const availableHeight = viewportHeight - top - headerHeight - footerHeight - bottomOffset;
      const nextPageSize = Math.max(
        minRows,
        Math.min(maxRows, Math.floor(availableHeight / rowHeight))
      );

      setPageSize((current) => (current === nextPageSize ? current : nextPageSize));
    };

    const scheduleCalculation = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(calculatePageSize);
    };

    scheduleCalculation();
    window.addEventListener('resize', scheduleCalculation);
    window.visualViewport?.addEventListener('resize', scheduleCalculation);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', scheduleCalculation);
      window.visualViewport?.removeEventListener('resize', scheduleCalculation);
    };
  }, [bottomOffset, footerHeight, headerHeight, maxRows, minRows, rowHeight]);

  return { containerRef, pageSize };
};
