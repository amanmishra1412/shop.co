require("dotenv").config();

const { PORT, MONGO_URI, JWT_SECERET, FRONTEND_URL } = process.env;

module.exports = {
  PORT,
  MONGO_URI,
  JWT_SECERET,
  FRONTEND_URL,
};
