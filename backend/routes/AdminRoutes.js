import express from "express";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Coupon from "../models/Coupon.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Username and password are required",
        });
    }

    const admin = await Admin.findOne({ username });
    if (admin) {
      return res
        .status(409)
        .json({ success: false, message: "Username already exists" });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newadmin = new Admin({
      username,
      password: hashedPassword,
    });

    await newadmin.save();

    return res
      .status(201)
      .json({ success: true, message: "Admin Registered", admin: newadmin });
  } catch (error) {
    console.error("Error while registering admin", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Username and password are required",
        });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ success: true, message: "Admin successfully logged in", token });
  } catch (error) {
    console.error("Error while admin login:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

router.post("/add-coupon", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon code missing" });
    }

    const isExists = await Coupon.findOne({ code });
    if (isExists) {
      return res
        .status(409)
        .json({ success: false, message: "Coupon already exists" });
    }

    const coupon = new Coupon({ code });
    await coupon.save();

    return res
      .status(201)
      .json({ success: true, message: "Coupon added successfully", coupon });
  } catch (error) {
    console.error("Error in adding new coupon", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.patch("/toggle", async (req, res) => {
    try {
      const { id } = req.query;
      console.log(id)
  
      const coupon = await Coupon.findById(id);
      console.log(coupon)
      if (!coupon) {
        return res.status(404).json({ success: false, message: "Coupon not found" });
      }
  
      const updatedCoupon = await Coupon.findByIdAndUpdate(
        id,
        { disabled: !coupon.disabled }, // Directly toggle value
        { new: true }
      );
  
      return res.status(200).json({
        success: true,
        message: "Coupon toggled successfully",
        coupon: updatedCoupon,
      });
    } catch (error) {
      console.error("Error toggling coupon:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });
  

export default router;
