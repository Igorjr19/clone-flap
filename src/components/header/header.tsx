import { Container, Nav, Navbar, Row } from 'react-bootstrap';

function Header() {
  return (
    <Container fluid>
      <Row>
        <Navbar>
          <Nav fill defaultActiveKey={'/'} activeKey={window.location.pathname}>
            <Nav.Item className="ms-3">
              <Nav.Link href="/">Home</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/regex">Regex</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/regular-grammar">Gramática Regular</Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar>
      </Row>
    </Container>
  );
}

export default Header;
