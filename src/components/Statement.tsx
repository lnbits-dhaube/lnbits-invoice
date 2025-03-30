"use client";
import { useState, useEffect } from "react";
import { TransactionResponse } from "@/interfaces/transactions";
import { PaymentHistory } from "@/interfaces/payment_history";
import { satsToUsd } from "@/utils/sats_to_usd";
import api from "@/api-services/api-services";
import Skeleton from "@/components/ui/skeleton";
import { FaInbox } from "react-icons/fa";

export default function Statement() {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    TransactionResponse[]
  >([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTransaction, setActiveTransaction] = useState<
    TransactionResponse[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const limit = 10; // Number of transactions per page
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [history, setHistory] = useState<PaymentHistory | null>(null);
  const [period, setPeriod] = useState("day");
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await api.get("/my-payment-list");
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
      setLoading(false);
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    const payment_history = async () => {
      setHistoryLoading(true);
      try {
        const response = await api.get(`/my-payment-history?group=${period}`);
        let data = response.data;
        if (Array.isArray(data)) {
          data = data[0];
        }
        if (!data) {
          setHistory(null);
          return;
        }
        data.income = parseFloat(
          (await satsToUsd((data?.income ?? 0) / 1000)).toFixed(4)
        );
        data.spending = parseFloat(
          (await satsToUsd((data?.spending ?? 0) / 1000)).toFixed(4)
        );
        setHistory(data);
      } catch (error) {
        console.error("Error fetching payment history:", error);
      } finally {
        setHistoryLoading(false);
      }
    };
    payment_history();
  }, [period]);

  useEffect(() => {
    const filtered = transactions.filter((tx) =>
      tx.memo.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTransactions(filtered);
    setNumPages(Math.ceil(filtered.length / limit));
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    setActiveTransaction(
      filteredTransactions.slice((page - 1) * limit, page * limit)
    );
  }, [page, filteredTransactions]);

  const applyDateFilter = () => {
    const filtered = transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      return (
        (!fromDate || txDate >= new Date(fromDate)) &&
        (!toDate || txDate <= new Date(toDate))
      );
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
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by Name..."
            className="px-4 py-2 border rounded-md w-full md:w-1/3"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex gap-2 flex-row justify-center md:justify-start w-full md:w-auto">
            <button
              className={`bg-gray-200 px-3 py-2 rounded-md text-sm ${
                period === "day" ? "bg-green-300" : ""
              }`}
              onClick={() => filterByTime("day")}
            >
              Day
            </button>
            <button
              className={`bg-gray-200 px-3 py-2 rounded-md text-sm ${
                period === "week" ? "bg-green-300" : ""
              }`}
              onClick={() => filterByTime("week")}
            >
              Week
            </button>
            <button
              className={`bg-gray-200 px-3 py-2 rounded-md text-sm ${
                period === "month" ? "bg-green-300" : ""
              }`}
              onClick={() => filterByTime("month")}
            >
              Month
            </button>
            <button
              className="bg-blue-500 text-white px-3 py-2 rounded-md text-sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Hide Filter" : "Filter"}
            </button>
          </div>
        </div>

        {/* Date Filter & Shortcuts */}
        {showFilters && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex flex-col gap-4">
                <input
                  type="date"
                  className="px-4 py-2 border rounded-md w-full"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
                <input
                  type="date"
                  className="px-4 py-2 border rounded-md w-full"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
                <div className="flex gap-4 justify-end">
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

      {/* Total Income and Spending */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
        <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
          <span className="font-semibold text-gray-700">Total Income:</span>
          {historyLoading ? (
            <Skeleton className="h-6 w-16" />
          ) : (
            <span className="text-green-600 font-bold">
              ${history?.income ?? 0}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
          <span className="font-semibold text-gray-700">Total Spending:</span>
          {historyLoading ? (
            <Skeleton className="h-6 w-16" />
          ) : (
            <span className="text-red-600 font-bold">
              ${history?.spending ?? 0}
            </span>
          )}
        </div>
      </div>

      {/* Transactions List */}
      {loading ? (
        <div className="space-y-2 mt-4">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex justify-between p-3 bg-yellow-50 rounded"
            >
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2 mt-4">
          {activeTransaction.length > 0 ? (
            activeTransaction.map((tx, index) => (
              <div
                key={index}
                className="flex justify-between p-3 bg-yellow-50 rounded"
              >
                <div>
                  <p className="text-sm font-semibold">{tx.memo}</p>
                  <p className="text-xs text-gray-600">{tx.date}</p>
                </div>
                <p className={`text-sm font-bold ${tx.color}`}>${tx.amount}</p>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <FaInbox className="w-10 h-10 text-green-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No Transactions Found
              </h3>
              <p className="text-sm text-gray-500">
                Transactions matching your filters will appear here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 pt-2">
        <button
          className="bg-gray-200 px-3 py-1.5 rounded text-sm disabled:opacity-50"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-sm font-semibold">
          Page {numPages > 0 ? page : 0} of {numPages}
        </span>
        <button
          className="bg-gray-200 px-3 py-1.5 rounded text-sm disabled:opacity-50"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page >= numPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
