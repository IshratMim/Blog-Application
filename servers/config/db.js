const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`database connected ${conn.connection.host}`);
    }
    catch (error) {
        console.log("database is not connected");
        console.log(error.message);
        process.exit(1);
    }

}
module.exports = connectDB;