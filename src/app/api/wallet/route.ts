import { NextResponse } from "next/server";
import { satsToUsd } from "@/utils/sats_to_usd";
export async function GET() {
    try {
        const apiKey = process.env.LNBITS_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "API Key is missing" }, { status: 500 });
        }
        const response = await fetch(`${process.env.BASE_API_URL}/wallet`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey, // Use environment variable
            },
        });
        const data = await response.json();
        if (!response.ok) {
            console.error("Wallet error:", data.detail);
            return NextResponse.json({ error: data.detail || "Failed to fetch wallet" }, { status: response.status });
        }
        const balance_msats = data.balance;
        const balance_sats = balance_msats / 1000;
        const balance_usd = await satsToUsd(balance_sats);
        const balance_btc = balance_sats / 100_000_000;

        console.log("Wallet balance in BTC:", balance_btc);
        console.log("Wallet balance in USD:", balance_usd);
        return NextResponse.json({ balance: balance_usd.toFixed(3), btc_balance: balance_btc.toFixed(8) });
    } catch (error) {
        console.error("Wallet error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    };
};