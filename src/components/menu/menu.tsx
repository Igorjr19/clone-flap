import React from 'react';
import { Link } from 'react-router-dom';
import './menu.css';

const Menu: React.FC = () => {
  return (
    <div className="container">
      <div className="menu">
        <h1>Menu</h1>
        <ul>
          <li>
            <Link to="/" className="link-style">
              Home
            </Link>
          </li>
          <li>
            <Link to="/regex" className="link-style">
              Regex
            </Link>
          </li>
        </ul>
        <p>Ígor José Rodrigues</p>
        <p>Matheus Augustho de Moura Nazaro</p>
      </div>
    </div>
  );
};

export default Menu;
