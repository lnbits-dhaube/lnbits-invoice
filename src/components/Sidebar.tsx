"use client";
import { useState } from "react";
import { FaBars, FaTimes, FaWallet, FaCog, FaQrcode } from "react-icons/fa";
import { CiGrid42 } from "react-icons/ci";
import { useDashboard } from "@/context/DashboardContext";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const { activeComponent, setActiveComponent } = useDashboard();
    function toggleMenu() {
        setIsOpen(!isOpen);
    }

    return (
        <>
            {/* Sidebar */}
            {/* Hamburger Button (Small Screens Only) */}
            <button
                className=" md:hidden text-2xl text-white bg-green-600 p-3 rounded-md fixed top-4 left-4 z-10 shadow-sm "
                onClick={toggleMenu}
                aria-label="Toggle menu"
            >
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
            <div className={`${isOpen ? "block" : "hidden"} md:flex flex-col bg-gradient-to-b from-green-600 to-green-400 min-h-screen text-white md:w-1/3 lg:w-1/4`}>

                <div className={`fixed md:relative top-0 left-0 h-full md:w-full w-full bg-gradient-to-b from-green-600 to-green-400 py-6 px-3 text-white`}>
                    <div className="flex items-center justify-center gap-2 text-lg font-semibold mb-6 mx-12 text-center border border-black shadow-sm  bg-white text-black rounded py-1 px-4">
                        <CiGrid42 size={24} />
                        <span>Dashboard</span>
                    </div>

                    {/* Wallets */}
                    <div className="mb-6 h-full">
                        <h3 className="text-sm font-semibold">Choose Wallets</h3>
                        <div className="mt-2 space-y-0 border border-black rounded-sm overflow-hidden">
                            <button className={`flex items-center w-full border-b border-black  text-black px-4 py-2 ${activeComponent === 'dashboard' ? "bg-yellow-200" : 'bg-white'}`}
                                onClick={() => {
                                    // navigate to dashboard
                                    setActiveComponent("dashboard");

                                }
                                }
                            >
                                <FaWallet className="mr-2" /> Recent Transactions
                            </button>
                            <button className={`flex items-center w-full border-b border-black  text-black px-4 py-2 ${activeComponent === 'statement' ? "bg-yellow-200" : 'bg-white'}`}
                                onClick={() => {
                                    // navigate to statement
                                    setActiveComponent("statement");
                                }
                                }
                            >
                                <FaWallet className="mr-2" /> Statement
                            </button>

                        </div>
                    </div>

                    {/* Settings & QR */}
                    <div className="absolute bottom-6 left-6">
                        <button className="flex items-center space-x-2 text-white">
                            <FaCog /> <span>Settings</span>
                        </button>
                        <button className="flex items-center mt-4 space-x-2 text-white">
                            <FaQrcode /> <span>Scan QR</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
