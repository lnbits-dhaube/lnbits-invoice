"use client";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaSync } from "react-icons/fa";
import api from "@/api-services/api-services";

export default function WalletCard() {
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const [btcBalance, setBtcBalance] = useState(0);
  const [showBalance, setShowBalance] = useState(false);
  const fetchWalletBalance = async () => {
    try {
      const response = await api.get("/my-wallet");
      setWalletBalance(response.data.balance);
      setBtcBalance(response.data.btc_balance);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    }
  };
  useEffect(() => {
    setLoading(true);
    fetchWalletBalance();
    setLoading(false);
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    await fetchWalletBalance();
    setLoading(false);
  };
  return (
    <div className="bg-green-600 text-white p-6 rounded-lg shadow-lg">
      <div className="flex-row items-center">
        <span className="flex items-center ">
          {showBalance ? (
            <span className="flex flex-col">
              <span className="text-3xl font-bold">${walletBalance}</span>
              <span className="text-sm font-bold align-bottom ">
                ₿{btcBalance}
              </span>
            </span>
          ) : (
            <span className="flex flex-col">
              <span className="text-3xl font-bold">$**.***</span>
              <span className="text-sm font-bold align-bottom ">
                ₿*.********
              </span>
            </span>
          )}
          <button
            className="text-white border px-2 py-1 rounded-lg ml-2"
            onClick={() => setShowBalance(!showBalance)}
          >
            {showBalance ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        </span>
        <span className="text-sm">
          <span>Available Balance</span>
          <button
            className="text-sm text-white px-2 py-1  ml-2"
            onClick={handleRefresh}
          >
            {loading ? (
              <FaSync size={16} className="animate-spin" />
            ) : (
              <FaSync size={16} />
            )}
          </button>
        </span>
      </div>

      <div className="flex space-x-4 mt-4">
        <button className="bg-yellow-200 text-black px-4 py-2 rounded">
          Withdraw
        </button>
        <button className="bg-yellow-200 text-black px-4 py-2 rounded">
          Generate Invoice
        </button>
      </div>
    </div>
  );
}
