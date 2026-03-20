require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
connectDB();

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/invoices", require("./routes/invoiceRoutes"));

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("LocalFix Backend Running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
