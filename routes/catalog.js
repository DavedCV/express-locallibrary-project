const express = require("express");
const router = express.Router();

// Require controller methods
const bookController = require("../controllers/bookController");
const authorController = require("../controllers/authorController");
const genreController = require("../controllers/genreController");
const bookInstanceController = require("../controllers/bookInstanceController");

// Book Routes -----------------------------------------------------------------

// GET catalog home page
router.get("/", bookController.index);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get("/book/create", bookController.bookCreateGet);

// POST request for creating book
router.post("/book/create", bookController.bookCreatePost);

// GET request to delete Book.
router.get("/book/:id/delete", bookController.bookDeleteGet);

// POST request to delete Book.
router.post("/book/:id/delete", bookController.bookDeletePost);

// GET request to update Book.
router.get("/book/:id/update", bookController.bookUpdateGet);

// POST request to update Book.
router.post("/book/:id/update", bookController.bookUpdatePost);

// GET request for one Book.
router.get("/book/:id", bookController.bookDetail);

// GET request for list of all Book items.
router.get("/books", bookController.bookList);

// Author Routes ---------------------------------------------------------------

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get("/author/create", authorController.authorCreateGet);

// POST request for creating Author.
router.post("/author/create", authorController.authorCreatePost);

// GET request to delete Author.
router.get("/author/:id/delete", authorController.authorDeleteGet);

// POST request to delete Author.
router.post("/author/:id/delete", authorController.authorDeletePost);

// GET request to update Author.
router.get("/author/:id/update", authorController.authorUpdateGet);

// POST request to update Author.
router.post("/author/:id/update", authorController.authorUpdatePost);

// GET request for one Author.
router.get("/author/:id", authorController.authorDetail);

// GET request for list of all Authors.
router.get("/authors", authorController.authorList);

// Genre routes ----------------------------------------------------------------

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get("/genre/create", genreController.genreCreateGet);

//POST request for creating Genre.
router.post("/genre/create", genreController.genreCreatePost);

// GET request to delete Genre.
router.get("/genre/:id/delete", genreController.genreDeleteGet);

// POST request to delete Genre.
router.post("/genre/:id/delete", genreController.genreDeletePost);

// GET request to update Genre.
router.get("/genre/:id/update", genreController.genreUpdateGet);

// POST request to update Genre.
router.post("/genre/:id/update", genreController.genreUpdatePost);

// GET request for one Genre.
router.get("/genre/:id", genreController.genreDetail);

// GET request for list of all Genre.
router.get("/genres", genreController.genreList);

// BookInstance Routes ---------------------------------------------------------

// GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id).
router.get(
  "/bookinstance/create",
  bookInstanceController.bookinstanceCreateGet
);

// POST request for creating BookInstance.
router.post(
  "/bookinstance/create",
  bookInstanceController.bookinstanceCreatePost
);

// GET request to delete BookInstance.
router.get(
  "/bookinstance/:id/delete",
  bookInstanceController.bookinstanceDeleteGet
);

// POST request to delete BookInstance.
router.post(
  "/bookinstance/:id/delete",
  bookInstanceController.bookinstanceDeletePost
);

// GET request to update BookInstance.
router.get(
  "/bookinstance/:id/update",
  bookInstanceController.bookinstanceUpdateGet
);

// POST request to update BookInstance.
router.post(
  "/bookinstance/:id/update",
  bookInstanceController.bookinstanceUpdatePost
);

// GET request for one BookInstance.
router.get("/bookinstance/:id", bookInstanceController.bookinstanceDetail);

// GET request for list of all BookInstance.
router.get("/bookinstances", bookInstanceController.bookinstanceList);

// Export Router ---------------------------------------------------------------

module.exports = router;
