import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';

function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const authors = [
    'Ígor José Rodrigues',
    'Lucas Vinícius de Carvalho Ikeda',
    'Matheus Augustho de Moura Nazaro',
  ];

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

  return (
    <Container className="vh-100 pt-5" data-bs-theme={theme}>
      <h1 className="display-1 text-center">
        Trabalho desenvolvido para a disciplina de Linguagens Formais e Teoria
        da Computação
      </h1>
      <br />
      <br />
      <h2 className="display-3 text-center">Autores:</h2>
      {authors.map((author) => (
        <h3 className="display-5 text-center" key={author}>
          {author}
        </h3>
      ))}
    </Container>
  );
}

export default Home;
