import { solana } from "@goat-sdk/wallet-solana";
import {
    Connection,
    Transaction,
    VersionedTransaction,
} from "@solana/web3.js";

interface DynamicSolanaWallet {
    publicKey?: { toBytes(): Uint8Array };
    signTransaction(tx: Transaction | VersionedTransaction): Promise<Transaction | VersionedTransaction>;
    signAllTransactions(txs: (Transaction | VersionedTransaction)[]): Promise<(Transaction | VersionedTransaction)[]>;
}

export function createSolanaWalletFromDynamic(connection: Connection, signer: DynamicSolanaWallet) {
    if (!signer.publicKey) {
        throw new Error("Wallet public key is required");
    }
    
    return solana({
        connection,
        keypair: {
            publicKey: signer.publicKey,
            signTransaction: signer.signTransaction.bind(signer),
            signAllTransactions: signer.signAllTransactions.bind(signer),
        } as any,
    });
}

export interface TrendingToken {
    address: string;
    symbol: string;
    name: string;
    price: number;
    priceChange24h: number;
    volume24h: number;
}

export async function getTrendingTokens(): Promise<TrendingToken[]> {
    try {
        const response = await fetch(
            'https://public-api.birdeye.so/defi/token_trending?sort_by=rank&sort_type=asc&offset=0&limit=20',
            {
                headers: {
                    'X-API-KEY': process.env.NEXT_PUBLIC_BIRDEYE_API_KEY ?? '',
                    'accept': 'application/json',
                    'x-chain': 'solana'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Bird Eye API error: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.data?.items || !Array.isArray(data.data.items)) {
            throw new Error('Invalid response format from Bird Eye API');
        }

        return data.data.items.map((item: any) => ({
            address: item.address,
            symbol: item.symbol,
            name: item.name,
            price: item.price,
            priceChange24h: item.priceChange24h,
            volume24h: item.volume24h
        }));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch trending tokens';
        console.error('Bird Eye API error:', errorMessage);
        throw new Error(errorMessage);
    }
}
