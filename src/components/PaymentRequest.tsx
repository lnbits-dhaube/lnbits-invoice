"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
import { FaUser, FaStickyNote, FaDollarSign, } from "react-icons/fa";

import Loading from "@/utils/loading";

export default function PaymentRequest() {
    const [name, setName] = useState<string>("");
    const [amount, setAmount] = useState<number | "">("");
    const [memo, setMemo] = useState<string>("");
    const [invoice, setInvoice] = useState<string | null>(null);
    const [processing, setProcessing] = useState<boolean>(false);
    // const [agreed, setAgreed] = useState<boolean>(false);

    const sendPaymentRequest = async () => {
        // if (!agreed) {
        //     alert("You must agree to the Terms & Conditions.");
        //     return;
        // }
        if (!amount || Number(amount) <= 0) {
            alert("Please enter a valid amount.");
            return;
        }
        setProcessing(true);

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
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full justify-center min-h-screen overflow-y-clip px-6 py-20 my-auto">
            <Card className="relative flex-grow justify-center w-full max-w-md bg-white shadow-lg rounded-sm pt-10 my-auto">
                <CardHeader className=" w-full text-center my-4">
                    <CardTitle className="text-xl font-semibold">
                        <span className="text-black">Make </span>
                        <span className="text-green-600 font-bold">Payment</span>
                        <span className="text-black"> Request</span>
                    </CardTitle>
                    <hr className="w-full p-0 border-1" />
                    {/* <h2 className="text-center text-2xl font-bold text-green-700">
                        WELCOME
                    </h2> */}
                </CardHeader>
                <CardContent className="p-6 pt-0">
                    {processing ? (
                        <div className="flex justify-center py-10">
                            <Loading />
                        </div>
                    ) : !invoice ? (
                        <div className="space-y-6">
                            <div className="relative">
                                <FaUser className="absolute left-3 top-2 text-gray-500 h-10" />
                                <Input
                                    type="text"
                                    placeholder="Enter Your Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="pl-10 h-14 text-lg md:text-lg"
                                />
                            </div>
                            <div className="relative">
                                <FaDollarSign className="absolute left-3 top-2 text-gray-500 h-10" />
                                <Input
                                    type="number"
                                    placeholder="Amount"
                                    prefix="$"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                                    className="pl-10 h-14 text-lg md:text-lg"
                                />
                                <div
                                    className="relative flex flex-row gap-4 my-4 items-center justify-center">
                                    <button
                                        className={`flex-col text-gray-500  border shadow-xs rounded-md w-12 h-10 ${amount === 10 ? "bg-green-600 text-white" : ""}`}
                                        onClick={() => setAmount(10)}>
                                        <span>$10</span>
                                    </button>
                                    <button
                                        className={`flex-col text-gray-500 border shadow-xs rounded-md w-12 h-10 ${amount === 20 ? "bg-green-600 text-white" : ""}`}
                                        onClick={() => setAmount(20)}>
                                        <span>$20</span>
                                    </button>
                                    <button
                                        className={`flex-col text-gray-500 border shadow-xs rounded-md w-12 h-10 ${amount === 40 ? "bg-green-600 text-white" : ""}`}
                                        onClick={() => setAmount(40)}>
                                        <span>$40</span>
                                    </button>
                                    <button
                                        className={`flex-col text-gray-500 border shadow-xs rounded-md w-12 h-10 ${amount === 50 ? "bg-green-600 text-white" : ""}`}
                                        onClick={() => setAmount(50)}>
                                        <span>$50</span>
                                    </button>
                                    <button
                                        className={`flex-col text-gray-500 border shadow-xs rounded-md w-12 h-10 ${amount === 100 ? "bg-green-600 text-white" : ""}`}
                                        onClick={() => setAmount(100)}>
                                        <span>$100</span>
                                    </button>
                                </div>
                            </div>
                            <div className="relative">
                                <FaStickyNote className="absolute left-3 top-1 text-gray-500 h-10" />
                                <textarea
                                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 text-lg md:text-lg"
                                    placeholder="Remarks"
                                    value={memo}
                                    rows={4}
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
                                className="w-full flex-row bg-green-600 hover:bg-green-700 font-bold text-xl mt-6 h-14"
                                size="lg"
                                onClick={sendPaymentRequest}
                            >
                                Generate Invoice
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center text-green-700 text-xl font-semibold mb-4">
                            Invoice Generated Successfully !!
                            <Button
                                className="w-full bg-green-600 mt-4 text-xl font-bold text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 h-14"
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
                                className="w-full mt-4 text-xl text-red-500 hover:text-red-700 bg-white border-none shadow-none"
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
