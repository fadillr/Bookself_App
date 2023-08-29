document.addEventListener("DOMContentLoaded", function () {
    const addBookForm = document.getElementById("add-book-form");
    const searchInput = document.getElementById("searchInput");
    const unreadList = document.getElementById("unread-list");
    const readList = document.getElementById("read-list");
    const modal = document.getElementById("modal");
    const confirmDeleteBtn = document.getElementById("confirmDelete");
    const cancelDeleteBtn = document.getElementById("cancelDelete");
  
    let books = [];
  
    // Load books from localStorage on page load
    loadBooks();
  
    addBookForm.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const title = document.getElementById("title").value;
      const author = document.getElementById("author").value;
      const year = parseInt(document.getElementById("year").value);
      const isComplete = document.getElementById("isComplete").checked;
      const id = +new Date();
  
      const book = {
        id,
        title,
        author,
        year,
        isComplete,
      };
  
      books.push(book);
      updateLocalStorage();
      clearInputFields();
      displayBooks();
    });
  
    searchInput.addEventListener("input", function () {
      displayBooks();
    });
  
    unreadList.addEventListener("click", function (e) {
      if (e.target.classList.contains("move-btn")) {
        const bookId = parseInt(e.target.getAttribute("data-id"));
        const book = findBookById(bookId);
        if (book) {
          book.isComplete = true;
          updateLocalStorage();
          displayBooks();
        }
      }
      if (e.target.classList.contains("delete-btn")) {
        const bookId = parseInt(e.target.getAttribute("data-id"));
        const book = findBookById(bookId);
        if (book) {
          showModal(book);
        }
      }
    });
  
    readList.addEventListener("click", function (e) {
      if (e.target.classList.contains("move-btn")) {
        const bookId = parseInt(e.target.getAttribute("data-id"));
        const book = findBookById(bookId);
        if (book) {
          book.isComplete = false;
          updateLocalStorage();
          displayBooks();
        }
      }
      if (e.target.classList.contains("delete-btn")) {
        const bookId = parseInt(e.target.getAttribute("data-id"));
        const book = findBookById(bookId);
        if (book) {
          showModal(book);
        }
      }
    });
  
    confirmDeleteBtn.addEventListener("click", function () {
      const bookId = parseInt(modal.getAttribute("data-id"));
      const book = findBookById(bookId);
      if (book) {
        books = books.filter(item => item.id !== bookId);
        updateLocalStorage();
        displayBooks();
        closeModal();
      }
    });
  
    cancelDeleteBtn.addEventListener("click", function () {
      closeModal();
    });
  
    function clearInputFields() {
      document.getElementById("title").value = "";
      document.getElementById("author").value = "";
      document.getElementById("year").value = "";
      document.getElementById("isComplete").checked = false;
    }
  
    function loadBooks() {
      const storedBooks = JSON.parse(localStorage.getItem("books"));
      if (storedBooks) {
        books = storedBooks;
        displayBooks();
      }
    }
  
    function updateLocalStorage() {
      localStorage.setItem("books", JSON.stringify(books));
    }
  
    function displayBooks() {
      const searchQuery = searchInput.value.toLowerCase();
      unreadList.innerHTML = "";
      readList.innerHTML = "";
  
      books.forEach(function (book) {
        if (book.title.toLowerCase().includes(searchQuery) || book.author.toLowerCase().includes(searchQuery)) {
          const card = createBookCard(book);
          if (book.isComplete) {
            readList.appendChild(card);
          } else {
            unreadList.appendChild(card);
          }
        }
      });
    }
  
    function createBookCard(book) {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <span>${book.title} - ${book.author} (${book.year})</span>
        <button class="move-btn" data-id="${book.id}">${book.isComplete ? "Belum Selesai" : "Selesai"}</button>
        <button class="delete-btn" data-id="${book.id}">Hapus</button>
      `;
      return card;
    }
  
    function findBookById(id) {
      return books.find(book => book.id === id);
    }
  
    function showModal(book) {
      modal.style.display = "block";
      modal.setAttribute("data-id", book.id);
    }
  
    function closeModal() {
      modal.style.display = "none";
      modal.removeAttribute("data-id");
    }
  });
  