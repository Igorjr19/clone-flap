import { useEffect, useState } from 'react';
import { Container, Nav, Navbar, Row } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(matchMedia.matches ? 'dark' : 'light');
    matchMedia.addEventListener('change', (e) => {
      setTheme(e.matches ? 'dark' : 'light');
    });
    return () => {
      matchMedia.removeEventListener('change', () => {});
    };
  }, []);

  const style = ({ isActive }: { isActive: boolean }) => {
    return {
      textDecoration: 'none',
      color: 'inherit',
      fontWeight: isActive ? 'bold' : 'normal',
      border: 'none',
    };
  };

  return (
    <Container fluid data-bs-theme={theme} style={{ marginTop: '0.5rem' }}>
      <Row>
        <Navbar className="justify-content-center">
          <Nav fill defaultActiveKey={'/'} activeKey={window.location.pathname}>
            <Nav.Item className="ms-3">
              <NavLink to="/" style={style} className="form-control">
                Home
              </NavLink>
            </Nav.Item>
            <Nav.Item className="ms-3">
              <NavLink to="/regex" style={style} className="form-control">
                Regex
              </NavLink>
            </Nav.Item>
            <Nav.Item className="ms-3">
              <NavLink
                to="/regular-grammar"
                style={style}
                className="form-control"
              >
                Gramática Regular
              </NavLink>
            </Nav.Item>
          </Nav>
        </Navbar>
      </Row>
    </Container>
  );
}

export default Header;
