const connectDB = require("./config/db");
connectDB();

const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const cartRoute = require("./routes/cartRoute");
const productRoute = require("./routes/productRoute");
const authRoute = require("./routes/authRoute");
const { FRONTEND_URL } = require("./config/env");

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend working");
});

app.use("/auth", authRoute);
app.use("/products",productRoute);
app.use("/cart", cartRoute);

module.exports = app;