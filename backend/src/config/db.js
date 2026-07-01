const mongoose = require('mongoose')
const { MONGO_URI } = require('./env')

const ConnectToDb = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected");
    } catch (err) {
        console.log("DB connection error");
        console.log(err.message);
        process.exit(1);
    }
}

module.exports = ConnectToDb