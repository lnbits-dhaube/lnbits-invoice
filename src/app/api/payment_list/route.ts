import { Transaction } from "@/interfaces/transactions";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        // Extract wallet_id and limit from the request URL
        const apiKey = process.env.LNBITS_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "API Key is missing" }, { status: 500 });
        }
        const walletId = process.env.WALLET_ID;


        if (!walletId) {
            return NextResponse.json({ error: "wallet_id is required" }, { status: 400 });
        }

        const { searchParams } = new URL(req.url);
        const limit = searchParams.get("limit");

        const apiUrl = `${process.env.BASE_API_URL}/payments?wallet=${walletId}&pending=false${limit ? `&limit=${limit}` : ""}`;

        // Fetch data from external API
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-Api-Key": apiKey, // Use environment variable
            },
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Error fetching payments:", data.detail);
            return NextResponse.json({ error: data.detail || "Failed to fetch payments" }, { status: response.status });
        }
        const formattedTransactions = data.filter((tx: Transaction) => tx.status === "success")
            .map((tx: Transaction) => {
                const amountValue = tx.extra?.fiat_amount ?? tx.extra?.wallet_fiat_amount ?? 0; // Ensure fallback value
                return {
                    memo: tx.memo || "No Description",
                    date: new Date(tx.time * 1000).toLocaleString(), // Convert UNIX timestamp to readable date
                    amount: `$${amountValue}`, // Display amount in USD
                    color: amountValue > 0 ? "text-green-600" : "text-red-500", // Green for positive, Red for negative
                };
            });
        return NextResponse.json(formattedTransactions); // Return fetched payments
    } catch (error) {
        console.error("Internal Server Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
