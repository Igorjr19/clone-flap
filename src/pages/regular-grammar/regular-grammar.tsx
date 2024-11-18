import {
  faArrowRight,
  faCirclePlus,
  faXmarkCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Accordion, Button, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Circle, Link } from '../finite-automata/finite-automata';

export interface Rule {
  left: string;
  right: string[];
}

interface IRegularGrammar {
  rules: Rule[];
  setRules: React.Dispatch<React.SetStateAction<Rule[]>>;
  setCircles: React.Dispatch<React.SetStateAction<Circle[]>>;
  setLinks: React.Dispatch<React.SetStateAction<Link[]>>;
  setRegex: React.Dispatch<React.SetStateAction<string>>;
}

function RegularGrammar({
  rules,
  setRules,
  setCircles,
  setLinks,
  setRegex,
}: IRegularGrammar) {
  const startSymbol = rules[0]?.left || 'S';
  const [terminals, setTerminals] = useState<string[]>([]);
  const [test, setTest] = useState('');
  const [result, setResult] = useState(true);
  const [currentInputIndex, setCurrentInputIndex] = useState<{
    leftIndex: number;
    rightIndex: number;
  }>({ leftIndex: 0, rightIndex: 0 });

  const clearRules = () => {
    setRules([{ left: 'S', right: [''] }]);
  };

  const handleExample = () => {
    setRules([
      { left: 'S', right: ['aA'] },
      { left: 'A', right: ['aB'] },
      { left: 'B', right: ['aC'] },
      { left: 'C', right: ['aC', 'bC', 'bD'] },
      { left: 'D', right: ['bE'] },
      { left: 'E', right: ['b'] },
    ]);
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
    e.target.value = e.target.value.replace(/[^a-z0-9]/g, '');
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
      if (e.key === 'Enter') {
        addRuleLeft(leftIndex);
        setCurrentInputIndex({ leftIndex: leftIndex + 1, rightIndex: -1 });
      }
      if (e.key === 'Backspace' && right === '' && rightIndex === -1) {
        if (left === '') {
          e.preventDefault();
          removeRule(leftIndex);
          setCurrentInputIndex({ leftIndex: leftIndex - 1, rightIndex: -1 });
        } else {
          return;
        }
        return;
      }
      if (e.key === 'Backspace' && right === '' && rightIndex !== 0) {
        e.preventDefault();
        removeRuleRight(leftIndex, rightIndex);
        setCurrentInputIndex({ leftIndex, rightIndex: rightIndex - 1 });
      }
      if (e.key === '|' && rightIndex !== -1) {
        addRuleRight(leftIndex, rightIndex);
        setCurrentInputIndex({ leftIndex, rightIndex: rightIndex + 1 });
      }
      if (
        e.key === 'ArrowRight' &&
        (e.currentTarget.selectionStart === right.length ||
          e.currentTarget.selectionStart === right.length + 1)
      ) {
        setCurrentInputIndex({ leftIndex, rightIndex: rightIndex + 1 });
      }
      if (e.key === 'ArrowLeft' && e.currentTarget.selectionStart === 0) {
        setCurrentInputIndex({ leftIndex, rightIndex: rightIndex - 1 });
      }
      if (e.key === 'ArrowUp' && rules[leftIndex - 1]) {
        setCurrentInputIndex({ leftIndex: leftIndex - 1, rightIndex });
      }
      if (e.key === 'ArrowDown' && rules[leftIndex + 1]) {
        setCurrentInputIndex({ leftIndex: leftIndex + 1, rightIndex });
      }
    };

  const handleRuleOnChange =
    (leftIndex: number, rightIndex: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (rightIndex === -1) {
        if (e.target.value.match(/[^A-Z]/g)) {
          if (e.target.value.match(/[a-z]/g)) {
            e.target.value = e.target.value.replace(
              /[a-z]/g,
              e.target.value.toUpperCase(),
            );
          } else {
            e.target.value = e.target.value.replace(/[^A-Z]/g, '');
            return;
          }
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
    const input = document.getElementById(
      `input:${currentInputIndex.leftIndex}:${currentInputIndex.rightIndex}`,
    ) as HTMLInputElement;
    if (input) {
      input.focus();
    }
  }, [currentInputIndex]);

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
    setResult(checkTest(test));
  }, [rules]);

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

  const green = theme === 'light' ? 'lightgreen' : 'darkgreen';
  const red = theme === 'light' ? 'lightcoral' : 'darkred';

  const getInputWidth = (value: string) => {
    const span = document.createElement('span');
    span.style.visibility = 'hidden';
    span.style.position = 'absolute';
    span.style.whiteSpace = 'pre';
    span.textContent = value || 'ε';
    document.body.appendChild(span);
    const width = span.offsetWidth;
    document.body.removeChild(span);
    return width + 45; // Add some padding
  };

  const convertRulesToRegex = () => {
    const regexParts: string[] = [];

    const buildRegex = (
      symbol: string,
      visited: Set<string> = new Set(),
    ): string => {
      if (visited.has(symbol)) {
        return '';
      }
      visited.add(symbol);

      const matchingRules = rules.filter((rule) => rule.left === symbol);
      const parts: string[] = [];

      for (const rule of matchingRules) {
        for (const production of rule.right) {
          if (production === '') {
            parts.push('');
          } else if (production.length === 1) {
            parts.push(production);
          } else {
            const terminalPart = production.slice(0, -1);
            const nextNonTerminal = production.slice(-1);
            parts.push(
              `${terminalPart}${buildRegex(nextNonTerminal, new Set(visited))}`,
            );
          }
        }
      }

      return parts.length > 1 ? `(${parts.join('|')})` : parts[0];
    };

    regexParts.push(buildRegex(startSymbol));

    return regexParts.join('|');
  };

  const isValidRegex = (regex: string) => {
    if (regex.includes('undefined')) {
      return false;
    }
    try {
      new RegExp(regex);
      return true;
    } catch (e) {
      return false;
    }
  };

  const navigate = useNavigate();

  const handleConvertToRegex = () => {
    const regex = convertRulesToRegex();

    if (regex) {
      if (!isValidRegex(regex)) {
        // TODO - Alterar para um modal
        alert(
          'A gramática não pode ser convertida para uma expressão regular.',
        );
        return;
      }
      setRegex(regex);
      navigate('/regex');
    }
  };

  const convertRulesToFiniteAutomata = () => {
    const states: Circle[] = [];
    const links: Link[] = [];
    const stateMap: { [key: string]: Circle } = {};
    let nextStateId = 0;

    const getState = (name: string): Circle => {
      if (!stateMap[name]) {
        const newState: Circle = {
          id: nextStateId++,
          position: { x: Math.random() * 500, y: Math.random() * 500 },
          isInitial: name === 'S',
          isFinal: false,
        };
        stateMap[name] = newState;
        states.push(newState);
      }
      return stateMap[name];
    };

    rules.forEach((rule) => {
      const fromState = getState(rule.left);
      rule.right.forEach((production) => {
        const symbol = production[0];
        const toStateName = production.length > 1 ? production[1] : '';
        const toState = toStateName ? getState(toStateName) : fromState;

        if (!toStateName) {
          fromState.isFinal = true;
        }

        const existingLink = links.find(
          (link) => link.from.id === fromState.id && link.to.id === toState.id,
        );

        if (existingLink) {
          existingLink.symbols.push(symbol);
        } else {
          links.push({
            id: links.length,
            from: fromState,
            to: toState,
            symbols: [symbol],
          });
        }
      });
    });
    setCircles(states);
    setLinks(links);
  };

  const handleConvertToFiniteAutomata = () => {
    convertRulesToFiniteAutomata();
    navigate('/FiniteAutomata');
  };

  return (
    <Container style={{ padding: '5vh 0' }} data-bs-theme={theme}>
      <h1>Gramática Regular</h1>
      <Accordion style={{ width: '35vw' }}>
        <Accordion.Header>Instruções</Accordion.Header>
        <Accordion.Body>
          <ul>
            <li>O símbolo inicial será sempre S.</li>
            <li>Aperte "|" para adicionar outra regra para um não-terminal.</li>
            <li>Aperte "Enter" para adicionar uma nova regra de produção.</li>
            <li>Um input vazio representa o símbolo ε (vazio).</li>
            <li>
              Regras de produção com o não-terminal vazio serão desconsideradas.
            </li>
            <li>
              No momento, para os terminais, utilize apenas letras minúsculas e
              números.
            </li>
            <li>Para os não-terminais utilize letras maiúsculas.</li>
          </ul>
        </Accordion.Body>
      </Accordion>
      <Container style={{ padding: '1vh 0', display: 'flex', gap: '1vw' }}>
        <Button
          style={{
            width: '5vw',
          }}
          variant="outline-danger"
          onClick={clearRules}
        >
          Reset
        </Button>
        <Button variant="outline-success" onClick={handleExample}>
          Exemplo
        </Button>
      </Container>
      <Container style={{ padding: '1vh 0', display: 'flex', gap: '1vw' }}>
        <Button variant="outline-primary" onClick={handleConvertToRegex}>
          Converter para RegEx
        </Button>
        <Button
          variant="outline-primary"
          onClick={handleConvertToFiniteAutomata}
        >
          Converter para Autômato Finito
        </Button>
      </Container>
      {rules.map((rule, leftIndex) => (
        <Container
          key={leftIndex}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '1vh 0',
            gap: '1vw',
          }}
        >
          <Form.Control
            style={{ width: '5vw', textAlign: 'center' }}
            type="text"
            placeholder=""
            value={rule.left}
            onChange={handleRuleOnChange(leftIndex, -1)}
            onKeyDown={handleRuleInputKeyDown(
              leftIndex,
              -1,
              rule.left,
              rule.right[0],
            )}
            id={`input:${leftIndex}:-1`}
            disabled={leftIndex === 0}
            autoComplete="off"
          />
          <FontAwesomeIcon icon={faArrowRight} />
          {rule.right.map((right, rightIndex) => (
            <React.Fragment key={rightIndex}>
              <Form.Control
                style={{ maxWidth: `${getInputWidth(right)}px` }}
                type="text"
                placeholder="ε"
                value={right}
                onChange={handleRuleOnChange(leftIndex, rightIndex)}
                onKeyDown={handleRuleInputKeyDown(
                  leftIndex,
                  rightIndex,
                  rule.left,
                  right,
                )}
                id={`input:${leftIndex}:${rightIndex}`}
                key={rightIndex}
                autoComplete="off"
              />
              {rightIndex < rule.right.length - 1 && <span>|</span>}
            </React.Fragment>
          ))}

          {leftIndex > 0 && (
            <Button
              variant="outline-danger"
              onClick={() => {
                removeRule(leftIndex);
                setCurrentInputIndex({
                  leftIndex: leftIndex - 1,
                  rightIndex: -1,
                });
              }}
            >
              <FontAwesomeIcon icon={faXmarkCircle} />
            </Button>
          )}
        </Container>
      ))}
      <Container style={{ padding: '1vh 0' }}>
        <Button
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1vw',
          }}
          onClick={() => {
            setCurrentInputIndex({ leftIndex: rules.length, rightIndex: -1 });
            addRuleLeft(rules.length);
          }}
        >
          <FontAwesomeIcon icon={faCirclePlus} />
          <span>Adicionar regra de produção</span>
        </Button>
      </Container>
      <Container style={{ padding: '1vh 0 ' }}>
        <h3>Definição da Gramática:</h3>
        <Container style={{ padding: '0', fontFamily: 'monospace' }}>
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
          <br />
          {'P = {'}
          <ul
            style={{
              listStyleType: 'none',
              margin: '0',
              padding: '0 1vw',
            }}
          >
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
      </Container>
      <Container style={{ padding: '0' }}>
        <h3>Testar cadeias pertencentes a gramática:</h3>
        <Form.Control
          type="text"
          placeholder="Vazio"
          value={test}
          onChange={handleTestChange}
          style={{
            backgroundColor: result ? green : red,
          }}
        />
      </Container>
    </Container>
  );
}

export default RegularGrammar;
