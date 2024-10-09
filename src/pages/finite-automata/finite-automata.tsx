import React, { useEffect, useState } from 'react';
import { Container, Dropdown } from 'react-bootstrap';
import Canvas from '../../components/canvas/canvas';

interface FiniteAutomataProps {
  theme: 'light' | 'dark';
}

interface ContextMenu {
  x: number;
  y: number;
}

const FiniteAutomata: React.FC<FiniteAutomataProps> = (
  props: FiniteAutomataProps,
) => {
  const [showMenu, setShowMenu] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenu>({
    x: 0,
    y: 0,
  });

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
      <Canvas width={1920} height={1080} theme={props.theme}></Canvas>
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
          <Dropdown.Item>Adicionar círculo</Dropdown.Item>
          <Dropdown.Item>Adicionar link</Dropdown.Item>
          <Dropdown.Item>Remover elemento</Dropdown.Item>
        </Dropdown.Menu>
      )}
    </Container>
  );
};

export default FiniteAutomata;
