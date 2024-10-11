import React, { useEffect, useState } from 'react';
import { Container, Dropdown } from 'react-bootstrap';
import Canvas from '../../components/canvas/canvas';

const CIRCLE_RADIUS = 20;

interface FiniteAutomataProps {
  theme: 'light' | 'dark';
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface Circle {
  id: number;
  position: Coordinate;
}

const FiniteAutomata: React.FC<FiniteAutomataProps> = (
  props: FiniteAutomataProps,
) => {
  const [showMenu, setShowMenu] = useState(false);
  const [contextMenu, setContextMenu] = useState<Coordinate>({
    x: 0,
    y: 0,
  });
  const [circles, setCircles] = useState<Circle[]>([]);
  const [selectedCircle, setSelectedCircle] = useState<Circle[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartPosition, setDragStartPosition] = useState<Coordinate | null>(
    null,
  );
  const [dragOffset, setDragOffset] = useState<Coordinate | null>(null);
  const [isSelectingArea, setIsSelectingArea] = useState<boolean>(false);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setShowMenu(true);
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleClickOutside = () => {
    if (showMenu) {
      setShowMenu(false);
    }
  };

  const identifyCircle = (x: number, y: number) => {
    return circles.find((circle) => {
      const { position } = circle;
      const dx = x - position.x;
      const dy = y - position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= CIRCLE_RADIUS * 1.5;
    });
  };

  const identifyCircleInArea = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ) => {
    return circles.filter((circle) => {
      const { position } = circle;
      return (
        (position.x >= x1 &&
          position.x <= x2 &&
          position.y >= y1 &&
          position.y <= y2) ||
        (position.x <= x1 &&
          position.x >= x2 &&
          position.y <= y1 &&
          position.y >= y2) ||
        (position.x >= x1 &&
          position.x <= x2 &&
          position.y <= y1 &&
          position.y >= y2) ||
        (position.x <= x1 &&
          position.x >= x2 &&
          position.y >= y1 &&
          position.y <= y2)
      );
    });
  };

  const handleAddCircle = (x: number, y: number) => {
    let nextCircleId = 0;
    if (circles.length > 0) {
      nextCircleId =
        circles[0].id !== 0 ? 0 : circles[circles.length - 1].id + 1;
      for (let i = 0; i < circles.length - 1; i++) {
        if (circles[i].id + 1 !== circles[i + 1].id) {
          nextCircleId = circles[i].id + 1;
          break;
        }
      }
    }
    setCircles((prevCircles) =>
      [
        ...prevCircles,
        {
          id: nextCircleId,
          position: { x, y },
        },
      ].sort((a, b) => a.id - b.id),
    );
  };

  const handleSelectCircle = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  ) => {
    const x = event.clientX;
    const y = event.clientY;
    const circle = identifyCircle(x, y);
    if (event.shiftKey) {
      if (!circle) {
        return;
      }
      setSelectedCircle((prevSelectedCircle) => {
        if (!prevSelectedCircle) {
          return [circle];
        }
        if (prevSelectedCircle.includes(circle)) {
          return prevSelectedCircle.filter((c) => c.id !== circle.id);
        }
        return [...prevSelectedCircle, circle];
      });
    } else {
      if (!circle) {
        setSelectedCircle([]);
        return;
      }
      if (selectedCircle.includes(circle)) {
        return;
      }
      setSelectedCircle([circle]);
    }
  };

  const handleRemoveCircle = (x: number, y: number) => {
    const circle = identifyCircle(x, y);
    setCircles((prevCircles) => {
      return prevCircles.filter((c) => c.id !== circle?.id);
    });
  };

  const handleClear = () => {
    setCircles([]);
  };

  const handleSelectArea = (x1: number, y1: number, x2: number, y2: number) => {
    setSelectedCircle(identifyCircleInArea(x1, y1, x2, y2));
  };

  const handleMouseDown = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  ) => {
    const x = event.clientX;
    const y = event.clientY;
    handleSelectCircle(event);
    if (!identifyCircle(x, y)) {
      setIsSelectingArea(true);
      setSelectedCircle([]);
    }
    setIsDragging(true);
    setDragStartPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  ) => {
    if (!dragStartPosition) {
      return;
    }
    const dx = event.clientX - dragStartPosition.x;
    const dy = event.clientY - dragStartPosition.y;
    if (isDragging && !isSelectingArea) {
      if (!dragOffset) {
        setDragOffset({ x: dx, y: dy });
      } else {
        const offsetX = dx - dragOffset.x;
        const offsetY = dy - dragOffset.y;

        selectedCircle.forEach((circle) => {
          circle.position.x += offsetX;
          circle.position.y += offsetY;
        });
        setDragOffset({ x: dx, y: dy });
      }
    }
    if (isSelectingArea) {
      setDragOffset({ x: dx, y: dy });
      handleSelectArea(
        dragStartPosition?.x || 0,
        dragStartPosition?.y || 0,
        event.clientX,
        event.clientY,
      );
    }
  };

  const handleMouseUp = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  ) => {
    setIsDragging(false);
    setDragStartPosition(null);
    setDragOffset(null);
    setIsSelectingArea(false);
  };

  const onCanvasDrag = {
    OnMouseDown: handleMouseDown,
    OnMouseMove: handleMouseMove,
    OnMouseUp: handleMouseUp,
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{
        height: '85vh',
      }}
      onContextMenu={handleContextMenu}
    >
      <Canvas
        width={1920}
        height={1080}
        theme={props.theme}
        circles={circles}
        circleRadius={CIRCLE_RADIUS}
        selectedCircle={selectedCircle}
        onCanvasDrag={onCanvasDrag}
        dragStartPosition={dragStartPosition || { x: 0, y: 0 }}
        draggingOffset={dragOffset || { x: 0, y: 0 }}
        isSelectingArea={isSelectingArea}
      ></Canvas>
      {showMenu && (
        <Dropdown.Menu
          show
          style={{
            position: 'absolute',
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 1000,
          }}
        >
          <Dropdown.Item
            onClick={() => handleAddCircle(contextMenu.x, contextMenu.y)}
          >
            Adicionar círculo
          </Dropdown.Item>
          <Dropdown.Item>Adicionar link</Dropdown.Item>
          <Dropdown.Item
            onClick={() => handleRemoveCircle(contextMenu.x, contextMenu.y)}
          >
            Remover elemento
          </Dropdown.Item>
          <Dropdown.Item onClick={handleClear}>Limpar</Dropdown.Item>
        </Dropdown.Menu>
      )}
    </Container>
  );
};

export default FiniteAutomata;
