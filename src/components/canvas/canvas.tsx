import { useEffect } from 'react';

interface CanvasProps {
  theme: 'light' | 'dark';
  height?: number | string;
  width?: number | string;
}

function Canvas(props: CanvasProps) {
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

  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    drawPaperBackground(canvas);
  }, [props.theme]);

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
    ></canvas>
  );
}

export default Canvas;
