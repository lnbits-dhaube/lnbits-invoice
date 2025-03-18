"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FaUser, FaStickyNote, FaDollarSign } from "react-icons/fa";

export default function PaymentRequest() {
    const [name, setName] = useState<string>("");
    const [amount, setAmount] = useState<number | "">("");
    const [memo, setMemo] = useState<string>("");
    const [invoice, setInvoice] = useState<string | null>(null);
    const [agreed, setAgreed] = useState<boolean>(false);

    const sendPaymentRequest = async () => {
        if (!agreed) {
            alert("You must agree to the Terms & Conditions.");
            return;
        }
        if (!amount || Number(amount) <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        try {
            const response = await fetch("/api/payment-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "memo": name, "amount": Number(amount), "unhashed_description": memo }),
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
        <div className="flex flex-col items-center w-full justify-center min-h-screen overflow-y-clip px-6 py-20 my-auto">
            <Card className="relative flex-grow justify-center w-full max-w-md bg-white shadow-lg rounded-sm pt-10 my-auto">
                <CardHeader className="absolute top-0 w-full text-center my-4">
                    <CardTitle className="text-xl font-semibold">
                        <span className="text-black">Make </span>
                        <span className="text-green-600 font-bold">Payment</span>
                        <span className="text-black"> Request</span>
                    </CardTitle>
                    <hr className="w-full p-0 border-1" />
                    <h2 className="text-center text-2xl font-bold text-green-700 mt-6">
                        WELCOME
                    </h2>
                </CardHeader>
                <CardContent className="p-6">
                    {!invoice ? (
                        <div className="space-y-6">
                            <div className="relative">
                                <FaUser className="absolute left-3 top-3 text-gray-500" />
                                <Input
                                    type="text"
                                    placeholder="Enter Your Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <div className="relative">
                                <FaDollarSign className="absolute left-3 top-3 text-gray-500" />
                                <Input
                                    type="number"
                                    placeholder="Amount"
                                    prefix="$"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                                    className="pl-10"
                                />
                            </div>
                            <div className="relative">
                                <FaStickyNote className="absolute left-3 top-3 text-gray-500" />
                                <textarea
                                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Remarks"
                                    value={memo}
                                    rows={3}
                                    onChange={(e) => setMemo(e.target.value)}

                                />
                            </div>
                            {/* <div className="flex items-center space-x-2 my-10">
                                <Checkbox
                                    id="terms"
                                    checked={agreed}
                                    onCheckedChange={(checked) => setAgreed(checked === true)}
                                />
                                <Label htmlFor="terms" className="text-sm">
                                    I agree with the{" "}
                                    <span className="text-blue-500 cursor-pointer">Terms & Conditions</span>
                                </Label>
                            </div> */}
                            <Button
                                className="w-full bg-green-600 hover:bg-green-700 font-bold text-lg py-4 mt-6"
                                onClick={sendPaymentRequest}
                            >
                                Generate Invoice
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center text-green-700 text-xl font-semibold mb-4">
                            Invoice Generated Successfully !!
                            <Button
                                className="w-full bg-green-600 mt-4 text-xl font-bold text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
                                onClick={() => {
                                    setInvoice(null);
                                    setName("");
                                    setAmount("");
                                    setMemo("");
                                    window.open(`lightning:${invoice}`, "_blank");
                                }}
                            >
                                Pay ${amount} Now
                            </Button>

                            <Button
                                className="w-full mt-4 text-xl text-red-500 hover:text-red-700 bg-white border-none"
                                onClick={() => {
                                    setInvoice(null);
                                }}
                            >
                                cancel
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
            {/* Bottom Text with Equal Spacing */}
            <div className="flex-grow flex items-center justify-center text-center text-white font-bold ">
                <p className="text-xl">Your Trusted Partner in Digital Transactions</p>
            </div>

        </div>
    );
}
