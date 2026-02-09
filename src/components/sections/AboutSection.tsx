"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useIntersectionObserver } from "@/src/hooks/useIntersectionObserver";

export function AboutSection() {
    const [ref, isVisible] = useIntersectionObserver({
        threshold: 0.1,
        freezeOnceVisible: true,
    });

    const highlights = [
        "Powerful worship and prayer sessions",
        "Anointed teaching from seasoned ministers",
        "Personal spiritual guidance and counseling",
        "Holy Ghost fire impartation services",
        "Bible study and scripture meditation",
        "Corporate fasting and intercession",
        "Fellowship with like-minded believers",
        "Healing and deliverance services"
    ];

    return (
        <section id="about" ref={ref} className="py-20 bg-[#0b1517]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={isVisible ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                                About The Retreat
                            </span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-white">
                            The Intimacy Camp 2026:<br />
                            <span className="text-green-500">
                                Encountering God&apos;s Presence
                            </span>
                        </h2>

                        <p className="text-lg text-gray-400">
                            The Intimacy Camp is a transformative retreat designed to draw believers into
                            deeper intimacy with God. Based on Psalms 24:6, we are raising a generation
                            that seeks God&apos;s face, not just His hands—the Jacob Generation who will carry
                            God&apos;s glory into the nations.
                        </p>

                        <p className="text-lg text-gray-400">
                            This three-day retreat in Ago-Iwowe, Ogun State, Nigeria, is a divine appointment
                            for spiritual refreshing, personal revival, and corporate awakening. Experience
                            the power of God in an atmosphere of worship, prayer, and prophetic impartation.
                        </p>

                        {/* Retreat Details */}
                        <div className="bg-gray-900/50 border-l-4 border-green-500 pl-6 py-4 my-4 rounded-r-lg">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <p className="text-white font-medium">Date: <span className="text-green-400">April 5th – 7th, 2026</span></p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <p className="text-white font-medium">Location: <span className="text-green-400">Ago-Iwowe, Ogun State, Nigeria</span></p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <p className="text-white font-medium">Theme: <span className="text-green-400">The Jacob Generation</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Scripture Reference */}
                        <div className="bg-green-900/20 p-6 rounded-xl border border-green-500/20">
                            <p className="text-green-400 font-bold mb-2 text-sm uppercase tracking-wide">SCRIPTURE FOCUS</p>
                            <p className="text-white text-lg font-medium mb-2">Psalms 24:6</p>
                            <p className="text-gray-300 italic">
                                &quot;This is the generation of those who seek Him, who seek Your face, O God of Jacob.&quot;
                            </p>
                        </div>

                        <div className="pt-4">
                            <h3 className="text-xl font-bold text-white mb-4">What You&apos;ll Experience</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {highlights.map((highlight, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={isVisible ? { opacity: 1, x: 0 } : {}}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        className="flex items-start gap-3 bg-gray-900/30 p-3 rounded-lg"
                                    >
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-300 text-sm">
                                            {highlight}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Retreat Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={isVisible ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="aspect-square rounded-2xl bg-gradient-to-br from-green-600/30 to-green-800/30 p-1 border border-green-500/20 overflow-hidden">
                            <div className="w-full h-full rounded-xl bg-gray-900/50 flex flex-col items-center justify-center p-8 backdrop-blur-sm">
                                {/* Main Retreat Focus */}
                                <div className="text-center mb-8">
                                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 border-2 border-green-500/30">
                                        <span className="text-4xl">🔥</span>
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-2">
                                        A Divine Encounter
                                    </h3>
                                    <p className="text-gray-400">
                                        Prepare for a life-changing encounter with God
                                    </p>
                                </div>

                                {/* Schedule Preview */}
                                <div className="w-full max-w-md space-y-4">
                                    <div className="bg-green-900/30 p-4 rounded-xl border border-green-500/10">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-white font-bold">Day 1</p>
                                            <p className="text-green-400 text-sm">April 5th</p>
                                        </div>
                                        <p className="text-gray-300 text-sm">
                                            Evening Revival Service: The Fire Altar
                                        </p>
                                    </div>

                                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-white font-bold">Day 2</p>
                                            <p className="text-green-400 text-sm">April 6th</p>
                                        </div>
                                        <p className="text-gray-300 text-sm">
                                            Morning Prayer · Teaching Sessions · Night of Prophetic Impartation
                                        </p>
                                    </div>

                                    <div className="bg-green-900/30 p-4 rounded-xl border border-green-500/10">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-white font-bold">Day 3</p>
                                            <p className="text-green-400 text-sm">April 7th</p>
                                        </div>
                                        <p className="text-gray-300 text-sm">
                                            Communion Service · Healing Service · Commissioning
                                        </p>
                                    </div>
                                </div>

                                {/* Call to Action */}
                                <div className="mt-8 text-center">
                                    <p className="text-gray-400 text-sm mb-2">Limited Spaces Available</p>
                                    <div className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-bold hover:bg-green-700 transition-colors cursor-pointer">
                                        <span>Register Now</span>
                                        <span>→</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-600 rounded-full blur-3xl opacity-20" />
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-green-800 rounded-full blur-3xl opacity-20" />

                        {/* Floating elements */}
                        <div className="absolute -top-2 left-8 w-4 h-4 bg-green-500/50 rounded-full animate-pulse" />
                        <div className="absolute top-12 -right-2 w-3 h-3 bg-green-400/30 rounded-full animate-pulse delay-300" />
                        <div className="absolute -bottom-2 right-12 w-5 h-5 bg-green-600/40 rounded-full animate-pulse delay-500" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}