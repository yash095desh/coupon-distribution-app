import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import connectToDB from "./utils/connectToDb.js";
import couponRoutes from "./routes/CouponRoutes.js";
import adminRoutes from "./routes/AdminRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config(); // Loading env variables

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(express.json()); 
app.use(cors());
app.use(cookieParser());

connectToDB(); 


app.get("/",(req, res) => {
  return res.status(200).json("helllo..");
});

app.use("/api/coupon",couponRoutes);
app.use("/api/admin",adminRoutes);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
