const books = [];
const bookChanged = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

document.addEventListener("DOMContentLoaded", function () {
    const submitForm = document.getElementById("inputBook");
    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });
});

//membuat ID
function generateId() {
    return +new Date();
}

//membuat object
function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year: Number(year),
        isCompleted
    }
}

// menambahkan buku
function addBook() {
    const inputBookTitle = document.getElementById("inputBookTitle").value;
    const inputBookAuthor = document.getElementById("inputBookAuthor").value;
    const inputBookYear = document.getElementById("inputBookYear").value;
    const inputBookIsCompleted = document.getElementById("inputBookIsComplete");
    if (inputBookIsCompleted.checked == true) {
        const book = generateBookObject(generateId(), inputBookTitle, inputBookAuthor, inputBookYear, true);
        books.push(book);
    } else {
        const book = generateBookObject(generateId(), inputBookTitle, inputBookAuthor, inputBookYear, false);
        books.push(book);
    }

    document.dispatchEvent(new Event(bookChanged));
    saveData();
}

//mengganti tulisan pada button submit
function checkFinish() {
    const checkBox = document.getElementById("inputBookIsComplete");
    const unread = document.getElementById("unread");
    const read = document.getElementById("read");
    if (checkBox.checked == true) {
        read.style.display = "inline";
        unread.style.display = "none";
    } else {
        unread.style.display = "inline";
        read.style.display = "none";
    }
}

// membuat Item Book
function makeBook(bookObject) {
    const textInputBookTitle = document.createElement("h2");
    textInputBookTitle.innerText = bookObject.title;

    const textInputBookAuthor = document.createElement("p");
    textInputBookAuthor.innerText = "Penulis : " + bookObject.author;

    const textInputBookYear = document.createElement("p");
    textInputBookYear.innerText = "Tahun : " + bookObject.year;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner")
    textContainer.append(textInputBookTitle, textInputBookAuthor, textInputBookYear);

    const container = document.createElement("div");
    container.classList.add("item")
    container.append(textContainer);
    container.setAttribute("id", `book-${bookObject.id}`);

    if (bookObject.isCompleted) {
        const undoButton = document.createElement("button");
        undoButton.classList.add("undo-button");
        undoButton.addEventListener("click", function () {
            undoTaskFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");
        trashButton.addEventListener("click", function () {
            removeTaskFromCompleted(bookObject.id);
        });

        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement("button");
        checkButton.classList.add("check-button");
        checkButton.addEventListener("click", function () {
            addTaskToCompleted(bookObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");
        trashButton.addEventListener("click", function () {
            removeTaskFromCompleted(bookObject.id);
        });

        container.append(checkButton, trashButton);
    }
    return container;
}

// menampilkan Book yang tersimpan pada array.
document.addEventListener(bookChanged, function () {
    const uncompleteBookshelfList = document.getElementById("uncompleteBookshelfList");
    uncompleteBookshelfList.innerHTML = "";

    const completeBookshelfList = document.getElementById("completeBookshelfList");
    completeBookshelfList.innerHTML = "";

    for (bookItem of books) {
        const bookElement = makeBook(bookItem);

        if (bookItem.isCompleted == false)
            uncompleteBookshelfList.append(bookElement);

        else
            completeBookshelfList.append(bookElement);
    }
    console.log(books);
});

// check button bisa berfungsi
function addTaskToCompleted(bookId) {

    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(bookChanged));
    saveData();
}

function findBook(bookId) {
    for (bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem
        }
    }
    return null
}

// menghapus book
function removeTaskFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);

    document.dispatchEvent(new Event(bookChanged));
    saveData();
}

// mengembalikan book
function undoTaskFromCompleted(bookId) {

    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;


    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(bookChanged));
    saveData();
}

function findBookIndex(bookId) {
    for (index in books) {
        if (books[index].id === bookId) {
            return index
        }
    }
    return -1
}

//fitur search book
function searchBook() {
    const searchBookTitle = document.getElementById("searchBookTitle");
    const filterBook = searchBookTitle.value.toLowerCase();
    const bookItem = document.getElementsByClassName("item");

    for (let i = 0; i < bookItem.length; i++) {
        const title = bookItem[i].getElementsByTagName("h2")[0];
        if (title.innerHTML.toLowerCase().indexOf(filterBook) > -1) {
            bookItem[i].style.display = "";
        } else {
            bookItem[i].style.display = "none";
        }
    }
}

// penyimpanan data
function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(bookChanged));
}

document.addEventListener("DOMContentLoaded", function () {
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});