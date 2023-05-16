const mongoose = require("mongoose");

const connectionString =
  "mongodb+srv://cedricbeillevaire:YkeXrqe8I96P2zgW@cluster0.wpowy7x.mongodb.net/allwithin";

mongoose
  .connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log("Database connected"))
  .catch((error) => console.error(error));
