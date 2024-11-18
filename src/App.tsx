import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { useApp } from './app.hook';
import Header from './components/header/header';
import FiniteAutomata from './pages/finite-automata/finite-automata';
import Home from './pages/home/home';
import Regex from './pages/regex/regex';
import RegularGrammar from './pages/regular-grammar/regular-grammar';

function App() {
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

  useEffect(() => {
    document.body.dataset.bsTheme = theme;
  }, [theme]);

  const {
    regex,
    setRegex,
    rules,
    setRules,
    circles,
    setCircles,
    links,
    setLinks,
  } = useApp();

  return (
    <HashRouter>
      <Header />
      <Container fluid className="min-100" data-bs-theme={theme}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/regex"
            element={<Regex regex={regex} setRegex={setRegex} />}
          />
          <Route
            path="/regular-grammar"
            element={
              <RegularGrammar
                rules={rules}
                setRules={setRules}
                setCircles={setCircles}
                setLinks={setLinks}
                setRegex={setRegex}
              />
            }
          />
          <Route
            path="/FiniteAutomata"
            element={
              <FiniteAutomata
                theme={theme}
                circles={circles}
                setCircles={setCircles}
                links={links}
                setLinks={setLinks}
                setRules={setRules}
                setRegex={setRegex}
              />
            }
          />
        </Routes>
      </Container>
    </HashRouter>
  );
}

export default App;
