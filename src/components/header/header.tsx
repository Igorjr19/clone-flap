import { Container, Nav, Navbar, Row } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

function Header() {
  const style = ({ isActive }: { isActive: boolean }) => {
    return {
      textDecoration: 'none',
      color: 'inherit',
      fontWeight: isActive ? 'bold' : 'normal',
    };
  };

  return (
    <Container fluid>
      <Row>
        <Navbar>
          <Nav fill defaultActiveKey={'/'} activeKey={window.location.pathname}>
            <Nav.Item className="ms-3">
              <Nav.Link>
                <NavLink to="/" style={style}>
                  Home
                </NavLink>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="ms-3">
              <Nav.Link>
                <NavLink to="/regex" style={style}>
                  Regex
                </NavLink>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="ms-3">
              <Nav.Link>
                <NavLink to="/regular-grammar" style={style}>
                  Gramática Regular
                </NavLink>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar>
      </Row>
    </Container>
  );
}

export default Header;
