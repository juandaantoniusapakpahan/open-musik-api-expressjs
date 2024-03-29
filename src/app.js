require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cookeiParser = require("cookie-parser");
const app = express();
const fileUpload = require("express-fileupload");

const User = require("./routes/user");
const Album = require("./routes/album");
const Authentication = require("./routes/authenticaton");
const Song = require("./routes/songs");
const Playlist = require("./routes/playlist");
const Collaborations = require("./routes/collaborations");
const PlaylistSong = require("./routes/playlistSong");
const LikeDislikeSong = require("./routes/songlikedislike");

const errorHandler = require("./exception/errorHandler");

app.use(express.json());
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));
app.use(cookeiParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

/** Router */
app.use("/api/v1", User);
app.use("/api/v1", Album);
app.use("/api/v1", Authentication);
app.use("/api/v1", Song);
app.use("/api/v1", Playlist);
app.use("/api/v1", Collaborations);
app.use("/api/v1", PlaylistSong);
app.use("/api/v1", LikeDislikeSong);

/** Error Handler */
app.use(errorHandler);

module.exports = app;
