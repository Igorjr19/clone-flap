import { useState } from 'react';
import { Container, Form, InputGroup } from 'react-bootstrap';
import { checkRegex } from '../../util/regex/regex';

function Regex() {
  const [regex, setRegex] = useState('');
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [result1, setResult1] = useState(false);
  const [result2, setResult2] = useState(false);
  const [empty, setEmpty] = useState(true);

  const onChangeRegex = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmpty(e.target.value === '');
    setRegex(e.target.value);
    setResult1(checkRegex(e.target.value, input1));
    setResult2(checkRegex(e.target.value, input1));
  };

  const onChangeInput =
    (
      setInput: React.Dispatch<React.SetStateAction<string>>,
      setResult: React.Dispatch<React.SetStateAction<boolean>>,
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
      setResult(checkRegex(regex, e.target.value));
    };

  return (
    <>
      <Container>
        <InputGroup className="mb-3">
          <InputGroup.Text>Expressão Regular</InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Expressão Regular"
            value={regex}
            onChange={onChangeRegex}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>Texto 1</InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Vazio"
            value={input1}
            onChange={onChangeInput(setInput1, setResult1)}
            style={{
              backgroundColor: empty
                ? ''
                : result1
                  ? 'lightgreen'
                  : 'lightcoral',
            }}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>Texto 2</InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Vazio"
            value={input2}
            onChange={onChangeInput(setInput2, setResult2)}
            style={{
              backgroundColor: empty
                ? ''
                : result2
                  ? 'lightgreen'
                  : 'lightcoral',
            }}
          />
        </InputGroup>
      </Container>
    </>
  );
}

export default Regex;
