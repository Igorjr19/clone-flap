import { dia, shapes } from '@joint/core';
import { useEffect, useRef, useState } from 'react';
import { useEvents } from './useEvents';

export const useInitializePaper = (
  namespace: typeof shapes,
  setSelected: React.Dispatch<React.SetStateAction<dia.CellView | null>>,
  statesIndexes: number[],
  setStatesIndexes: React.Dispatch<React.SetStateAction<number[]>>,
) => {
  const paperRef = useRef<HTMLDivElement>(null);
  const [graph] = useState(
    () => new dia.Graph({}, { cellNamespace: namespace }),
  );
  const [paper, setPaper] = useState<dia.Paper | null>(null);

  const nextIndex = () => {
    for (let i = 0; i < statesIndexes.length; i++) {
      if (statesIndexes[i] !== i) {
        setStatesIndexes([...statesIndexes, i].sort((a, b) => a - b));
        return i;
      }
    }
    setStatesIndexes([...statesIndexes, statesIndexes.length]);
    return statesIndexes.length;
  };

  useEffect(() => {
    if (paperRef.current) {
      const paper = new dia.Paper({
        el: paperRef.current,
        model: graph,
        width: paperRef.current.clientWidth,
        height: paperRef.current.clientHeight,
        background: { color: '#FFFFFF00' },
        cellViewNamespace: namespace,
        gridSize: 10,
        drawGrid: true,
        drawGridSize: 25,
      });

      useEvents(paper, setSelected);

      setPaper(paper);
    }
  }, [graph, namespace]);

  const addCircle = (x: number, y: number) => {
    setStatesIndexes([...statesIndexes, nextIndex()]);
    const circle = new shapes.standard.Circle();
    circle.position(x, y);
    circle.resize(50, 50);
    circle.attr({
      body: {
        fill: '#F39C12',
        stroke: '#D35400',
        strokeWidth: 2,
      },
      label: {
        text: 'q' + nextIndex(),
        fill: '#FFFFFF',
      },
    });
    graph.addCell(circle);
  };

  const addLink = (sourceId: string, targetId: string) => {
    const link = new shapes.standard.Link();
    link.source({ id: sourceId });
    link.target({ id: targetId });
    link.router('metro');
    link.connector('rounded');
    link.attr({
      line: {
        stroke: '#3498DB',
        strokeWidth: 3,
      },
    });
    graph.addCell(link);
  };

  return { paperRef, paper, addCircle, addLink };
};
