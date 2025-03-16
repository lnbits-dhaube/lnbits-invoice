"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export default function PaymentRequest() {
    const [amount, setAmount] = useState(0);
    const [memo, setMemo] = useState("");
    const [invoice, setInvoice] = useState(null);

    const sendPaymentRequest = async () => {
        try {
            const response = await fetch("/api/payment-request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ amount, memo }),
            });

            const data = await response.json();
            if (data.payment_request) {
                setInvoice(data.payment_request);
            } else {
                alert("Failed to generate invoice");
            }
        } catch (error) {
            console.error("Error requesting payment:", error);
            alert("Error requesting payment");
        }
    };

    return (
        <div className="flex flex-col items-center p-8 max-w-md mx-auto bg-white shadow-2xl rounded-lg space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Payment Request</h2>

            {/* If invoice is not generated */}
            {!invoice && (
                <>
                    <div className="w-full space-y-4">
                        <Input
                            type="number"
                            placeholder="Amount in USD"
                            value={amount}
                            onChange={(e) => setAmount(parseInt(e.target.value))}
                            className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />

                        <Input
                            type="text"
                            placeholder="Name"
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                            className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />

                        <Button
                            className="w-full p-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            onClick={sendPaymentRequest}
                        >
                            Generate Invoice
                        </Button>
                    </div>
                </>
            )}

            {/* If invoice is generated */}
            {invoice && (
                <Button
                    className="w-full p-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
                    onClick={() => {
                        // Clear the invoice state first
                        setInvoice(null);

                        // Trigger the lightning URI link
                        const lightningURI = `lightning:${invoice}`;

                        // Navigate to the lightning URI
                        window.open(lightningURI, "_blank");
                    }}
                >
                    Pay ${amount} Now
                </Button>
            )}
        </div>

    );
}
