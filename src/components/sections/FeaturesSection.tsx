"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { FEATURES } from "@/src/lib/constants";
import { useIntersectionObserver } from "@/src/hooks/useIntersectionObserver";

export function FeaturesSection() {
    const [ref, isVisible] = useIntersectionObserver({
        threshold: 0.1,
        freezeOnceVisible: true,
    });

    return (
        <section id="features" ref={ref} className="py-20 bg-[#0b1517]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                            Why Attend
                        </span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Experience <span className="text-green-500">Divine Transformation</span>
                    </h2>
                    
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        A powerful encounter designed to deepen your walk with God and equip you for kingdom impact
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {FEATURES.map((feature, index) => {
                        const Icon = (LucideIcons as any)[feature.icon];
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className="h-full bg-gray-900/50 border border-gray-800 hover:border-green-500/30 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 group backdrop-blur-sm">
                                    <CardHeader>
                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-600/20 to-green-800/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-green-500/10 group-hover:border-green-500/30">
                                            {Icon && <Icon className="w-7 h-7 text-green-400" />}
                                        </div>
                                        <CardTitle className="text-xl text-white">
                                            {feature.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base text-gray-400">
                                            {feature.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Additional Benefits */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="mt-16 pt-16 border-t border-gray-800"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6 bg-gray-900/30 rounded-2xl border border-gray-800">
                            <div className="text-4xl mb-4">🙏</div>
                            <h4 className="text-xl font-bold text-white mb-2">Spiritual Breakthrough</h4>
                            <p className="text-gray-400">Experience freedom from spiritual limitations</p>
                        </div>
                        
                        <div className="text-center p-6 bg-gray-900/30 rounded-2xl border border-gray-800">
                            <div className="text-4xl mb-4">🔥</div>
                            <h4 className="text-xl font-bold text-white mb-2">Holy Ghost Fire</h4>
                            <p className="text-gray-400">Receive fresh fire for ministry and service</p>
                        </div>
                        
                        <div className="text-center p-6 bg-gray-900/30 rounded-2xl border border-gray-800">
                            <div className="text-4xl mb-4">🌟</div>
                            <h4 className="text-xl font-bold text-white mb-2">Divine Purpose</h4>
                            <p className="text-gray-400">Discover and walk in your God-given assignment</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}