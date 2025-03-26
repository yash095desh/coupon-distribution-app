import React, { useState } from "react";

const CouponTable = ({ coupons, onDisable }) => {
  return (
    <div className="overflow-x-auto w-full rounded-lg">
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Coupon Code</th>
            <th className="p-3 text-left">Is Claimed</th>
            <th className="p-3 text-left">Claimed By</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon) => (
            <tr key={coupon._id} className="border-b hover:bg-gray-50">
              <td className="p-3">{coupon._id}</td>
              <td className="p-3">{coupon.code}</td>
              <td className="p-3">{coupon.calimed ? "Yes" : "No"}</td>
              <td className="p-3">{coupon.claimedBy || "N/A"}</td>
              <td className="p-3 text-center">
                <button
                  className={` text-white px-4 py-2 rounded-md cursor-pointer  ${coupon.disabled?'bg-blue-500 hover:bg-blue-600':'bg-red-500 hover:bg-red-600'}`}
                  onClick={() => onDisable(coupon._id)}
                >
                  {coupon.disabled?"Enable":"Disable"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CouponTable;
