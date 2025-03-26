import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {toast} from "react-hot-toast"

function Homepage() {
  const [coupon, setCoupon] = useState(null);

  const handleClick = async () => {
    try {
      const PATH = import.meta.env.VITE_SERVER_PATH;
      const response = await axios.get(`${PATH}/api/coupon/claim`);
      console.log(response.data);
      if (response.data.success) {
        setCoupon(response.data.coupon.code);
      }
    } catch (error) {
      toast.error(error.response.data.message)
      console.log("error in getting coupon:", error);
    }
  };

  return (
    <div className=" w-full h-screen flex items-center justify-center relative">
      <Link
        className="px-4 py-2 absolute top-4 right-4 rounded-lg bg-blue-500 border border-blue-700 text-white"
        to="/login"
        prefetch="render"
      >
        Admin Login
      </Link>

      <div className=" w-full max-w-xl rounded-xl shadow-2xl bg-white py-10 px-8 flex flex-col items-center justify-between gap-4">
        <h1 className=" text-3xl text-gray-800 font-semibold mb-6 mt-2">
          🎉 Welcome to Coupon Hub 🎊
        </h1>
        <p className=" text-lg text-gray-600">
          {" "}
          Claim your exclusive coupon now{" "}
        </p>
        {coupon ? (
          <p className=" px-6 py-2 rounded-lg bg-green-100 border border-green-300 text-green-600">
            code : {coupon}
          </p>
        ) : (
          <button
            onClick={handleClick}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-300 to-amber-500 text-white outline-none cursor-pointer hover:opacity-50 border border-amber-400"
          >
            Claim Now
          </button>
        )}
      </div>
    </div>
  );
}

export default Homepage;
