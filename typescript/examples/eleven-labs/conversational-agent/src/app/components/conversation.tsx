"use client";

import React, { useCallback } from "react";

import { useConversation } from "@11labs/react";
import {
    DynamicWidget,
    useDynamicContext,
    useIsLoggedIn,
} from "@dynamic-labs/sdk-react-core";
import { isSolanaWallet } from "@dynamic-labs/solana";
import { getOnChainTools } from "@goat-sdk/adapter-eleven-labs";

import type { TrendingToken } from "../utils";
import {
    createSolanaWalletFromDynamic,
    getTrendingTokens,
} from "../utils";

export function Conversation() {
    const isLoggedIn = useIsLoggedIn();
    const { primaryWallet, sdkHasLoaded } = useDynamicContext();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const isConnected = sdkHasLoaded && isLoggedIn && primaryWallet;

    React.useEffect(() => {
        if (error && isConnected) {
            setError(null);
        }
    }, [error, isConnected]);

    const conversation = useConversation({
        onConnect: () => console.log("Connected"),
        onDisconnect: () => console.log("Disconnected"),
        onMessage: (message) => console.log("Message:", message),
        onError: (error) => console.error("Error:", error),
    });

    const startConversation = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Request microphone permission
            await navigator.mediaDevices.getUserMedia({ audio: true });

            if (!primaryWallet) {
                throw new Error("Wallet not connected");
            }

            if (!isSolanaWallet(primaryWallet)) {
                throw new Error("Please connect a Solana wallet");
            }

            let connection;
            let signer;
            try {
                connection = await primaryWallet.getConnection();
                signer = await primaryWallet.getSigner();
            } catch (error: any) {
                console.error("Wallet connection error:", error);
                if (typeof error === 'object' && error?.message?.includes("rejected")) {
                    throw new Error("Wallet connection was rejected. Please try again.");
                }
                throw new Error("Failed to connect to wallet. Please try again.");
            }

            const tools = await getOnChainTools({
                wallet: createSolanaWalletFromDynamic(connection, signer),
                plugins: [],
                options: {
                    logTools: true
                }
            });

            console.log("tools", tools);

            // Start the conversation with your agent
            await conversation.startSession({
                agentId: process.env.NEXT_PUBLIC_ELEVEN_LABS_AGENT_ID ?? "",
                clientTools: {
                    ...tools,
                    triggerBrowserAlert: async (parameters: { message: string }) => {
                        alert(parameters.message);
                    },
                    getTrendingSolanaTokens: async () => {
                        try {
                            const tokens = await getTrendingTokens();
                            const formattedTokens = tokens.map((token: TrendingToken) => {
                                const priceChange = token.priceChange24h.toFixed(2);
                                const priceChangeColor = parseFloat(priceChange) >= 0 ? '📈' : '📉';
                                return `${token.name} (${token.symbol})\n` +
                                       `Price: $${token.price.toFixed(2)}\n` +
                                       `24h Change: ${priceChange}% ${priceChangeColor}\n` +
                                       `Volume: $${token.volume24h.toLocaleString()}\n`;
                            });
                            return `Top Trending Solana Tokens:\n\n${formattedTokens.join('\n')}`;
                        } catch (error) {
                            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch trending tokens';
                            console.error('Failed to get trending tokens:', errorMessage);
                            return `Error: ${errorMessage}. Please try again later.`;
                        }
                    }
                },
            });
            setIsLoading(false);
        } catch (error: any) {
            const errorMessage = typeof error === 'object' && error?.message ? error.message : "Failed to start conversation";
            console.error("Conversation error:", errorMessage);
            setError(errorMessage);
            setIsLoading(false);
        }
    }, [conversation, primaryWallet]);

    const stopConversation = useCallback(async () => {
        try {
            setIsLoading(true);
            await conversation.endSession();
        } catch (error: any) {
            console.error("Failed to stop conversation:", error);
        } finally {
            setIsLoading(false);
        }
    }, [conversation]);

    if (!sdkHasLoaded) {
        return <div className="text-center p-4">Loading SDK...</div>;
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <h1 className="text-2xl font-bold">1. Connect Solana Wallet</h1>
            <p className="text-sm text-gray-600 mb-4">Connect your Solana wallet to interact with the AI agent</p>
            <DynamicWidget />

            <h1 className="text-2xl font-bold">2. Start Conversation with Agent</h1>
            <p className="text-sm text-gray-600 mb-4">
                {isConnected 
                    ? "Click 'Start Conversation' and allow microphone access to begin talking with the AI agent" 
                    : "Please connect your wallet first"}
            </p>
            {error && (
                <div className="text-red-500 text-sm mb-4">
                    {error}
                </div>
            )}
            <div className="flex flex-col items-center gap-4">
                <div className="flex gap-2">
                    <button
                        onClick={startConversation}
                        disabled={conversation.status === "connected" || !isConnected || isLoading}
                        className={`px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        type="button"
                    >
                        {isLoading ? 'Connecting...' : 'Start Conversation'}
                    </button>
                    <button
                        onClick={stopConversation}
                        disabled={conversation.status !== "connected" || isLoading}
                        className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300"
                        type="button"
                    >
                        Stop Conversation
                    </button>
                </div>

                <div className="flex flex-col items-center text-sm">
                    <p className="text-gray-600">
                        Status: <span className="font-medium text-black">{conversation.status}</span>
                    </p>
                    {conversation.status === "connected" && (
                        <p className="mt-1">
                            Agent is{" "}
                            <span className={`font-medium ${conversation.isSpeaking ? "text-green-600" : "text-blue-600"}`}>
                                {conversation.isSpeaking ? "speaking" : "listening"}
                            </span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
