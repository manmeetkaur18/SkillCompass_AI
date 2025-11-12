import app from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("MongoDb connected");
    app.listen(PORT,()=>{
        console.log(`Server running on http://localhost:${PORT}`);
    });
})
.catch(err=>console.log("MongoDB connection error",err));