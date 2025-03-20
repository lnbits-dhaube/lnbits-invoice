export default function Transactions() {
    const transactions = [
        { name: "MacDonald's", date: "Mar 12, 2025", amount: "-$10.05", color: "text-red-500" },
        { name: "General Store", date: "Mar 12, 2025", amount: "-$10.05", color: "text-red-500" },
        { name: "GameHub", date: "Mar 12, 2025", amount: "-$20.05", color: "text-red-500" },
        { name: "Daniel", date: "Mar 27, 2025", amount: "$50.00", color: "text-green-500" },
    ];

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-2">Recent Transactions</h3>
            <div className="space-y-2">
                {transactions.map((tx, index) => (
                    <div key={index} className="flex justify-between p-2  shadow-sm shadow-gray-500 bg-yellow-50 rounded">
                        <div>
                            <p className="text-sm font-semibold">{tx.name}</p>
                            <p className="text-xs text-gray-600">{tx.date}</p>
                        </div>
                        <p className={`text-sm font-bold ${tx.color}`}>{tx.amount}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
