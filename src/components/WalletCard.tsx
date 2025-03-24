"use client"
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaSync  } from "react-icons/fa";
export default function WalletCard() {
    const [loading, setLoading] = useState(true);
    const [walletBalance, setWalletBalance] = useState(0);
    const [showBalance, setShowBalance] = useState(false);
    const fetchWalletBalance = async () => {
        try {
            const res = await fetch("/api/wallet");
            const data = await res.json();
            setWalletBalance(data.balance);
        } catch (error) {
            console.error("Error fetching wallet balance:", error);
        }
    };
    useEffect(() => {
        setLoading(true);
        fetchWalletBalance();
        setLoading(false)
    }, []);

    const handleRefresh = async () => {
        setLoading(true);
        await fetchWalletBalance();
        setLoading(false);
    }
    return (
        <div className="bg-green-600 text-white p-6 rounded-lg shadow-lg">
            <span>
                {showBalance ? (
                    <span className="text-xl font-bold">${walletBalance}</span>) : (
                    <span className="text-xl font-bold">$***.**</span> /* Masked Wallet Balance */
                )}
                <button className="text-sm text-white border px-2 py-1 rounded-lg ml-2"
                    onClick={() => setShowBalance(!showBalance)}
                >
                    {showBalance ?
                        (<FaEyeSlash size={16} />) :
                        (<FaEye size={16} />)
                    }
                </button>

            </span>
            <p className="text-sm">
                <span>
                    Available Balance
                </span>
                <button className="text-sm text-white px-2 py-1  ml-2"
                    onClick={handleRefresh}>
                    {loading ? (
                        <FaSync  size={16} className="animate-spin" />
                    ) : (
                        <FaSync  size={16} />
                    )}
                </button>

            </p>
            <div className="flex space-x-4 mt-4">
                <button className="bg-yellow-200 text-black px-4 py-2 rounded">Withdraw</button>
                <button className="bg-yellow-200 text-black px-4 py-2 rounded">Generate Invoice</button>
            </div>
        </div>
    );
}