"use client";
import { useState, useEffect } from "react";
import { TransactionResponse } from "@/interfaces/transactions";
import { PaymentHistory } from "@/interfaces/payment_history";
import { satsToUsd } from "@/utils/sats_to_usd";
import Loading from "@/utils/loading";

export default function Statement() {
    const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<TransactionResponse[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [activeTransaction, setActiveTransaction] = useState<TransactionResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [numPages, setNumPages] = useState(0);
    const limit = 10; // Number of transactions per page
    const [searchQuery, setSearchQuery] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [history, setHistory] = useState<PaymentHistory | null>(null);
    const [period, setPeriod] = useState("day");

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/payment_list`);
                const data = await res.json();
                setTransactions(data);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
            setLoading(false);
        };
        fetchTransactions();
    }, []);

    useEffect(() => {
        const payment_history = async () => {
            try {
                const res = await fetch(`/api/payment_history?group=${period}`);
                let data = await res.json();
                if (Array.isArray(data)) {
                    data = data[0];
                }
                if (!data) {
                    setHistory(null);
                    return;
                }
                data.income = parseFloat((await satsToUsd((data?.income ?? 0) / 1000)).toFixed(4));
                data.spending = parseFloat((await satsToUsd((data?.spending ?? 0) / 1000)).toFixed(4));
                setHistory(data);
                console.log("Payment History:", data);
            } catch (error) {
                console.error("Error fetching payment history:", error);
            }
        }
        payment_history();

    }, [period]);

    useEffect(() => {
        const filtered = transactions.filter(tx => tx.memo.toLowerCase().includes(searchQuery.toLowerCase()));
        setFilteredTransactions(filtered);
        setNumPages(Math.ceil(filtered.length / limit));
        setPage(1);
    }, [searchQuery]);

    useEffect(() => {
        setActiveTransaction(filteredTransactions.slice((page - 1) * limit, page * limit));
    }, [page, filteredTransactions]);

    const applyDateFilter = () => {
        const filtered = transactions.filter(tx => {
            const txDate = new Date(tx.date);
            return (!fromDate || txDate >= new Date(fromDate)) && (!toDate || txDate <= new Date(toDate));
        });
        setFilteredTransactions(filtered);
        setNumPages(Math.ceil(filtered.length / limit));
        setPage(1);
    };

    useEffect(() => {
        if (fromDate || toDate) {
            applyDateFilter();
        }
    }, [fromDate, toDate]);


    const filterByTime = (period: "day" | "week" | "month") => {
        const now = new Date();
        const startDate = new Date();

        if (period === "day") {
            setPeriod("day");
            startDate.setDate(now.getDate() - 1);
        } else if (period === "week") {
            setPeriod("week");
            startDate.setDate(now.getDate() - 7);
        } else if (period === "month") {
            setPeriod("month");
            startDate.setMonth(now.getMonth() - 1);
        }

        setFromDate(startDate.toISOString().split("T")[0]);
        setToDate(now.toISOString().split("T")[0]);
    };
    return (
        <div className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-2">Transactions Statement</h3>
            <div className="space-y-2 md:flex md:flex-row md:flex-wrap justify-between">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 ">
                    {/* Search Bar */}
                    <input
                        type="text"
                        placeholder="Search by Name..."
                        className="px-4 py-2 border rounded-md w-full md:w-1/3 lg:w-1/2"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="flex gap-2 flex-row justify-center md:justify-start w-full">
                        <button className={`bg-gray-200 px-4 py-2 rounded-md md:w-auto ${period === "day" ? "bg-green-300" : ""}`}
                            onClick={() => filterByTime("day")}>Day</button>
                        <button className={`bg-gray-200 px-4 py-2 rounded-md md:w-auto ${period === "week" ? "bg-green-300" : ""}`}
                            onClick={() => filterByTime("week")}>Week</button>
                        <button className={`bg-gray-200 px-4 py-2 rounded-md md:w-auto ${period === "month" ? "bg-green-300" : ""}`}
                            onClick={() => filterByTime("month")}>Month</button>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md w-full md:w-auto"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            {showFilters ? "Hide Filter" : "Filter"}
                        </button>
                    </div>

                </div>

                {/* Date Filter & Shortcuts */}
                <div className="flex items-center justify-center flex-row gap-4 md:gap-6">
                    {showFilters && (
                        <div className="fixed flex-col flex flex-wrap gap-2 items-center justify-center h-fit w-full inset-0 z-10 p-4">
                            <div className="fixed inset-0 flex items-center justify-center z-10">
                                <div className="flex flex-col gap-4 items-center justify-center p-6 bg-white border border-black rounded-lg shadow-lg">
                                    <input
                                        type="date"
                                        className="px-4 py-2 border border-black rounded-md w-auto"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                    />
                                    <input
                                        type="date"
                                        className="px-4 py-2 border border-black rounded-md w-auto"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                    />
                                    <div className="flex gap-4">
                                        <button
                                            className="bg-green-500 text-white px-4 py-2 rounded-md"
                                            onClick={() => {
                                                applyDateFilter();
                                                setShowFilters(false);
                                            }}
                                        >
                                            Apply
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded-md"
                                            onClick={() => setShowFilters(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <hr />
            <div className="flex flex-row gap-2 p-2  w-full text-center sm:text-left text-sm">
                <div className="flex p-2 items-center justify-center border border-gray-300 rounded-lg">
                    <span className="font-semibold text-gray-700">Total Income:</span>
                    <span className="text-green-600 font-bold ml-2">${history?.income ?? 0}</span>
                </div>
                <div className="flex p-2 items-center justify-center border border-gray-300 rounded-lg">
                    <span className="font-semibold text-gray-700">Total Spending:</span>
                    <span className="text-red-600 font-bold ml-2">${history?.spending ?? 0}</span>
                </div>
            </div>

            <hr />


            {/* Transactions List */}
            {loading ? (
                <Loading />
            ) : (
                <div className="space-y-2">
                    {activeTransaction.length > 0 ? (
                        activeTransaction.map((tx, index) => (
                            <div key={index} className="flex justify-between p-2 shadow-sm bg-yellow-50 rounded">
                                <div>
                                    <p className="text-sm font-semibold">{tx.memo}</p>
                                    <p className="text-xs text-gray-600">{tx.date}</p>
                                </div>
                                <p className={`text-sm font-bold ${tx.color}`}>${tx.amount}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No transactions found.</p>
                    )}
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-between mt-4">
                <button
                    className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span className="text-sm font-semibold">Page {numPages > 0 ? page : 0} of {numPages}</span>
                <button
                    className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={page >= numPages}
                >
                    Next
                </button>
            </div>

        </div>
    );
}
