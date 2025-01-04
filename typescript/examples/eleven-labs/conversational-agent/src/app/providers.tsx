"use client";

import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { SolanaWalletConnectors } from '@dynamic-labs/solana';

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
    return (
        <DynamicContextProvider
            settings={{
                environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID ?? "",
                walletConnectors: [SolanaWalletConnectors],
                appName: "Chesh Conversational AI",
                appLogoUrl: "https://zxiikllymaqizaoiqwam.supabase.co/storage/v1/object/public/art/dope.png"
            }}
        >
            {children}
        </DynamicContextProvider>
    );
};
