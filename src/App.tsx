import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/header/header';
import Home from './pages/home/Home';
import Regex from './pages/regex/Regex';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Container fluid className="min-vh-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/regex" element={<Regex />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
