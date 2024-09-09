import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

interface Rule {
  left: string;
  right: string;
}

function RegularGrammar() {
  const [rules, setRules] = useState<Rule[]>([]);

  const clearRules = () => {
    setRules([]);
  };

  const addRule = () => {
    setRules([...rules, { left: '', right: '' }]);
  };

  const removeRule = (index: number) => {
    const newRules = [...rules];
    newRules.splice(index, 1);
    setRules(newRules);
  };

  return (
    <Container>
      <Row>
        <Col>
          <Button variant="outline-danger" onClick={clearRules}>
            Reset
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Control type="text" placeholder="S" disabled></Form.Control>
        </Col>
      </Row>
      {rules.map((rule, index) => (
        <Row key={index}>
          <Col>
            <Form.Control
              type="text"
              placeholder=""
              value={rule.left}
              onChange={(e) => {
                const newRules = [...rules];
                newRules[index].left = e.target.value;
                setRules(newRules);
              }}
            ></Form.Control>
          </Col>
          <Col>
            <Form.Text className="text-muted">→</Form.Text>
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="ε"
              value={rule.right}
              onChange={(e) => {
                const newRules = [...rules];
                newRules[index].right = e.target.value;
                setRules(newRules);
              }}
            ></Form.Control>
          </Col>
          <Col>
            <Button onClick={() => removeRule(index)}>
              <FontAwesomeIcon icon={faXmark} />
            </Button>
          </Col>
        </Row>
      ))}
      <Row>
        <Col>
          <Button onClick={addRule}>Adicionar regra de produção</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default RegularGrammar;
