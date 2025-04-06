import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

type Note = {
  id: number;
  title: string;
  author: {
    name: string;
    email: string;
  };
  content: string;
};

const NOTES_URL = 'http://localhost:3001/notes';
const POSTS_PER_PAGE = 10;

function getPageButtons(activePage: number, totalPages: number): number[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (activePage < 3) {
    return [1, 2, 3, 4, 5];
  }

  if (activePage >= 3 && activePage <= totalPages - 2) {
    return [
      activePage - 2,
      activePage - 1,
      activePage,
      activePage + 1,
      activePage + 2,
    ].filter((page) => page >= 1 && page <= totalPages);
  }

  return [
    totalPages - 4,
    totalPages - 3,
    totalPages - 2,
    totalPages - 1,
    totalPages,
  ];
}

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activePage, setActivePage] = useState(1);
  const [totalNotes, setTotalNotes] = useState(0);

  useEffect(() => {
    axios
      .get(NOTES_URL, {
        params: {
          _page: activePage,
          _limit: POSTS_PER_PAGE,
        },
      })
      .then((response) => {
        setNotes(response.data);
        const totalCount = parseInt(response.headers['x-total-count']);
        setTotalNotes(totalCount);
      })
      .catch((error) => {
        console.error('Error fetching notes:', error);
      });
  }, [activePage]);

  const totalPages = Math.ceil(totalNotes / POSTS_PER_PAGE);
  const pageButtons = getPageButtons(activePage, totalPages);

  return (
    <div>
      <h1>Notes</h1>
      {notes.map((note) => (
        <div key={note.id} id={note.id.toString()} className="note">
          <h2>{note.title}</h2>
          <small>By {note.author.name}</small>
          <br />
          <small>{note.author.email}</small>
          <br />
          {note.content}
        </div>
      ))}
      <br/>
      <div style={{ marginTop: '1rem' }}>
        <button
          name="first"
          onClick={() => setActivePage(1)}
          disabled={activePage === 1}
        >
          First
        </button>

        <button
          name="previous"
          onClick={() => setActivePage((p) => Math.max(1, p - 1))}
          disabled={activePage === 1}
        >
          Previous
        </button>

        {pageButtons.map((page) => (
          <button
            key={page}
            name={`page-${page}`}
            onClick={() => setActivePage(page)}
            disabled={page === activePage}
            style={{ fontWeight: page === activePage ? 'bold' : 'normal' }}
          >
            {page}
          </button>
        ))}

        <button
          name="next"
          onClick={() => setActivePage((p) => Math.min(totalPages, p + 1))}
          disabled={activePage === totalPages}
        >
          Next
        </button>

        <button
          name="last"
          onClick={() => setActivePage(totalPages)}
          disabled={activePage === totalPages}
        >
          Last
        </button>
      </div>
    </div>
  );
}

export default App;
