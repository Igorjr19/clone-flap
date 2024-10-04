import { dia, shapes } from '@joint/core';
import React, { useEffect, useState } from 'react';
import { Container, Dropdown } from 'react-bootstrap';
import { useDrag } from './hooks/useDrag';
import { useInitializePaper } from './hooks/useInitializePaper';
import { useZoom } from './hooks/useZoom';

interface FiniteAutomataProps {
  theme: 'light' | 'dark';
}

const FiniteAutomata: React.FC<FiniteAutomataProps> = (
  props: FiniteAutomataProps,
) => {
  const [selected, setSelected] = useState<dia.CellView | null>(null);
  const [statesIndexes, setStatesIndexes] = useState<number[]>([0]);

  const { theme } = props;
  const namespace = shapes;
  const { paperRef, paper, addCircle } = useInitializePaper(
    namespace,
    setSelected,
    statesIndexes,
    setStatesIndexes,
  );
  useZoom(paper);
  const { isDragging, ctrlDown } = useDrag(paper, paperRef);

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  const [showMenu, setShowMenu] = useState(false);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setShowMenu(true);
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleAddCircle = () => {
    addCircle(contextMenu.x, contextMenu.y);
    setShowMenu(false);
  };

  const handleAddLink = () => {
    // Logic to add link between selected elements
    setShowMenu(false);
  };

  const handleClickOutside = () => {
    if (showMenu) {
      setShowMenu(false);
    }
  };

  const handleRemoveElement = () => {
    if (selected) {
      const index = parseInt(
        selected.model?.attributes?.attrs?.label?.text?.slice(1) as string,
      );
      setStatesIndexes(statesIndexes.filter((i) => i !== index) || []);
      selected.remove();
    }
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
      <div
        ref={paperRef}
        style={{
          width: '85%',
          height: '100%',
          cursor: isDragging ? (ctrlDown ? 'grabbing' : 'grab') : 'default',
          border: `0.25rem solid ${theme === 'dark' ? '#343A40' : '#E9ECEF'}`,
          borderRadius: 10,
        }}
      />
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
          <Dropdown.Item onClick={handleAddCircle}>
            Adicionar círculo
          </Dropdown.Item>
          <Dropdown.Item onClick={handleAddLink}>Adicionar link</Dropdown.Item>
          <Dropdown.Item onClick={handleRemoveElement}>
            Remover elemento
          </Dropdown.Item>
        </Dropdown.Menu>
      )}
    </Container>
  );
};

export default FiniteAutomata;
