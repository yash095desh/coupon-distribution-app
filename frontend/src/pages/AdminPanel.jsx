import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import CouponTable from "../components/CouponTable";
import axios from "axios";

function AdminPanel() {
  const { user, logout } = useAuth();
  const [currentData, setCurrentData] = useState("available");
  const [available, setAvailaible] = useState([]);
  const [claimed, setClaimed] = useState([]);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    fetchAvailableCoupons();
    fetchClaimedCoupons();
  }, [user, currentData]);

  const fetchAvailableCoupons = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_PATH}/api/coupon/available`
      );
      if (response.data.success) {
        setAvailaible(response.data.coupons);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchClaimedCoupons = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_PATH}/api/coupon/claimed`
      );
      if (response.data.success) {
        setClaimed(response.data.coupons);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDisable = async (id) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_PATH}/api/admin/toggle?id=${id}`
      );
      if (response.data.success) {
        fetchAvailableCoupons();
        fetchClaimedCoupons();
      }
    } catch (error) {
      console.log("error in toggeling coupon:", error);
    }
  };
  const createCoupon = async () => {
    try {
      if (!code) return;
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_PATH}/api/admin/add-coupon`,
        { code }
      );
      if (response.data.success) {
        fetchAvailableCoupons();
        setOpen(false);
        setCode("")
      }
    } catch (error) {
      console.log("error in creating coupon:", error);
    }
  };

  return (
    <div className=" h-screen w-full flex flex-col">
      {open && (
        <div
          className=" fixed h-screen w-full bg-black/50 flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
          <div
            className=" bg-white w-full max-w-xl rounded-xl p-4 flex flex-col gap-2"
            onClick={(ev) => ev.stopPropagation()}
          >
            <h1 className=" text-lg text-gray-800">Create Coupon</h1>
            <div className=" flex gap-2 items-center justify-between">
              <input
                type="text"
                value={code}
                onChange={(ev) => setCode(ev.target.value)}
                className=" px-6 py-2 outline-node rounded-lg bg-gray-50 outline-none w-full"
                placeholder="Enter Code"
              />
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer"
                onClick={createCoupon}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      <div className=" flex items-center p-4 justify-end gap-4 w-full ">
        <button
          className=" px-4 py-2 rounded-lg border border-green-400 bg-green-300 text-white cursor-pointer"
          onClick={() => setOpen(true)}
        >
          Create Coupon
        </button>
        <button
          className=" px-4 py-2 rounded-lg border border-red-400 bg-red-300 text-white cursor-pointer"
          onClick={() => logout()}
        >
          Logout
        </button>
      </div>
      <div className=" h-[85%] w-[95%] bg-white rounded-lg shadow-2xl m-auto p-4 flex justify-between gap-4">
        <div className=" flex flex-col gap-4 h-full w-fit rounded-lg py-4  bg-gradient-to-b from-slate-500 to-slate-800 text-white">
          <div
            className={`p-4 cursor-pointer ${
              currentData == "available" &&
              "bg-slate-900 border-r-2 border-r-amber-500"
            }`}
            onClick={() => setCurrentData("available")}
          >
            Available
          </div>
          <div
            className={`p-4 cursor-pointer ${
              currentData == "claimed" &&
              "bg-slate-900 border-r-2 border-r-amber-500"
            }`}
            onClick={() => setCurrentData("claimed")}
          >
            Claimed
          </div>
          <div
            className={`p-4 cursor-pointer ${
              currentData == "history" &&
              "bg-slate-900 border-r-2 border-r-amber-500"
            }`}
            onClick={() => setCurrentData("history")}
          >
            History
          </div>
        </div>
        {currentData === "available" && (
          <CouponTable coupons={available} onDisable={handleDisable} />
        )}
        {currentData === "claimed" && (
          <CouponTable coupons={claimed} onDisable={handleDisable} />
        )}
        {currentData === "history" && (
          <div className="overflow-x-auto w-full rounded-lg">
            <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-3 text-left">Coupon Code</th>
                  <th className="p-3 text-left">Claimed By</th>
                  <th className="p-3 text-left">Claimed At</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {claimed.map((coupon) => (
                  <tr key={coupon._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{coupon.code}</td>
                    <td className="p-3">{coupon.claimedBy || "N/A"}</td>
                    <td className="p-3">{coupon.updatedAt}</td>
                    <td className="p-3">
                      {coupon.disabled ? "Blocked" : "Valid"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
