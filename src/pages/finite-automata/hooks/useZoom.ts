import { dia } from '@joint/core';
import { useEffect } from 'react';

export const useZoom = (paper: dia.Paper | null) => {
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey && paper) {
        event.preventDefault();

        const currentScale = paper.scale().sx;
        const zoomFactor = 0.1;

        const newScale =
          event.deltaY < 0
            ? currentScale + zoomFactor
            : currentScale - zoomFactor;

        if (newScale >= 0.5 && newScale <= 2) {
          paper.scale(newScale, newScale);
        }
      }
    };

    const paperEl = paper?.el;
    if (paperEl) {
      paperEl.addEventListener('wheel', handleWheel);
    }

    return () => {
      if (paperEl) {
        paperEl.removeEventListener('wheel', handleWheel);
      }
    };
  }, [paper]);
};
