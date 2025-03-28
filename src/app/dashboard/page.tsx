"use client";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import WalletCard from "@/components/WalletCard";
import Transactions from "@/components/Transactions";
import Statement from "@/components/Statement";
import { DashboardProvider, useDashboard } from "@/context/DashboardContext";

export default function Dashboard() {
    return (
        <DashboardProvider>
            <DashboardContent />
        </DashboardProvider>
    );
}

function DashboardContent() {
    const { activeComponent } = useDashboard();
    return (
        <div className="flex min-h-screen h-full overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex flex-col p-6 pt-2.5 bg-gray-100 w-full">
                {/* Header */}
                <Header />

                {/* <div className="h-10" /> */}
                {
                    activeComponent === "dashboard" ? (
                        <div className="mt-6">
                            <WalletCard />
                        </div>
                    ) : null
                }
                

                {/* Transactions */}
                <div className="mt-6">
                    {activeComponent === "dashboard" ? <Transactions /> : <Statement />}
                </div>
            </div>
        </div>
    );
}
