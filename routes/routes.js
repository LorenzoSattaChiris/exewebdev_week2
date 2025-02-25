// routes/routes.js

// Import required packages
const express = require("express");
const router = express.Router();

// Helper function to get notes from cookies.
// If the cookie doesn't exist or is invalid, we return an empty array.
function getNotes(req) {
  try {
    return req.cookies.notes ? JSON.parse(req.cookies.notes) : [];
  } catch (err) {
    return [];
  }
}

// Helper function to save notes to a cookie.
// Cookies must be a string so we JSON.stringify our notes array.
function saveNotes(res, notes) {
  // Set cookie "notes" with the stringified notes.
  // Here we set httpOnly to false so that client-side JS can read it if needed (demo purposes).
  res.cookie("notes", JSON.stringify(notes), { httpOnly: false });
}

/* ---------------------------
   ROUTES
-----------------------------*/

// GET "/" - Home route: show list of notes and a form to add a new note.
router.get("/", (req, res) => {
  // Retrieve notes from cookies; if not set, default to empty array.
  const notes = getNotes(req);
  // Render the "home" view (views/home.ejs) and pass the notes array.
  res.render("home", { notes });
});

// POST "/notes" - Create a new note
router.post("/notes", (req, res) => {
  // Get the current notes from cookies.
  const notes = getNotes(req);

  // Create a new note with an id, title, and content.
  // For simplicity, we generate an id by using the current timestamp.
  const newNote = {
    id: Date.now().toString(),
    title: req.body.title || "Untitled",
    content: req.body.content || ""
  };

  // Add the new note to the array
  notes.push(newNote);

  // Save the updated notes array back to the cookie
  saveNotes(res, notes);

  // Redirect back to the home page to show the updated list.
  res.redirect("/");
});

// GET "/notes/:id/edit" - Show a form to edit an existing note
router.get("/notes/:id/edit", (req, res, next) => {
  // Get all notes from cookies.
  const notes = getNotes(req);

  // Find the note with the matching id.
  const note = notes.find(n => n.id === req.params.id);
  if (!note) {
    // If the note is not found, forward an error.
    return next(new Error("Note not found"));
  }

  // Render the edit view, passing the note to be edited.
  res.render("edit", { note });
});

// POST "/notes/:id/edit" - Update an existing note
router.post("/notes/:id/edit", (req, res, next) => {
  // Get current notes.
  let notes = getNotes(req);

  // Find index of the note to update.
  const index = notes.findIndex(n => n.id === req.params.id);
  if (index === -1) {
    return next(new Error("Note not found"));
  }

  // Update the note with new title and content.
  notes[index].title = req.body.title || notes[index].title;
  notes[index].content = req.body.content || notes[index].content;

  // Save the updated notes array back to the cookie.
  saveNotes(res, notes);

  // Redirect to home page.
  res.redirect("/");
});

// POST "/notes/:id/delete" - Delete an existing note
router.post("/notes/:id/delete", (req, res, next) => {
  // Get current notes.
  let notes = getNotes(req);

  // Filter out the note with the specified id.
  const filteredNotes = notes.filter(n => n.id !== req.params.id);

  // Save the filtered notes back to the cookie.
  saveNotes(res, filteredNotes);

  // Redirect to home page.
  res.redirect("/");
});

module.exports = router;
