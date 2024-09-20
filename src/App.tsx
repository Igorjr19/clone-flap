import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Header from './components/header/header';
import Home from './pages/home/Home';
import Regex from './pages/regex/Regex';
import RegularGrammar from './pages/regular-grammar/regular-grammar';

function App() {
  return (
    <HashRouter>
      <Header />
      <Container fluid className="min-vh-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/regex" element={<Regex />} />
          <Route path="/regular-grammar" element={<RegularGrammar />} />
        </Routes>
      </Container>
    </HashRouter>
  );
}

export default App;
