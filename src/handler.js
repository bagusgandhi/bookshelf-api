const { nanoid } = require('nanoid');
const bookshelf = require('./bookshelf');

// add book Handler
const addBookHandler = (req, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = (pageCount === readPage);

  const newBook = {
    // eslint-disable-next-line max-len
    id, name, year, author, summary, publisher, pageCount, readPage, reading, insertedAt, updatedAt, finished,
  };

  try {
    // jika properti name kosong
    if (!name) {
      const res = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      });

      res.code(400);
      return res;
    }

    // jika value property readPage melebihi pageCount
    if (readPage > pageCount) {
      const res = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      });

      res.code(400);
      return res;
    }

    bookshelf.push(newBook);
    const res = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    res.code(201);
    return res;

    // catch generic error
  } catch (err) {
    const res = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    });

    res.code(500);
    return res;
  }
};

// GET seluruh data book
const getAllBooksHandler = (req, h) => {
  const { name, reading, finished } = req.query;
  const books = bookshelf.map((i) => ({
    id: i.id,
    name: i.name,
    publisher: i.publisher,
  }));

  // query params name
  if (name) {
    // eslint-disable-next-line max-len
    const bookLists = bookshelf.filter((i) => i.name.toLowerCase() === name.toLowerCase());
    const res = h.response({
      status: 'success',
      data: {
        bookLists,
      },
    });

    return res;
  }

  // query params reading
  if (reading) {
    // eslint-disable-next-line max-len
    // eslint-disable-next-line eqeqeq
    const bookLists = bookshelf.filter((i) => i.reading == reading);
    const res = h.response({
      status: 'success',
      data: {
        bookLists,
      },
    });

    return res;
  }

  // query params finished
  if (finished) {
    // eslint-disable-next-line max-len
    // eslint-disable-next-line eqeqeq
    const bookLists = bookshelf.filter((i) => i.finished == finished);
    const res = h.response({
      status: 'success',
      data: {
        bookLists,
      },
    });

    return res;
  }

  return ({
    status: 'success',
    data: {
      books,
    },
  });
};

// GET berdasarkan id
const getBookByIdHandler = (req, h) => {
  const { bookId } = req.params;
  const book = bookshelf.filter((i) => i.id === bookId)[0];

  if (book !== undefined) {
    return ({
      status: 'success',
      data: {
        book,
      },
    });
  }

  const res = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  res.code(404);
  return res;
};

// edit data buku
const editByIdHandler = (req, h) => {
  const { bookId } = req.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.payload;
  const updatedAt = new Date().toISOString();

  const index = bookshelf.findIndex((i) => i.id === bookId);

  const finished = (pageCount === readPage);

  if (!name) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    res.code(400);
    return res;
  }

  if (readPage > pageCount) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    res.code(400);
    return res;
  }

  if (index !== -1) {
    bookshelf[index] = {
      ...bookshelf[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
      finished,
    };

    const res = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    res.code(200);
    return res;
  }

  const res = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  res.code(404);
  return res;
};

// delete data buku
const deleteByIdHandler = (req, h) => {
  const { bookId } = req.params;
  const index = bookshelf.findIndex((i) => i.id === bookId);

  if (index !== -1) {
    bookshelf.splice(index, 1);
    const res = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    res.code(200);
    return res;
  }

  const res = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });

  res.code(404);
  return res;
};

module.exports = {
  addBookHandler, getAllBooksHandler, getBookByIdHandler, editByIdHandler, deleteByIdHandler,
};
