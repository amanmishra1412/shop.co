require('dotenv').config()

const { PORT, MONGO_URI, JWT_SECERET } = process.env

module.exports = {
    PORT, MONGO_URI, JWT_SECERET
}