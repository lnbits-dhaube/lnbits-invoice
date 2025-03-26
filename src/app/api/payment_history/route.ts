import { PaymentHistory } from "@/interfaces/payment_history";
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
        const group = searchParams.get("group");

        const apiUrl = `${process.env.BASE_API_URL}/payments/history?wallet=${walletId}${(group && group !== 'week') ? `&group=${group}` : ""}`;

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
        let history;
        if (group === "day") {
            const today = new Date();
            history = data.map((tx: PaymentHistory) => {
                if (new Date(tx.date).getDate() === today.getDate()) {
                    return {
                        date: tx.date,
                        income: tx.income,
                        spending: tx.spending,
                        balance: tx.balance,
                    };
                }
            });
        } else if (group === "week") {
            const today = new Date();
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(today.getDate() - 7);

            let totalIncome = 0;
            let totalSpending = 0;
            let totalBalance = 0;

            data.forEach((tx: PaymentHistory) => {
                const txDate = new Date(tx.date);
                if (txDate >= oneWeekAgo && txDate <= today) {
                    totalIncome += tx.income;
                    totalSpending += tx.spending;
                    totalBalance = tx.balance; // Assuming balance is the latest balance, not cumulative
                }
            });

            history = {
                date: `${oneWeekAgo.toISOString().split("T")[0]} to ${today.toISOString().split("T")[0]}`,
                income: totalIncome,
                spending: totalSpending,
                balance: totalBalance,
            };
        } else if (group === "month") {
            const today = new Date();
            history = data.map((tx: PaymentHistory) => {
                if (new Date(tx.date).getMonth() === today.getMonth()) {
                    return {
                        date: tx.date,
                        income: tx.income,
                        spending: tx.spending,
                        balance: tx.balance,
                    };
                }
            });
        } else {
            history = data;
        }
        return NextResponse.json(history); // Return fetched payments

    } catch (error) {
        console.error("Internal Server Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
