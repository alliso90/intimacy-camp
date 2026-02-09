"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, Home, Shield } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";

export default function AdminLoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        setError("");
        
        // Basic validation
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                // Save token and user data
                localStorage.setItem("token", data.data.token);
                localStorage.setItem("user", JSON.stringify(data.data.user));
                
                // Redirect to dashboard
                router.push("/dashboard");
            } else {
                setError(data.error || "Invalid credentials");
            }
        } catch (err) {
            setError("Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 flex items-center justify-center p-4">
            {/* Home Button */}
            <a
                href="/"
                className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 text-white font-medium hover:bg-white/20"
            >
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">Home</span>
            </a>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <form onSubmit={handleSubmit}>
                    {/* Logo/Title Section */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
                            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4 shadow-lg"
                        >
                            <Shield className="w-10 h-10 text-white" />
                        </motion.div>
                        <h1 className="text-4xl font-bold text-white mb-2">Admin Portal</h1>
                        <p className="text-purple-200">The Intimacy Camp 2026</p>
                    </div>

                    {/* Login Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8"
                    >
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome Back</h2>
                            <p className="text-gray-600 text-sm">Sign in to access the admin dashboard</p>
                        </div>

                        <div className="space-y-5">
                            {/* Email Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@tic26.com"
                                        className="w-full h-12 pl-11 pr-4 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full h-12 pl-11 pr-4 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isLoading || !email || !password}
                                className={`w-full h-12 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                                    isLoading || !email || !password
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl"
                                } text-white`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Logging in...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="w-5 h-5" />
                                        Sign In
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </form>

                {/* Demo Credentials */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 text-center"
                >
                    <div className="inline-block bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 text-white text-sm">
                        <p className="text-purple-200 mb-2 font-medium">Demo Credentials</p>
                        <p>
                            <span className="font-mono bg-white/20 px-2 py-1 rounded">admin@tic26.com</span>
                            {" / "}
                            <span className="font-mono bg-white/20 px-2 py-1 rounded">admin123</span>
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}