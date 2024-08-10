import * as authors from '../../authors.json';

function Home() {
  console.log(authors);

  return (
    <div>
      <h1>Home</h1>
      <p>
        Trabalho desenvolvido para a disciplina de Linguagens Formais e Teoria
        da Computação. <br />
        Autores:
      </p>
      <ul>
        {authors.authors.map((author) => (
          <li key={author.name}>{author.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
