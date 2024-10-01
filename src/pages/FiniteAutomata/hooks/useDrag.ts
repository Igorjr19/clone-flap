import { dia } from '@joint/core';
import { useEffect, useState } from 'react';

export const useDrag = (
  paper: dia.Paper | null,
  paperRef: React.RefObject<HTMLDivElement>,
) => {
  const [isDragging, setIsDragging] = useState(false);
  const [ctrlDown, setCtrlDown] = useState(false);
  const [dragStartPosition, setDragStartPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(
    null,
  );

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      setIsDragging(true);
      if (event.ctrlKey && paper) {
        setCtrlDown(true);
        setDragStartPosition({ x: event.clientX, y: event.clientY });
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging && dragStartPosition && paper) {
        const dx = event.clientX - dragStartPosition.x;
        const dy = event.clientY - dragStartPosition.y;

        if (!dragOffset) {
          setDragOffset({ x: dx, y: dy });
        } else {
          const offsetX = dx - dragOffset.x;
          const offsetY = dy - dragOffset.y;

          paper.translate(offsetX, offsetY);
          setDragOffset({ x: dx, y: dy });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setCtrlDown(false);
      setDragStartPosition(null);
      setDragOffset(null);
    };

    const paperEl = paperRef.current;
    if (paperEl) {
      paperEl.addEventListener('mousedown', handleMouseDown);
      paperEl.addEventListener('mousemove', handleMouseMove);
      paperEl.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      if (paperEl) {
        paperEl.removeEventListener('mousedown', handleMouseDown);
        paperEl.removeEventListener('mousemove', handleMouseMove);
        paperEl.removeEventListener('mouseup', handleMouseUp);
      }
    };
  }, [isDragging, dragStartPosition, dragOffset, paper, paperRef]);

  return { isDragging, ctrlDown };
};
