const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const profileRoutes = require("./routes/profileRoutes");
app.use("/api/profile", profileRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});