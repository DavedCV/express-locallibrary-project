const Author = require("../models/author");
const Book = require("../models/book");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all Authors.
exports.authorList = asyncHandler(async (req, res, next) => {
  debug(`get request for all authors`);
  const allAuthors = await Author.find().sort({ family_name: 1 }).exec();

  res.render("authorList", {
    title: "Author List",
    authorList: allAuthors,
  });
});

// Display detail page for a specific Author.
exports.authorDetail = asyncHandler(async (req, res, next) => {
  const authorId = req.params.id;

  // Get details of author and all their books (in parallel)
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(authorId).exec(),
    Book.find({ author: authorId }, "title summary").exec(),
  ]);

  if (author == null) {
    // No results.
    const err = new Error("Author not found");
    err.status = 404;
    return next(err);
  }

  res.render("authorDetail", {
    title: "Author Detail",
    author: author,
    authorBooks: allBooksByAuthor,
  });
});

// Display Author create form on GET.
exports.authorCreateGet = (req, res, next) => {
  res.render("authorForm", { title: "Create Author" });
};

// Handle Author create POST
exports.authorCreatePost = [
  // Validate and sanitize fields.
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("family_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("date_of_birth", "Invalid date of birth")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("date_of_death", "Invalid date of death")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation erros from a request.
    const errors = validationResult(req);

    // Create Author object with escaped and trimmed data
    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("authorForm", {
        title: "Create Author",
        author: author,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid.
      // Save author.
      await author.save();
      // Redirect to new author record.
      res.redirect(author.url);
    }
  }),
];

// Display Author delete form on GET
exports.authorDeleteGet = asyncHandler(async (req, res, next) => {
  const authorId = req.params.id;

  // Get details of author and all their books (in parallel)
  const [author, allBookByAuthor] = await Promise.all([
    Author.findById(authorId).exec(),
    Book.find({ author: authorId }, "title summary").exec(),
  ]);

  if (author === null) {
    // No results.
    res.redirect("/catalog/authors");
  }

  res.render("authorDelete", {
    title: "Delete Author",
    author: author,
    authorBooks: allBookByAuthor,
  });
});

// Handle Author delete on POST.
exports.authorDeletePost = asyncHandler(async (req, res, next) => {
  const authorId = req.params.id;

  // Get details of author and all their books (in parallel)
  const [author, allBookByAuthor] = await Promise.all([
    Author.findById(authorId).exec(),
    Book.find({ author: authorId }, "title summary").exec(),
  ]);

  if (allBookByAuthor.length > 0) {
    // Author has books. Render in same way as for GET route
    res.render("authorDelete", {
      title: "Delete author",
      author: author,
      authorBooks: allBookByAuthor,
    });
  } else {
    // Author has no books. Delete object and redirect to the list of authors.
    await Author.findByIdAndRemove(authorId).exec();
    res.redirect("/catalog/authors");
  }
});

// Display Author update form on GET.
exports.authorUpdateGet = asyncHandler(async (req, res, next) => {
  const authorId = req.params.id;

  // Get details of author
  const author = await Author.findById(authorId).exec();

  if (author === null) {
    // No results.
    const err = new Error("Author not found");
    err.status = 404;
    return next(err);
  }

  res.render("authorForm", {
    title: "Update Author",
    author,
  });
});

// Handle Author update on POST.
exports.authorUpdatePost = [
  // Validate and sanitize fields.
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("family_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("date_of_birth", "Invalid date of birth")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("date_of_death", "Invalid date of death")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation erros from a request.
    const errors = validationResult(req);

    // Create an Author object with escaped/trimmed data and old id.
    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render("authorForm", {
        title: "Update Author",
        author,
      });
    } else {
      const updateAuthor = await Author.findByIdAndUpdate(
        req.params.id,
        author,
        {}
      ).exec();
      res.redirect(author.url);
    }
  }),
];
