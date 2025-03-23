"use client";
import { useState, useEffect } from "react";
import { TransactionResponse } from "@/interfaces/transactions";
import Loading from "@/utils/loading";

export default function Transactions() {
    const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [numPages, setNumPages] = useState(0);
    const limit = 10; // Number of transactions per page
    const [activeTransaction, setActiveTransaction] = useState<TransactionResponse[]>([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/payment_list`);
                const data = await res.json();
                setTransactions(data);
                setActiveTransaction(data.slice(0, limit));
                setNumPages(Math.ceil(data.length / limit));
                console.log("Number of pages:", numPages);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
            setLoading(false);
        };
        fetchTransactions();
    }, []);

    useEffect(() => {
        const fetchPages = async () => {
            try {
                setActiveTransaction(transactions.slice((page - 1) * limit, page * limit));
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };
        fetchPages();
    }, [page]);


    return (
        <div className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-2">Recent Transactions</h3>

            {/* Filter Buttons */}
            <div className="flex justify-between items-center mb-4">
                <button className="bg-gray-100 shadow-sm px-4 py-2 rounded-lg w-24 md:w-30">All</button>
                <button className="bg-gray-100 shadow-sm px-4 py-2 rounded-lg w-24 md:w-30">Withdraw</button>
                <button className="bg-gray-100 shadow-sm px-4 py-2 rounded-lg w-24 md:w-30">Deposit</button>
            </div>

            {/* Transaction List */}
            {loading ? (
                <Loading />
            ) : (
                <div className="space-y-2">
                    {transactions.length > 0 ? (
                        activeTransaction.map((tx, index) => (
                            <div key={index} className="flex justify-between p-2 shadow-sm shadow-gray-500 bg-yellow-50 rounded">
                                <div>
                                    <p className="text-sm font-semibold">{tx.memo}</p>
                                    <p className="text-xs text-gray-600">{tx.date}</p>
                                </div>
                                <p className={`text-sm font-bold ${tx.color}`}>{tx.amount}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No transactions found.</p>
                    )}
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-between mt-4">
                <button
                    className="bg-gray-200 px-4 py-2 rounded-lg disabled:opacity-50"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span className="text-sm font-semibold">Page {page} of {numPages}</span>
                <button
                    className="bg-gray-200 px-4 py-2 rounded-lg disabled:opacity-50"
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={page >= numPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
