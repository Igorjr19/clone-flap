import { dia, shapes } from '@joint/core';
import { useEffect, useRef, useState } from 'react';

export const useInitializePaper = (namespace: typeof shapes) => {
  const paperRef = useRef<HTMLDivElement>(null);
  const [graph] = useState(
    () => new dia.Graph({}, { cellNamespace: namespace }),
  );
  const [paper, setPaper] = useState<dia.Paper | null>(null);

  useEffect(() => {
    if (paperRef.current) {
      const paper = new dia.Paper({
        el: paperRef.current,
        model: graph,
        width: paperRef.current.clientWidth,
        height: paperRef.current.clientHeight,
        background: { color: '#F5F5F5' },
        cellViewNamespace: namespace,
      });

      setPaper(paper);
    }
  }, [graph, namespace]);

  const addCircle = (x: number, y: number) => {
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
        text: 'State',
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
