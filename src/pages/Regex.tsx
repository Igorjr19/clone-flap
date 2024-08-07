import { useState } from 'react';
import { Container, Form, InputGroup } from 'react-bootstrap';

const checkRegex = (regex: string, input: string) => {
  const re = new RegExp(regex);
  return re.test(input);
};

function Regex() {
  const [regex, setRegex] = useState('');
  const [input, setInput] = useState('');
  const [result, setResult] = useState(false);
  const [empty, setEmpty] = useState(true);

  return (
    <>
      <Container>
        <h1>Testar Expressões Regulares</h1>
        <InputGroup className="mb-3">
          <InputGroup.Text>Expressão Regular</InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Expressão Regular"
            value={regex}
            onChange={(e) => {
              setRegex(e.target.value);
              if (!e.target.value || !input) {
                setEmpty(true);
                return;
              }
              setEmpty(false);
              setResult(checkRegex(e.target.value, input));
            }}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>Texto</InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Texto"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (!regex || !e.target.value) {
                setEmpty(true);
                return;
              }
              setEmpty(false);
              setResult(checkRegex(regex, e.target.value));
            }}
            style={{
              backgroundColor: !empty
                ? result
                  ? 'lightgreen'
                  : 'lightcoral'
                : '',
            }}
          />
        </InputGroup>
      </Container>
    </>
  );
}

export default Regex;
