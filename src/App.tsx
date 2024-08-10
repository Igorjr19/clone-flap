import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/header/header';
import Home from './pages/home/home';
import Regex from './pages/Regex';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/regex" element={<Regex />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
