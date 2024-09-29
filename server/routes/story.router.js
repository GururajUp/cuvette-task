const express = require("express");
const validateSchema = require("../middlewares/auth.middleware");
const storyValidationSchema = require("../validations/story.validation.schema");
const authenticateToken = require("../middlewares/token.middleware");
const {
  addLike,
  removeLike,
  filterStory,
  viewStory,
  createStory,
  editStory,
  yourStory,
  userData
} = require("../controllers/story.controller");
const router = express.Router();

// addLike and remove like
router.post("/like", authenticateToken, addLike);
router.patch("/unlike", authenticateToken, removeLike);
router.get("/userData", userData);

// createStory , editStory , filterStory[categories] , userStoryById[click on any story]
router.get("/view", viewStory);

router.get("/filter", filterStory);

router.post(
  "/create",
  authenticateToken,
  validateSchema(storyValidationSchema),
  createStory
);
router.put(
  "/edit",
  authenticateToken,
  validateSchema(storyValidationSchema),
  editStory
);

router.get("/yourStory", yourStory);

module.exports = router;