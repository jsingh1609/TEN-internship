"use client";

import { Home } from "lucide-react";
import { motion } from "framer-motion";

export function LoadingScreen() {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                <Home className="w-16 h-16 bg-gradient-to-r from-primary to-fuchsia-500 text-transparent bg-clip-text" />
            </motion.div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground/80">
                PricePredictor
            </h1>
        </motion.div>
    );
};
