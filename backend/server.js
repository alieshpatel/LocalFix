require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const technicianRoutes = require("./routes/technicianRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to LocalFix API");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/technicians", technicianRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/complaints", complaintRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});