const express = require("express");
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;

const app = express();

// Body-parser
app.use(express.json());

// Database config
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB successfully connected!"))
  .catch(err => console.log(err));

// Routes
app.use("/api/users", require("./routes/api/users"));

// Server port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}!`));
