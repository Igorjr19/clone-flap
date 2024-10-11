import { useEffect } from 'react';
import {
  Circle,
  Coordinate,
} from '../../pages/finite-automata/finite-automata';

interface OnCanvasDrag {
  OnMouseDown: (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
  OnMouseMove: (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
  OnMouseUp: (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
}

interface CanvasProps {
  theme: 'light' | 'dark';
  height?: number | string;
  width?: number | string;
  circles?: Circle[];
  circleRadius?: number;
  selectedCircle?: Circle[];
  onCanvasDrag?: OnCanvasDrag;
  dragStartPosition?: Coordinate;
  draggingOffset?: Coordinate;
  isSelectingArea?: boolean;
}

function Canvas(props: CanvasProps) {
  const drawSelectionArea = (
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    width: number,
    height: number,
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fillStyle = 'rgba(0, 140, 255, 0.1)';
    ctx.fill();
  };

  const drawCircle = (
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    id: number,
  ) => {
    const circleRadius = props.circleRadius || 20;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.fillStyle = props.selectedCircle
      ?.map((circle) => circle.id)
      .includes(id)
      ? 'blue'
      : 'orange';
    ctx.ellipse(x, y, circleRadius, circleRadius, 0, 0, 2 * Math.PI);
    ctx.strokeStyle = props.theme === 'light' ? 'black' : 'white';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.fill();
    ctx.fillStyle = props.theme === 'light' ? 'white' : 'black';
    ctx.font = `${circleRadius}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Q${id}`, x, y);
  };

  const clearCanvas = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const drawPaperBackground = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle =
      props.theme === 'light'
        ? 'rgba(0, 0, 0, 0.5)'
        : 'rgba(255, 255, 255, 0.5)';

    const spacing = 35;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const startX = centerX % spacing;
    const startY = centerY % spacing;

    for (let x = startX; x < canvas.width; x += spacing) {
      for (let y = startY; y < canvas.height; y += spacing) {
        ctx.beginPath();
        ctx.ellipse(x, y, 1, 1, 0, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  };

  const draw = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    clearCanvas(canvas);
    drawPaperBackground(canvas);

    if (props.isSelectingArea) {
      drawSelectionArea(
        canvas,
        props.dragStartPosition?.x || 0,
        props.dragStartPosition?.y || 0,
        props.draggingOffset?.x || 0,
        props.draggingOffset?.y || 0,
      );
    }
    if (props.circles) {
      props.circles.forEach((circle) => {
        drawCircle(canvas, circle.position.x, circle.position.y, circle.id);
      });
    }
  };

  useEffect(() => {
    draw();
  }, [props.circles, props.selectedCircle, props.draggingOffset]);

  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    clearCanvas(canvas);
    drawPaperBackground(canvas);
  }, []);

  return (
    <canvas
      height={props.height}
      width={props.width}
      style={{
        border: '1px solid ' + (props.theme === 'light' ? 'black' : 'white'),
        width: '100%',
        height: '100%',
        margin: 0,
      }}
      onMouseDown={props.onCanvasDrag?.OnMouseDown}
      onMouseMove={props.onCanvasDrag?.OnMouseMove}
      onMouseUp={props.onCanvasDrag?.OnMouseUp}
    ></canvas>
  );
}

export default Canvas;
