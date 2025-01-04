export function AnimatedImage() {
    return (
        <div className="relative w-96 h-96 flex items-center justify-center bg-glow-gradient rounded-2xl p-8 backdrop-blur-sm backdrop-brightness-110">
            <div className="absolute inset-4 rounded-full animate-glow-purple opacity-80 mix-blend-screen blur-md"></div>
            <div className="absolute inset-4 rounded-full animate-glow-blue opacity-80 mix-blend-screen blur-md"></div>
            <div className="absolute inset-4 rounded-full animate-glow-orange opacity-80 mix-blend-screen blur-md"></div>
            <div className="relative w-full h-full">
                <img 
                    src="https://zxiikllymaqizaoiqwam.supabase.co/storage/v1/object/public/art/dope.png"
                    alt="Animated Image"
                    className="w-full h-full object-contain animate-float rounded-xl shadow-2xl"
                />
            </div>
        </div>
    );
}
