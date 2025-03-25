interface Extra {
    wallet_fiat_currency?: string;
    wallet_fiat_rate?: number;
    wallet_fiat_amount?: number;
    fiat_currency?: string;
    fiat_rate?: number;
    fiat_amount?: number;
}

export interface Transaction {
    status?: string;
    pending?: boolean;
    out?: boolean;
    checking_id?: string;
    amount?: string;
    fee?: string;
    memo?: string;
    time: number;
    bolt11?: string;
    preimage?: string;
    payment_hash?: string;
    expiry?: number;
    extra?: Extra;
    wallet_id?: string;
    webhook?: string;
    webhook_status?: string;
    color: "text-green-500";
}

export interface TransactionResponse {
    memo: string;
    date: string;
    amount: number;
    color: string;
}