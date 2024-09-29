const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path")
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.router");
const storyRouter = require("./routes/story.router");
const errorMiddleware = require("./middlewares/error.middleware");



const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.static(path.join(__dirname, 'public')));

// const corsOptions = {
//     origin: "*",
//     optionsSuccessStatus: 200,
//   };
   

  app.use(cors());
// app.use(express.static(path.join(__dirname, 'public')));


// Connect to MongoDB
mongoose
.connect(process.env.MONGO_URI)
.then(() => {console.log('Connected to MongoDB')})
.catch(err => {console.log('Failed to connect to MongoDB', err)});

app.use("/api/auth", authRouter);
app.use("/api/story", storyRouter);

app.use(errorMiddleware);



app.get('/health', (req, res) => {
    // res.send
    res.json({
        message: 'Cuvette-task API is working fine',
        status: 'Working fine',
        date: new Date().toLocaleDateString()
    });
});

// REDIRECT PAGE TO 404
app.use("*", (req, res) => {
    res.status(404).json({
        message: 'Error loading page',
        status: 'Error',
    });
});
//localhost:3000/healt


app.listen(PORT, () => {
    console.clear();
    console.log(`Server is running on port ${PORT}`);
});