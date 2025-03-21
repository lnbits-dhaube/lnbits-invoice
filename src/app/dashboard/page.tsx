import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import WalletCard from "@/components/WalletCard";
import Transactions from "@/components/Transactions";

export default function Dashboard() {
    return (
        <div className="flex min-h-screen h-full overflow-auto">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex flex-col p-6 pt-2.5 bg-gray-100 w-full">
                {/* Header */}
                <Header />

                {/* <div className="h-10" /> */}
                {/* Wallet Section */}
                <div className="mt-6 ">
                    <WalletCard />
                </div>

                {/* Transactions */}
                <div className="mt-6">
                    <Transactions />
                </div>
            </div>
        </div>
    );
}
