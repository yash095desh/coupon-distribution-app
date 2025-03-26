import mongoose from "mongoose";

const connectToDb = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("DB connected successfully")
    } catch (error) {
        console.error(`Error connecting to DB`,error);

    }
}

export default connectToDb