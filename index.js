const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const route = require("./src/routers/index");

app.use(express.json());

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION 💥: Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Db connection successful`);
  });

app.use(route);

const server = app.listen(3000, () => console.log("server connected"));

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION 💥: Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
