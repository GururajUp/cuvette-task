const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");


const register = async (req, res, next) => {
  try {
    console.log("data from register : ", req.body);
    const { userName, password } = req.body;
    const isUserNameExists = await User.findOne({ userName });

    if (isUserNameExists) {
      res.status(409).json({ message: "username already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const createUser = await User.create({
        userName: userName,
        password: hashedPassword,
      });

      res.status(200).json({ message: "User created successfully" });
    }
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    console.log("req.body from login controller : ", req.body);
    const { userName, password } = req.body;
    const isUserExists = await User.findOne({ userName });

    if (!isUserExists) {
      res.status(404).json({ message: "User not found" });
    } else {
      const matchPassword = await bcrypt.compare(
        password,
        isUserExists.password
      );

      if (!matchPassword) {
        res.status(401).json({ message: "Invalid credentials" });
      } else {
        const token = jwt.sign(
          { userId: isUserExists._id, userName: isUserExists.userName },
          process.env.JWT_SECRET_KEY
        );

        if (!token) {
          res.status(401).json({ message: "Unauthorized" });
        } else {
          res.status(200).json({
            message: "User logged in successfully",
            userName: isUserExists.userName,
            id: isUserExists._id,
            token: token,
          });
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

const fetchAllBookmarks = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).populate("bookmarks").exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({  user });
  } catch (error) {
    next(error);
  }
};

const addBookmark = async (req, res, next) => {
  try {
    const username = req.user.userName;
    const userId = req.user.userId;
    const { id } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.bookmarks.includes(id)) {
      user.bookmarks.push(id);
      await user.save();
      return res.status(200).json({ user });
    } else {
      return res.status(200).json({ user });
    }
  } catch (error) {
    next(error);
  }
};

const removeBookmark = async (req, res, next) => {
  try {
    const username = req.user.userName;
    const userId = req.user.userId;
    const { id } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.bookmarks.includes(id)) {
      user.bookmarks.pull(id);
      await user.save();
      return res.status(200).json({ user });
    } else {
      return res.status(200).json({message:"user didn't bookmark this" });
    }
  } catch (error) {
    next(error);
  }
};


module.exports = {
  register,
  login,
  fetchAllBookmarks,
  addBookmark,
  removeBookmark,
};