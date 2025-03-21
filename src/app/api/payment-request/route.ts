import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const apiKey = process.env.LNBITS_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "API Key is missing" }, { status: 500 });
        }

        const { amount, memo, unhashed_description } = await req.json();
        console.log("Payment request:", { amount, memo, unhashed_description });
        const description = Buffer.from(unhashed_description, 'utf-8').toString('hex');

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        const response = await fetch(`${process.env.BASE_API_URL}/payments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Api-Key": apiKey, // Use environment variable
            },
            body: JSON.stringify({
                out: false,
                amount: amount, // Convert to millisatoshis
                memo: memo || "Payment Request",
                unhashed_description: description || "",
                unit: "USD",
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Payment request error:", data.detail)
            return NextResponse.json({ error: data.detail || "Error creating invoice" }, { status: response.status });
        }

        return NextResponse.json({ payment_request: data.payment_request });
    } catch (error) {
        console.error("Payment request error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
