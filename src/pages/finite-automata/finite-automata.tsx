import React, { useEffect, useState } from 'react';
import { Button, Container, Dropdown, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Canvas from '../../components/canvas/canvas';
import { Rule } from '../regular-grammar/regular-grammar';

const CIRCLE_RADIUS = 20;

interface FiniteAutomataProps {
  theme: 'light' | 'dark';
  circles: Circle[];
  setCircles: React.Dispatch<React.SetStateAction<Circle[]>>;
  links: Link[];
  setLinks: React.Dispatch<React.SetStateAction<Link[]>>;
  setRegex: React.Dispatch<React.SetStateAction<string>>;
  setRules: React.Dispatch<React.SetStateAction<Rule[]>>;
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface Circle {
  id: number;
  position: Coordinate;
  isFinal?: boolean;
  isInitial?: boolean;
}

export interface Link {
  id: number;
  from: Circle;
  to: Circle;
  symbols: string[];
}

const FiniteAutomata: React.FC<FiniteAutomataProps> = ({
  circles,
  links,
  setCircles,
  setLinks,
  setRegex,
  setRules,
  ...props
}: FiniteAutomataProps) => {
  const [canvasOffset, setCanvasOffset] = useState<Coordinate>({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState<Coordinate>({ x: 0, y: 0 });

  const [showMenu, setShowMenu] = useState(false);
  const [showSubMenuState, setShowSubMenuState] = useState(false);
  const [contextMenu, setContextMenu] = useState<Coordinate>({
    x: 0,
    y: 0,
  });

  const [selectedCircle, setSelectedCircle] = useState<Circle[]>([]);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartPosition, setDragStartPosition] = useState<Coordinate | null>(
    null,
  );
  const [dragOffset, setDragOffset] = useState<Coordinate | null>(null);
  const [isSelectingArea, setIsSelectingArea] = useState<boolean>(false);

  const [isAddingLink, setIsAddingLink] = useState<boolean>(false);
  const [linkStart, setLinkStart] = useState<Circle | null>(null);
  const [linkOffset, setLinkOffset] = useState<Coordinate | null>(null);

  const [showLabelInput, setShowLabelInput] = useState<boolean>(false);
  const [showLabelInputPosition, setShowLabelInputPosition] =
    useState<Coordinate | null>(null);
  const [labelInputValue, setLabelInputValue] = useState<string>('');

  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<boolean>(false);
  const [empty, setEmpty] = useState<boolean>(true);
  const [disabled, setDisabled] = useState<boolean>(false);

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
    if (showSubMenuState) {
      setShowSubMenuState(false);
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const findNextId = (arr: any[]) => {
    let nextCircleId = 0;
    if (arr.length > 0) {
      nextCircleId = arr[0].id !== 0 ? 0 : arr[arr.length - 1].id + 1;
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i].id + 1 !== arr[i + 1].id) {
          nextCircleId = arr[i].id + 1;
          break;
        }
      }
    }
    return nextCircleId;
  };

  const handleAddCircle = (x: number, y: number) => {
    const nextCircleId = findNextId(circles);
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
    if (!circle) {
      return;
    }
    links.forEach((link) => {
      if (link.from === circle || link.to === circle) {
        setLinks((prevLinks) => prevLinks.filter((l) => l.id !== link.id));
      }
    });
    setCircles((prevCircles) => {
      return prevCircles.filter((c) => c.id !== circle?.id);
    });
  };

  const handleInitialCircle = (x: number, y: number) => {
    const circle = identifyCircle(x, y);

    if (!circle) {
      return;
    }

    const initialCircle = circles.find((c) => c.isInitial);
    if (initialCircle) {
      initialCircle.isInitial = false;
    }

    circle.isInitial = !circle.isInitial;
  };

  const handleFinalState = (x: number, y: number) => {
    const circle = identifyCircle(x, y);
    if (!circle) {
      return;
    }
    circle.isFinal = !circle.isFinal;
  };

  const handleClear = () => {
    setCircles([]);
    setSelectedCircle([]);
    setLinks([]);
    setIsAddingLink(false);
    setLinkStart(null);
    setLinkOffset(null);
    setIsDragging(false);
    setDragStartPosition(null);
    setDragOffset(null);
    setIsSelectingArea(false);
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
    if (isAddingLink && linkStart) {
      if (!linkOffset) {
        setLinkOffset({ x: 0, y: 0 });
      } else {
        const dx = event.clientX - linkStart.position.x;
        const dy = event.clientY - linkStart.position.y;
        setLinkOffset({ x: dx, y: dy });
      }
      return;
    }
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

  const handleMouseUp = () => {
    if (isAddingLink) {
      handleAddLinkEnd();
      return;
    }
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

  const handleAddLinkStart = () => {
    if (selectedCircle.length !== 1) {
      return;
    }
    setLinkStart(selectedCircle[0]);
    setIsAddingLink(true);
  };

  const handleAddLinkEnd = () => {
    if (selectedCircle.length !== 1) {
      return;
    }
    const nextLinkId = findNextId(links);
    if (linkStart) {
      const existingLink = links.find(
        (link) =>
          link.from.id === linkStart.id && link.to.id === selectedCircle[0].id,
      );

      if (!existingLink) {
        setLinks((prevLinks) => [
          ...prevLinks,
          {
            id: nextLinkId,
            from: linkStart,
            to: selectedCircle[0],
            symbols: [],
          },
        ]);
      }
    }
    setLinkStart(null);
    setLinkOffset(null);
    setIsAddingLink(false);
    setShowLabelInput(true);
  };

  const handleRemoveLink = (id: number) => {
    setShowSubMenuState(false);
    setLinks((prevLinks) => prevLinks.filter((link) => link.id !== id));
  };

  const handleAddLabel = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      const newLinks = [...links];
      if (newLinks.length === 0) {
        return;
      }
      if (newLinks[newLinks.length - 1].symbols.length === 0) {
        newLinks[newLinks.length - 1].symbols = [labelInputValue];
      } else {
        newLinks[newLinks.length - 1].symbols.push(labelInputValue);
      }
      setLinks(newLinks);
      setShowLabelInput(false);
      setLabelInputValue('');
    }
  };

  useEffect(() => {
    checkEnabled();
  }, [circles, links, selectedCircle]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showMenu]);

  useEffect(() => {
    if (links.length === 0) {
      return;
    }
    if (showLabelInput && links[links.length - 1].from) {
      const from = links[links.length - 1].from;
      const to = links[links.length - 1].to;
      const fromPosition = from.position;
      const toPosition = to.position;
      const x = (fromPosition.x + toPosition.x) / 2;
      const y = (fromPosition.y + toPosition.y) / 2 - 40;
      setShowLabelInputPosition({ x, y });
    }
  }, [dragOffset]);

  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      setCanvasOffset({ x: rect.left, y: rect.top });
      setCanvasSize({ x: rect.width, y: rect.height });
    }
  }, []);

  const isContextMenuOptionDisabled = !(selectedCircle.length > 0);

  const checkEnabled = () => {
    const initialState = circles.find((circle) => circle.isInitial);
    const finalStates = circles.filter((circle) => circle.isFinal);
    if (!initialState || finalStates.length === 0) {
      setDisabled(true);
      return;
    }
    setDisabled(false);
  };

  const finiteAutomataTest = (input: string) => {
    const initialState = circles.find((circle) => circle.isInitial);
    if (!initialState) {
      return false;
    }
    const finalStates = circles.filter((circle) => circle.isFinal);
    let currentState = initialState;
    const linksMap = new Map<number, Link[]>();
    links.forEach((link) => {
      if (linksMap.has(link.from.id)) {
        linksMap.get(link.from.id)?.push(link);
      } else {
        linksMap.set(link.from.id, [link]);
      }
    });
    for (let i = 0; i < input.length; i++) {
      const symbol = input[i];
      const currentLinks = linksMap.get(currentState.id);
      if (!currentLinks) {
        return false;
      }
      const nextLink = currentLinks.find((link) =>
        link.symbols.includes(symbol),
      );
      if (!nextLink) {
        return false;
      }
      currentState = nextLink.to;
    }
    return finalStates.includes(currentState);
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setEmpty(e.target.value === '');
    setResult(
      e.target.value === '' ? false : finiteAutomataTest(e.target.value),
    );
  };

  const convertToRegularGrammar = () => {
    const initialState = circles.find((circle) => circle.isInitial);
    if (!initialState) {
      return;
    }
    const finalStates = circles.filter((circle) => circle.isFinal);
    const linksMap = new Map<number, Link[]>();
    links.forEach((link) => {
      if (linksMap.has(link.from.id)) {
        linksMap.get(link.from.id)?.push(link);
      } else {
        linksMap.set(link.from.id, [link]);
      }
    });
    const rules: Rule[] = [];
    links.forEach((link) => {
      link.symbols.forEach((symbol) => {
        rules.push({
          left: `Q${link.from.id}`,
          right: symbol === '' ? [''] : [symbol],
        });
      });
    });
    finalStates.forEach((finalState) => {
      if (finalState === initialState) {
        rules.push({
          left: `Q${finalState.id}`,
          right: [''],
        });
      }
    });
    setRules(rules);
  };

  const navigate = useNavigate();

  const handleConvert = () => {
    convertToRegularGrammar();
    navigate('/regular-grammar');
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{
        height: '85vh',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
      onContextMenu={handleContextMenu}
    >
      <Canvas
        width={Math.round(canvasSize.x)}
        height={Math.round(canvasSize.y)}
        theme={props.theme}
        circles={circles.map((c) => {
          return {
            id: c.id,
            position: {
              x: c.position.x - canvasOffset.x,
              y: c.position.y - canvasOffset.y,
            },
            isInitial: c.isInitial,
            isFinal: c.isFinal,
          };
        })}
        circleRadius={CIRCLE_RADIUS}
        selectedCircles={selectedCircle.map((c) => {
          return {
            id: c.id,
            isFinal: c.isFinal,
            isInitial: c.isInitial,
            position: {
              x: c.position.x - canvasOffset.x,
              y: c.position.y - canvasOffset.y,
            },
          };
        })}
        onCanvasDrag={onCanvasDrag}
        dragStartPosition={
          dragStartPosition
            ? {
                x: dragStartPosition.x - canvasOffset.x,
                y: dragStartPosition.y - canvasOffset.y,
              }
            : { x: 0, y: 0 }
        }
        draggingOffset={
          dragOffset
            ? {
                x: dragOffset.x,
                y: dragOffset.y,
              }
            : { x: 0, y: 0 }
        }
        isSelectingArea={isSelectingArea}
        links={links.map((link) => {
          return {
            id: link.id,
            symbols: link.symbols,
            from: {
              id: link.from.id,
              position: {
                x: link.from.position.x - canvasOffset.x,
                y: link.from.position.y - canvasOffset.y,
              },
            },
            to: {
              id: link.to.id,
              position: {
                x: link.to.position.x - canvasOffset.x,
                y: link.to.position.y - canvasOffset.y,
              },
            },
          };
        })}
        isLinking={isAddingLink}
        linkStart={
          linkStart
            ? {
                id: linkStart.id,
                position: {
                  x: linkStart.position.x - canvasOffset.x,
                  y: linkStart.position.y - canvasOffset.y,
                },
              }
            : null
        }
        linkOffset={
          linkOffset
            ? {
                x: linkOffset.x - canvasOffset.x,
                y: linkOffset.y - canvasOffset.y,
              }
            : { x: 0, y: 0 }
        }
      ></Canvas>
      <InputGroup className="mb-3">
        <InputGroup.Text>Teste</InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Vazio"
          value={input}
          onChange={onChangeInput}
          disabled={disabled}
          style={{
            backgroundColor: empty ? '' : result ? 'green' : 'red',
          }}
        />
      </InputGroup>
      <Button onClick={handleConvert} disabled={disabled}>
        Converter para Gramática Regular
      </Button>
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
            onMouseOver={() => setShowSubMenuState(false)}
            onClick={() => handleAddCircle(contextMenu.x, contextMenu.y)}
          >
            Adicionar estado
          </Dropdown.Item>
          <Dropdown.Item
            disabled={isContextMenuOptionDisabled}
            onMouseOver={() => setShowSubMenuState(false)}
            onClick={handleAddLinkStart}
          >
            Adicionar transições
          </Dropdown.Item>
          <Dropdown.Item
            disabled={isContextMenuOptionDisabled}
            onMouseOver={() => setShowSubMenuState(false)}
            onClick={() => handleRemoveCircle(contextMenu.x, contextMenu.y)}
          >
            Remover estado
          </Dropdown.Item>
          <Dropdown.Item
            disabled={isContextMenuOptionDisabled}
            onMouseOver={() => setShowSubMenuState(true)}
            onClick={() => setShowSubMenuState(false)}
          >
            Remover transições
          </Dropdown.Item>
          <Dropdown.Item
            disabled={isContextMenuOptionDisabled}
            onMouseOver={() => setShowSubMenuState(false)}
            onClick={() => handleInitialCircle(contextMenu.x, contextMenu.y)}
          >
            Estado inicial
          </Dropdown.Item>
          <Dropdown.Item
            disabled={isContextMenuOptionDisabled}
            onMouseOver={() => setShowSubMenuState(false)}
            onClick={() => handleFinalState(contextMenu.x, contextMenu.y)}
          >
            Estado final
          </Dropdown.Item>
          <Dropdown.Item
            onMouseOver={() => setShowSubMenuState(false)}
            onClick={handleClear}
          >
            Limpar
          </Dropdown.Item>
        </Dropdown.Menu>
      )}
      {showSubMenuState &&
        selectedCircle.length > 0 &&
        links.filter(
          (link) =>
            link.from === selectedCircle[0] || link.to === selectedCircle[0],
        ).length > 0 && (
          <Dropdown.Menu
            show
            style={{
              position: 'absolute',
              top: contextMenu.y + 100,
              left: contextMenu.x + 175,
              zIndex: 1000,
            }}
          >
            {links
              .filter(
                (link) =>
                  link.from === selectedCircle[0] ||
                  link.to === selectedCircle[0],
              )
              .map((link) => (
                <Dropdown.Item
                  key={link.id}
                  onClick={() => handleRemoveLink(link.id)}
                >{`Q${link.from.id} -> Q${link.to.id}`}</Dropdown.Item>
              ))}
          </Dropdown.Menu>
        )}
      {showLabelInput && (
        <input
          style={{
            position: 'absolute',
            top: showLabelInputPosition?.y,
            left: (showLabelInputPosition?.x || 0) - 50,
            width: 100,
          }}
          type="text"
          value={labelInputValue}
          onChange={(e) => setLabelInputValue(e.target.value)}
          onKeyDown={handleAddLabel}
        />
      )}
    </Container>
  );
};

export default FiniteAutomata;
