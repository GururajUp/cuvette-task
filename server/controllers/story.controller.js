const mongoose = require("mongoose");
const User = require("../models/user.model");
const Story = require("../models/story.model");

const createStory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { slides } = req.body;

    // Check if slides array has the required length
    if (!Array.isArray(slides) || slides.length < 3 || slides.length > 6) {
      return res
        .status(400)
        .json({ message: "Slides array must contain between 3 and 6 objects" });
    }

    // Check if all slides have the same category value
    const firstCategory = slides[0].categories;
    if (!slides.every((slide) => slide.categories === firstCategory)) {
      return res
        .status(400)
        .json({ message: "All slides must have the same category value" });
    }

    const story = new Story({ slides });
    await story.save();

    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { story: story._id } },
      { new: true }
    );

    // we use {new:true} to get back the updated document

    res.status(201).json({ message: "Story created successfully", story });
  } catch (error) {
    next(error);
  }
};

const viewStory = async (req, res, next) => {
  try {
    const { id } = req.query || "";
    console.log("STORY ID FROM BACKEND ", id);

    const story = await Story.findById(id);
    console.log("story : ", story);
    if (!story) {
      res.status(404).json({ message: "story not found" });
    }
    res.status(200).json(story);
  } catch (error) {
    next(error);
  }
};
const editStory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { slides } = req.body;
    const { storyId } = req.query;
    console.log("SLIDES", slides);
    console.log("userID", userId);
    console.log("STORY ID", storyId);

    const updatedStory = await Story.findByIdAndUpdate(
      storyId,
      { slides: slides },
      { new: true }
    );

    if (!updatedStory) {
      return res.status(404).json({ message: "Story not found" });
    }

    res
      .status(201)
      .json({ message: "Story updated successfully", story: updatedStory });
  } catch (error) {
    next(error);
  }
};

const filterStory = async (req, res, next) => {
  try {
    const { category } = req.query || "";
    const regexCategory = new RegExp(category, "i");
    const stories = await Story.find({
      slides: { $elemMatch: { categories: regexCategory } },
    });

    res.status(200).json({ message: stories });
  } catch (error) {
    next(error);
  }
};

const addLike = async (req, res, next) => {
  try {
    const username = req.user.userName || "";
    const userId = req.user.userId || "";
    const { storyId } = req.body || ""
    console.log("user ID from addLike controller",userId);
    console.log("story ID from addLike controller",storyId);

    if (!userId) {
      res.status(404).json({ message: "Please log in to your account" });
    }

    const story = await Story.findByIdAndUpdate(
      storyId,
      { $push: { likes: userId } },
      { new: true }
    );
    const likeCount = story.likes.length;
    res.status(200).json({ message: story.likes, likeCount });
  } catch (error) {
    next(error);
  }
};

const removeLike = async (req, res, next) => {
  try {
    const username = req.user.userName;
    const userId = req.user.userId;
    const { id } = req.body;

    if (!userId) {
      res.status(404).json({ message: "Please log in to your account" });
    }

    const story = await Story.findByIdAndUpdate(
      id,
      { $pull: { likes: userId } },
      { new: true }
    );

    const likeCount = story.likes.length;

    res.status(200).json({ message: story.likes, likeCount });
  } catch (error) {
    next(error);
  }
};

const yourStory = async (req, res, next) => {
  try {
    const userId = req.query.userId || "";
    // console.log("userId", userId);

    if (!userId) {
      return res.status(200).json({ message: "" });
    }
    const user = await User.findById(userId).populate("story");
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

const userData = async (req, res, next) => {
  try {
    const userId = req.query.userId || "";
    // console.log("userId", userId);

    if (!userId) {
      return res.status(200).json("");
    }
    const user = await User.findById(userId);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStory,
  viewStory,
  editStory,
  filterStory,
  addLike,
  removeLike,
  yourStory,
  userData
};