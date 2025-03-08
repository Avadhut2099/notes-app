// Selecting necessary elements
const addBox = document.querySelector(".add-box"),
  popupBox = document.querySelector(".popup-box"),
  popupTitle = document.querySelector(".popup-box header p"),
  closeIcon = document.querySelector(".popup-box header i"),
  titleTag = document.querySelector(".popup-box input"),
  descTag = document.querySelector(".popup-box textarea"),
  addBtn = document.querySelector(".popup-box button");

// Month names for date formatting
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// notes from localStorage
let notes = JSON.parse(localStorage.getItem("notes")) || [],
  isUpdate = false,
  updateId = null;

// Open popup for adding a new note
addBox.addEventListener("click", () => {
  popupTitle.innerText = "Add a new Note";
  addBtn.innerText = "Add Note";
  popupBox.classList.add("show");
  document.body.style.overflow = "hidden";
  titleTag.focus();
});

// Close popup and reset fields
closeIcon.addEventListener("click", () => resetPopup());

function resetPopup() {
  isUpdate = false;
  titleTag.value = descTag.value = "";
  popupBox.classList.remove("show");
  document.body.style.overflow = "auto";
}

// Display notes from localStorage
function showNotes() {
  document.querySelectorAll(".note").forEach((note) => note.remove());
  notes.forEach((note, index) => {
    let liTag = document.createElement("li");
    liTag.classList.add("note");
    liTag.innerHTML = `
            <div class="details">
                <p>${note.title}</p>
                <span>${note.description.replaceAll("\n", "<br/>")}</span>
            </div>
            <div class="bottom-content">
                <span>${note.date}</span>
                <div class="settings">
                    <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                    <ul class="menu">
                        <li onclick="editNote(${index})"><i class="uil uil-pen"></i>Edit</li>
                        <li onclick="deleteNote(${index})"><i class="uil uil-trash"></i>Delete</li>
                    </ul>
                </div>
            </div>`;
    addBox.after(liTag);
  });
}

// Show/hide menu for a note
function showMenu(element) {
  let menu = element.parentElement;
  menu.classList.add("show");
  document.addEventListener(
    "click",
    (e) => {
      if (e.target !== element) menu.classList.remove("show");
    },
    { once: true }
  );
}

// Delete a note
function deleteNote(index) {
  if (confirm("Are you sure you want to delete this note?")) {
    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
  }
}

// Edit a note
function editNote(index) {
  let note = notes[index];
  updateId = index;
  isUpdate = true;

  titleTag.value = note.title;
  descTag.value = note.description.replaceAll("<br/>", "\n");

  popupTitle.innerText = "Update Note";
  addBtn.innerText = "Update Note";
  popupBox.classList.add("show");
  document.body.style.overflow = "hidden";
}

// Add or update a note
addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let title = titleTag.value.trim(),
    description = descTag.value.trim();

  if (title || description) {
    let currentDate = new Date();
    let noteDate = `${
      months[currentDate.getMonth()]
    } ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

    let noteData = { title, description, date: noteDate };

    if (isUpdate) notes[updateId] = noteData;
    else notes.push(noteData);

    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
    resetPopup();
  }
});

showNotes();
