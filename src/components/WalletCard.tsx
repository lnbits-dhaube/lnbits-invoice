export default function WalletCard() {
    return (
        <div className="bg-green-600 text-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">$100.345</h3>
            <div className="flex space-x-4 mt-4">
                <button className="bg-yellow-200 text-black px-4 py-2 rounded">Withdraw</button>
                <button className="bg-yellow-200 text-black px-4 py-2 rounded">Generate Invoice</button>
            </div>
        </div>
    );
}