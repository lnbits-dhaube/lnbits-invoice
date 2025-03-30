"use client";
import { useState, useEffect } from "react";
import { TransactionResponse } from "@/interfaces/transactions";
import api from "@/api-services/api-services";
import Skeleton from "@/components/ui/skeleton";
import { FaInbox } from "react-icons/fa";

export default function Transactions() {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const limit = 10; // Number of transactions per page
  const [filteredTransactions, setFilteredTransactions] = useState<
    TransactionResponse[]
  >([]);
  const [activeTransaction, setActiveTransaction] = useState<
    TransactionResponse[]
  >([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await api.get("/my-payment-list");
        setTransactions(response.data);
        setFilteredTransactions(response.data);
        setNumPages(Math.ceil(response.data.length / limit));
        setActiveTransaction(response.data.slice(0, limit));
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
      setLoading(false);
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    setActiveTransaction(filteredTransactions.slice(startIndex, endIndex));
    setNumPages(Math.ceil(filteredTransactions.length / limit));
  }, [page, filteredTransactions]);

  const filteTransactions = (applyFilter: string) => {
    if (applyFilter === "all") {
      setFilteredTransactions(transactions);
      setNumPages(Math.ceil(transactions.length / limit));
    } else if (applyFilter === "deposit") {
      const deposit = transactions.filter((tx) => tx.amount > 0);
      setFilteredTransactions(deposit);
      setNumPages(Math.ceil(deposit.length / limit));
    } else {
      const withdraw = transactions.filter((tx) => tx.amount < 0);
      setFilteredTransactions(withdraw);
      setNumPages(Math.ceil(withdraw.length / limit));
    }
    setPage(1);
    setFilter(applyFilter);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-2">Recent Transactions</h3>

      {/* Filter Buttons */}
      <div className="flex justify-between items-center mb-4">
        <button
          className={`bg-gray-100 shadow-sm px-4 py-2 rounded-lg w-24 md:w-30 ${
            filter === "all" ? "bg-green-200" : ""
          }`}
          onClick={() => filteTransactions("all")}
        >
          All
        </button>
        <button
          className={`bg-gray-100 shadow-sm px-4 py-2 rounded-lg w-24 md:w-30 ${
            filter === "withdraw" ? "bg-green-200" : ""
          }`}
          onClick={() => filteTransactions("withdraw")}
        >
          Withdraw
        </button>
        <button
          className={`bg-gray-100 shadow-sm px-4 py-2 rounded-lg w-24 md:w-30 ${
            filter === "deposit" ? "bg-green-200" : ""
          }`}
          onClick={() => filteTransactions("deposit")}
        >
          Deposit
        </button>
      </div>

      {/* Transaction List */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex justify-between p-2 bg-yellow-50 rounded"
            >
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-4 w-20 ml-4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {activeTransaction.length > 0 ? (
            activeTransaction.map((tx, index) => (
              <div
                key={index}
                className="flex justify-between p-2 shadow-sm shadow-gray-500 bg-yellow-50 rounded"
              >
                <div>
                  <p className="text-sm font-semibold">{tx.memo}</p>
                  <p className="text-xs text-gray-600">{tx.date}</p>
                </div>
                <p className={`text-sm font-bold ${tx.color}`}>${tx.amount}</p>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <FaInbox className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No Transactions Found
              </h3>
              <p className="text-sm text-gray-500">
                Your transaction history will appear here.
              </p>
            </div>
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
        <span className="text-sm font-semibold">
          Page {numPages > 0 ? page : 0} of {numPages}
        </span>
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
