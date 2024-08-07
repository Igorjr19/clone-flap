import { Link } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/regex">Regex</Link>
          </li>
        </ul>
      </div>
    </>
  );
}

export default App;
