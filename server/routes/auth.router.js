const express = require("express");
const router = express.Router();
const registrationValidationSchema = require("../validations/registration.validation.schema");
const loginValidationSchema = require("../validations/login.validation.schema");
const validateSchema = require("../middlewares/auth.middleware");
const authenticateToken = require("../middlewares/token.middleware");
const {
  register,
  login,
  fetchAllBookmarks,
  addBookmark,
  removeBookmark,
} = require("../controllers/auth.controller");

// auth
router.post(
  "/register",
  validateSchema(registrationValidationSchema),
  register
);
router.post("/login", validateSchema(loginValidationSchema), login);

// bookmarks
router.get("/bookmarks", authenticateToken, fetchAllBookmarks);
router.post("/bookmarks", authenticateToken, addBookmark);
router.patch("/bookmarks", authenticateToken, removeBookmark);

module.exports = router;