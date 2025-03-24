import { NextResponse } from "next/server";

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
        if (!response.ok){
            console.error("Wallet error:", data.detail);
            return NextResponse.json({ error: data.detail || "Failed to fetch wallet" }, { status: response.status });
        }
        const balance_msats = data.balance;
        const balance_sats = balance_msats / 1000;
        const balance_btc = balance_sats / 100_000_000;
        const btcPriceRes = await fetch("https://blockchain.info/ticker");
        const btcPriceData = await btcPriceRes.json();
        const btcPrice = btcPriceData.USD.last;
        const balance_usd = balance_btc * btcPrice;
        console.log("Wallet balance in USD:", balance_usd);
        return NextResponse.json({ balance: balance_usd.toFixed(3)});
    } catch (error) {
        console.error("Wallet error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    };
};