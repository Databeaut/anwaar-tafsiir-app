import { motion } from "framer-motion";
import { Lock } from "lucide-react";

const ComingSoonPlaceholder = () => {
    return (
        <div className="relative w-full aspect-video rounded-3xl overflow-hidden group">
            {/* Background Base */}
            <div className="absolute inset-0 bg-[#0A0A0A]" />

            {/* Premium Glass Effect Container */}
            <div className="absolute inset-0 flex items-center justify-center p-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full h-full max-w-2xl max-h-[80%] rounded-2xl overflow-hidden"
                >
                    {/* Glassmorphism Background */}
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10" />

                    {/* Animated Gradient Shine */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-purple-500/10 animate-pulse" />

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col items-center justify-center text-center space-y-6 p-8">
                        {/* Icon */}
                        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl shadow-2xl">
                            <Lock className="w-8 h-8 text-zinc-400" />
                        </div>

                        {/* Text */}
                        <div className="space-y-2">
                            <h3 className="text-3xl font-bold text-white tracking-tight">Dhawaan Filo</h3>
                            <p className="text-zinc-400 max-w-md mx-auto">
                                Casharkan weli diyaar ma aha. Fadlan dib ugu soo noqo waqti dhow Insha Allah.
                            </p>
                        </div>

                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Coming Soon</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Ambient Glows */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />
        </div>
    );
};

export default ComingSoonPlaceholder;
