import { faCirclePlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

interface Rule {
  left: string;
  right: string[];
}

function RegularGrammar() {
  const startSymbol = 'S';
  const [rules, setRules] = useState<Rule[]>([]);
  const [terminals, setTerminals] = useState<string[]>([]);
  const [test, setTest] = useState('');
  const [result, setResult] = useState(false);

  const clearRules = () => {
    setRules([{ left: 'S', right: [''] }]);
  };

  const addRuleLeft = (leftIndex: number) => {
    const newRules = [...rules];
    newRules.splice(leftIndex + 1, 0, { left: '', right: [''] });
    setRules(newRules);
  };

  const removeRule = (index: number) => {
    const newRules = [...rules];
    newRules.splice(index, 1);
    setRules(newRules);
  };

  const handleRuleChange = (
    leftIndex: number,
    rightIndex: number,
    value: string,
  ) => {
    const newRules = [...rules];
    newRules[leftIndex].right[rightIndex] = value;
    setRules(newRules);
  };

  const handleRuleNameChange = (index: number, value: string) => {
    const newRules = [...rules];
    newRules[index].left = value;
    setRules(newRules);
  };

  const addRuleRight = (leftIndex: number, rightIndex: number) => {
    const newRules = [...rules];
    newRules[leftIndex].right.splice(rightIndex + 1, 0, '');
    setRules(newRules);
  };

  const removeRuleRight = (leftIndex: number, rightIndex: number) => {
    const newRules = [...rules];
    newRules[leftIndex].right.splice(rightIndex, 1);
    setRules(newRules);
  };

  const handleTestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTest(e.target.value);
    setResult(checkTest(e.target.value));
  };

  const checkTest = (test: string) => {
    if (test.match(/[A-Z]/g)) {
      return false;
    }

    const match = (remainingInput: string, currentSymbol: string): boolean => {
      if (remainingInput.length === 0 && currentSymbol === '') {
        return true;
      }

      const matchingRules = rules.filter((rule) => rule.left === currentSymbol);

      for (const rule of matchingRules) {
        for (const production of rule.right) {
          if (production === '' && match(remainingInput, '')) {
            return true;
          }
          if (remainingInput.startsWith(production)) {
            const remaining = remainingInput.slice(production.length);
            if (match(remaining, '')) {
              return true;
            }
          }
          if (production.length > 1) {
            const terminalPart = production.slice(0, -1);
            const nextNonTerminal = production.slice(-1);
            if (
              remainingInput.startsWith(terminalPart) &&
              match(remainingInput.slice(terminalPart.length), nextNonTerminal)
            ) {
              return true;
            }
          }
        }
      }
      return false;
    };

    return match(test, startSymbol);
  };

  const handleRuleInputKeyDown =
    (leftIndex: number, rightIndex: number, left: string, right: string) =>
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      console.log(e.key);
      console.log(leftIndex, rightIndex, left, right);

      if (e.key === 'Enter') {
        addRuleLeft(leftIndex);
      }
      if (e.key === 'Backspace' && right === '' && rightIndex === -1) {
        if (left === '') {
          e.preventDefault();
          removeRule(leftIndex);
        } else {
          return;
        }
        return;
      }
      if (e.key === 'Backspace' && right === '' && rightIndex !== 0) {
        e.preventDefault();
        removeRuleRight(leftIndex, rightIndex);
      }
      if (e.key === '|' && rightIndex !== -1) {
        addRuleRight(leftIndex, rightIndex);
      }
    };

  const handleRuleOnChange =
    (leftIndex: number, rightIndex: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (rightIndex === -1) {
        if (e.target.value.match(/[^A-Z]/g)) {
          e.target.value = e.target.value.replace(/[^A-Z]/g, '');
          return;
        }
        handleRuleNameChange(leftIndex, e.target.value);
        return;
      }
      if (e.target.value.slice(-1) === '|') {
        e.target.value = e.target.value.slice(0, -1);
        return;
      }
      if (e.target.value.match(/[^A-Za-z0-9]/g)) {
        e.target.value = e.target.value.replace(/[^A-Za-z0-9]/g, '');
        return;
      }
      handleRuleChange(leftIndex, rightIndex, e.target.value);
    };

  useEffect(() => {
    if (rules.length === 0) {
      clearRules();
    }
    const newTerminals = rules
      .map((rule) => {
        return rule.right
          .map((right) => {
            const teste = right.match(/[a-z0-9]/g);
            return teste === null ? '' : teste;
          })
          .filter((right) => right !== '')
          .flat();
      })
      .flat()
      .filter((right, index, self) => self.indexOf(right) === index);
    setTerminals(newTerminals);
  }, [rules]);

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
        <Col>
          <Form.Text className="text-muted">→</Form.Text>
        </Col>
        {rules[0] &&
          rules[0].right.map((right, rightIndex) => (
            <Col key={rightIndex}>
              <Form.Control
                id={`input-${0}-${rightIndex}`}
                type="text"
                placeholder="ε"
                value={right}
                onKeyDown={handleRuleInputKeyDown(
                  0,
                  rightIndex,
                  rules[0].left,
                  right,
                )}
                onChange={handleRuleOnChange(0, rightIndex)}
              ></Form.Control>
            </Col>
          ))}
      </Row>
      {rules.map(
        (rule, leftIndex) =>
          leftIndex !== 0 && (
            <Row key={leftIndex}>
              <Col>
                <Form.Control
                  type="text"
                  placeholder=""
                  value={rule.left}
                  onKeyDown={handleRuleInputKeyDown(
                    leftIndex,
                    -1,
                    rule.left,
                    '',
                  )}
                  onChange={handleRuleOnChange(leftIndex, -1)}
                ></Form.Control>
              </Col>
              <Col>
                <Form.Text className="text-muted">→</Form.Text>
              </Col>
              {rule.right.map((right, rightIndex) => (
                <Col key={rightIndex}>
                  <Form.Control
                    id={`input-${leftIndex}-${rightIndex}`}
                    type="text"
                    placeholder="ε"
                    value={right}
                    onKeyDown={handleRuleInputKeyDown(
                      leftIndex,
                      rightIndex,
                      rule.left,
                      right,
                    )}
                    onChange={handleRuleOnChange(leftIndex, rightIndex)}
                  ></Form.Control>
                </Col>
              ))}
              <Col>
                <Button onClick={() => removeRule(leftIndex)}>
                  <FontAwesomeIcon icon={faXmark} />
                </Button>
              </Col>
            </Row>
          ),
      )}
      <Row>
        <Col>
          <Button onClick={() => addRuleLeft(rules.length)}>
            <FontAwesomeIcon icon={faCirclePlus} />
            Clique aqui ou pressione 'Enter' para adicionar uma regra de
            produção
          </Button>
        </Col>
      </Row>
      <Container>
        <h3>Definição da gramática:</h3>
        <p>
          {rules.length &&
            'G = ({' +
              (rules.length > 1 &&
              rules.map((rule) => rule.left).filter((rule) => rule !== '')
                .length > 1
                ? rules
                    .map((rule) => rule.left)
                    .filter((rule) => rule !== '')
                    .join(', ')
                : rules[0].left) +
              '}, {' +
              terminals.join(',') +
              '} P, ' +
              rules[0].left +
              ')'}
          <p />
        </p>
        <p>{'P = {'}</p>
        <ul>
          {rules.map(
            (rule, index) =>
              rule.left !== '' && (
                <li key={index}>
                  {rule.left} →{' '}
                  {rule.right.map((rule) => (rule ? rule : 'ε')).join(' | ')}
                </li>
              ),
          )}
        </ul>
        <p>{'}'}</p>
      </Container>
      <Container>
        <h3>Teste</h3>
        <Form.Control
          type="text"
          placeholder="Vazio"
          value={test}
          onChange={handleTestChange}
          style={{
            backgroundColor: result ? 'lightgreen' : 'lightcoral',
          }}
        />
      </Container>
    </Container>
  );
}

export default RegularGrammar;
