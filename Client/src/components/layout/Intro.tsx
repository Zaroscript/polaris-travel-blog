import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Intro = () => {
    const [showIntro, setShowIntro] = useState(false);

    useEffect(() => {
        // Scroll to top when page loads
        window.scrollTo(0, 0);

        // Check local storage to see if user has seen the intro before
        const hasSeenIntro = localStorage.getItem("hasSeenIntro") === "true";

        if (!hasSeenIntro) {
            setShowIntro(true);
            // Don't set hasSeenIntro to true yet - we'll do that when the user closes the intro
        }
    }, []);

    const handleCloseIntro = () => {
        setShowIntro(false);
        // Mark that the user has seen the intro
        localStorage.setItem("hasSeenIntro", "true");
    };

    return (
        <AnimatePresence>
            {showIntro && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary/80 via-background/90 to-secondary/80 backdrop-blur-md overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    {/* Close Button */}
                    <Button
                        onClick={handleCloseIntro}
                        variant="secondary"
                        size="icon"
                        className="absolute top-6 right-6 z-50 rounded-full w-10 h-10 bg-card/80 backdrop-blur border border-primary/20 hover:bg-card/50"
                    >
                        <X className="h-5 w-5" />
                    </Button>

                    {/* Background Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute rounded-full bg-white/10"
                                style={{
                                    width: Math.random() * 200 + 50,
                                    height: Math.random() * 200 + 50,
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                }}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                    opacity: [0, 0.3, 0],
                                    scale: [0, 1, 0.8],
                                    x: [0, Math.random() * 100 - 50],
                                    y: [0, Math.random() * 100 - 50]
                                }}
                                transition={{
                                    duration: 4 + Math.random() * 3,
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    delay: Math.random() * 2,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </div>

                    {/* Content Card */}
                    <motion.div
                        className="relative z-10 max-w-2xl p-8 bg-card/80 backdrop-blur-lg rounded-xl border border-primary/20 shadow-2xl"
                        initial={{ scale: 0.9, y: 30 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 10 }}
                        transition={{
                            duration: 0.6,
                            delay: 0.2,
                            type: "spring",
                            stiffness: 100
                        }}
                    >
                        <div className="text-center space-y-6">
                            {/* Logo Animation */}
                            <motion.div
                                className="inline-block p-4 rounded-full mx-auto mb-4"
                                initial={{ rotate: -5 }}
                                animate={{
                                    rotate: 5,
                                    y: [0, -10, 0]
                                }}
                                transition={{
                                    rotate: { duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                                    y: { duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
                                }}
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse"></div>
                                    <img
                                        src="/logo.svg"
                                        alt="Polaris Travel Blog"
                                        className="relative h-24 w-24 object-contain"
                                    />
                                </div>
                            </motion.div>

                            {/* Text Elements with Staggered Animation */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                            >
                                <motion.h2
                                    className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                                    initial={{ y: 20 }}
                                    animate={{ y: 0 }}
                                    transition={{ delay: 0.6, duration: 0.6 }}
                                >
                                    Polaris Travel Blog
                                </motion.h2>

                                <motion.p
                                    className="text-lg text-muted-foreground mt-4 max-w-lg mx-auto"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.8, duration: 0.6 }}
                                >
                                    We're building something amazing! Our team is working on new features
                                    and enhancements to make your travel experience extraordinary.
                                </motion.p>
                            </motion.div>

                            {/* Continue Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2, duration: 0.6 }}
                                className="pt-6"
                            >
                                <Button
                                    onClick={handleCloseIntro}
                                    className="px-8 py-6 text-base"
                                    size="lg"
                                >
                                    Explore Polaris
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default Intro;
