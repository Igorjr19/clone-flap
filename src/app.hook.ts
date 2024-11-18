import { useState } from 'react';
import { Circle, Link } from './pages/finite-automata/finite-automata';
import { Rule } from './pages/regular-grammar/regular-grammar';

export const useApp = () => {
  const [regex, setRegex] = useState<string>('');
  const [rules, setRules] = useState<Rule[]>([]);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [links, setLinks] = useState<Link[]>([]);

  return {
    regex,
    setRegex,
    rules,
    setRules,
    circles,
    setCircles,
    links,
    setLinks,
  };
};
