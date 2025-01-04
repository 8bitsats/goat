"use client";

import { AnimatedImage } from './components/AnimatedImage';
import { Conversation } from './components/conversation';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-12">
            <div className="z-10 max-w-5xl w-full flex flex-col items-center justify-center gap-12">
                <h1 className="text-4xl font-bold text-center">Chesh Conversational AI<br/><span className="text-lg text-purple-500">powered by Eleven Labs</span></h1>
                <div className="w-full flex justify-center">
                    <AnimatedImage />
                </div>
                <div className="w-full font-mono text-sm">
                    <Conversation />
                </div>
            </div>
        </main>
    );
}
