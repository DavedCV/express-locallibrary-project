const Genre = require("../models/genre");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all Genre.
exports.genreList = asyncHandler(async (req, res, next) => {
  const allGenres = await Genre.find().sort({ name: 1 }).exec();
  return res.render("genreList", { title: "Genre List", genreList: allGenres });
});

// Display detail page for a specific Genre.
exports.genreDetail = asyncHandler(async (req, res, next) => {
  const genreId = req.params.id;

  // Get details of genre and all associated books (in parallel).
  const [genre, bookInGenre] = await Promise.all([
    Genre.findById(genreId).exec(),
    Book.find({ genre: genreId }, "title summary").exec(),
  ]);

  if (genre == null) {
    // No results.
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }

  res.render("genreDetails", {
    title: "Genre Detail",
    genre: genre,
    genreBooks: bookInGenre,
  });
});

// Display Genre create form on GET.
exports.genreCreateGet = (req, res, next) => {
  res.render("genreForm", { title: "Create Genre" });
};

// Handle Genre create on POST.
exports.genreCreatePost = [
  // Validate and sanitize the name field.
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("genreForm", {
        title: "Create Genre",
        genre: genre,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      const genreExists = await Genre.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (genreExists) {
        // Genre exists, redirect to its detail page.
        res.redirect(genreExists.url);
      } else {
        await genre.save();
        // New genre saved. Redirect to genre detail page.
        res.redirect(genre.url);
      }
    }
  }),
];

// Display Genre delete form on GET.
exports.genreDeleteGet = asyncHandler(async (req, res, next) => {
  const genreId = req.params.id;

  // Get details of genre and their related books (in parallel)
  const [genre, genreBooks] = await Promise.all([
    Genre.findById(genreId).exec(),
    Book.find({ genre: genreId }, "title summary").exec(),
  ]);

  if (genre == null) {
    // No results.
    res.redirect("/catalog/genres");
  }

  res.render("genreDelete", {
    title: "Delete Genre",
    genre: genre,
    genreBooks: genreBooks,
  });
});

// Handle Genre delete on POST.
exports.genreDeletePost = asyncHandler(async (req, res, next) => {
  const genreId = req.params.id;

  // Get details of genre and their related books (in parallel)
  const [genre, genreBooks] = await Promise.all([
    Genre.findById(genreId).exec(),
    Book.find({ genre: genreId }, "title summary").exec(),
  ]);

  if (genreBooks.length > 0) {
    // Genre has books associated. Rende in the same way as the GET route
    res.render("genreDelete", {
      title: "Delete Genre",
      genre: genre,
      genreBooks: genreBooks,
    });
  } else {
    await Genre.findByIdAndDelete(genreId).exec();
    res.redirect("/catalog/genres");
  }
});

// Display Genre update form on GET.
exports.genreUpdateGet = asyncHandler(async (req, res, next) => {
  const genreId = req.params.id;

  // Get details of genre
  const genre = await Genre.findById(genreId).exec();

  if (genre == null) {
    // No results.
    res.redirect("/catalog/genres");
  }

  res.render("genreForm", { title: "Update Genre", genre: genre });
});

// Handle Genre update on POST.
exports.genreUpdatePost = [
  // Validate and sanitize the name field.
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    const genreId = req.params.id;

    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const genre = new Genre({
      name: req.body.name,
      _id: genreId,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("genreForm", {
        title: "Update Genre",
        genre: genre,
        errors: errors.array(),
      });
    } else {
      const updateGenre = await Genre.findByIdAndUpdate(genreId, genre).exec();
      res.redirect(updateGenre.url);
    }
  }),
];
