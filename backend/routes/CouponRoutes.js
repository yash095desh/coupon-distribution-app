import express from "express";
import Coupon from "../models/Coupon.js";

const router = express.Router();

router.get("/claim", async (req, res) => {
  try {
    const IPAddress =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    console.log("IP :", IPAddress);

    if (!IPAddress) {
      return res
        .status(400)
        .json({ success: false, message: "IP address not found" });
    }

    const AlreadyClaimed = await Coupon.findOne({
      claimedBy: IPAddress,
    });

    if (AlreadyClaimed) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon Already Claimed!" });
    }

    const coupon = await Coupon.findOneAndUpdate(
      { claimed: false, disabled: false },
      { claimed: true, claimedBy: IPAddress },
      { new: true }
    );

    if (!coupon) {
      return res
        .status(400)
        .json({ success: false, message: "No available coupons left!" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Coupon Claimed", coupon });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/available", async (req, res) => {
  try {
    const coupons = await Coupon.find({ claimed: false });

    if (coupons.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No coupons available" });
    }

    return res
      .status(200)
      .json({ success: true, message: "coupons fetched", coupons });
  } catch (error) {
    console.log("error while fetching the coupons", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/claimed", async (req, res) => {
  try {
    const coupons = await Coupon.find({ claimed: true });

    if (coupons.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No coupons available" });
    }
    return res
      .status(200)
      .json({ success: true, message: "coupons fetched", coupons });
  } catch (error) {
    console.log("error in getting claimed coupon:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
