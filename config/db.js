const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true,
            useCreateIndex: true
        })

        console.log(`Database is now connected at ${conn.connection.host}:${conn.connection.port}`)
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;

 