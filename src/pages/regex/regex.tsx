import { useEffect, useState } from 'react';
import { Button, Container, Form, InputGroup, Stack } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Rule } from '../regular-grammar/regular-grammar';

interface IRegex {
  regex: string;
  setRegex: React.Dispatch<React.SetStateAction<string>>;
  setRules: React.Dispatch<React.SetStateAction<Rule[]>>;
}

function Regex({ regex, setRegex, setRules }: IRegex) {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [result1, setResult1] = useState(false);
  const [result2, setResult2] = useState(false);
  const [empty, setEmpty] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const checkRegex = (regex: string, input: string) => {
    const re = new RegExp(regex);
    return re.test(input);
  };

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

  const green = theme === 'light' ? 'lightgreen' : 'darkgreen';
  const red = theme === 'light' ? 'lightcoral' : 'darkred';

  useEffect(() => {
    setRegex(regex);
    setResult1(checkRegex(regex, input1));
    setResult2(checkRegex(regex, input2));
    setEmpty(regex === '');
  }, [regex, input1, input2]);

  const convertToRegularGrammar = (regex: string) => {
    return [
      {
        left: 'S',
        right: [''],
      },
    ];
  };

  const navigate = useNavigate();

  const handleConvertToRegularGrammar = () => {
    const rules = convertToRegularGrammar(regex);
    setRules(rules);
    navigate('/regular-grammar');
  };

  return (
    <Container>
      <h1>Expressão Regular</h1>
      <Stack gap={0}>
        <div className="p-2">
          <InputGroup className="mb-3">
            <InputGroup.Text>Expressão Regular</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Exemplo: ^[A-Za-z0-9]+$"
              value={regex}
              onChange={onChangeRegex}
            />
          </InputGroup>
        </div>
        <div className="p-2">
          <InputGroup className="mb-3">
            <InputGroup.Text>Texto 1</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Vazio"
              value={input1}
              onChange={onChangeInput(setInput1, setResult1)}
              style={{
                backgroundColor: empty ? '' : result1 ? green : red,
              }}
            />
          </InputGroup>
        </div>
        <div className="p-2">
          <InputGroup className="mb-3">
            <InputGroup.Text>Texto 2</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Vazio"
              value={input2}
              onChange={onChangeInput(setInput2, setResult2)}
              style={{
                backgroundColor: empty ? '' : result2 ? green : red,
              }}
            />
          </InputGroup>
        </div>
        <Button onClick={handleConvertToRegularGrammar} disabled={regex === ''}>
          Converter para Gramática Regular
        </Button>
      </Stack>
    </Container>
  );
}

export default Regex;
