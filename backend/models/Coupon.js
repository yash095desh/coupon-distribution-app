import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    claimed: { type: Boolean, default: false },
    disabled: {type: Boolean, default: false},
    claimedBy: { type: String, default: null },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
