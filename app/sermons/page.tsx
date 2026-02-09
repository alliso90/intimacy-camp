"use client";

import { useState, useEffect } from "react";
import { Header } from "@/src/components/layout/Header";
import Footer from "@/src/components/layout/Footer";
import { SermonCard } from "@/src/components/sermons/SermonCard";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Loader2, Search, Filter, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ["all", "sermon", "teaching", "worship"];

export default function SermonsPage() {
    const [sermons, setSermons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        fetchSermons();
    }, [selectedCategory]);

    const fetchSermons = async () => {
        try {
            setLoading(true);
            const url = new URL("/api/sermons", window.location.origin);
            if (selectedCategory !== "all") url.searchParams.append("category", selectedCategory);
            if (search) url.searchParams.append("search", search);

            const response = await fetch(url.toString());
            const data = await response.json();
            if (data.success) {
                setSermons(data.data);
            }
        } catch (error) {
            console.error("Error fetching sermons:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchSermons();
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black selection:bg-green-500/30">
            <Header />

            <main className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                {/* Hero Section */}
                <section className="mb-16 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
                    >
                        Sermon Library
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12"
                    >
                        Access our collection of life-transforming messages. Raising a pure breed of mighty men through the word.
                    </motion.p>

                    {/* Search & Filter Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800"
                    >
                        <form onSubmit={handleSearch} className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by title, speaker, or keyword..."
                                className="pl-12 h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus-visible:ring-2 focus-visible:ring-green-500 text-lg"
                            />
                        </form>

                        <div className="flex gap-2">
                            <div className="hidden md:flex bg-gray-50 dark:bg-gray-800 p-1 rounded-xl gap-1">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-6 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${selectedCategory === cat
                                            ? 'bg-white dark:bg-gray-700 text-green-600 shadow-sm'
                                            : 'text-gray-500 hover:text-green-500'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            <Button
                                type="submit"
                                className="h-14 px-8 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-green-500/20"
                            >
                                Search
                            </Button>
                        </div>
                    </motion.div>
                </section>

                {/* Content Section */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">Coming to life...</p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedCategory + search}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {sermons.length > 0 ? (
                                sermons.map((sermon) => (
                                    <SermonCard key={sermon._id} sermon={sermon} />
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center">
                                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Search className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">No sermons found</h3>
                                    <p className="text-gray-500 max-w-xs mx-auto">
                                        We couldn't find any sermons matching your criteria. Try adjusting your search or filters.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                )}
            </main>

            <Footer />
        </div>
    );
}
