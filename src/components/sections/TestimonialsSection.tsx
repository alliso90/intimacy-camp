"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";
import { TESTIMONIALS } from "@/src/lib/constants";
import { useIntersectionObserver } from "@/src/hooks/useIntersectionObserver";

export function TestimonialsSection() {
    const [ref, isVisible] = useIntersectionObserver({
        threshold: 0.1,
        freezeOnceVisible: true,
    });

    return (
        <section
            id="testimonials"
            ref={ref}
            className="py-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        What Our{" "}
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Participants Say
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Real stories from people who transformed their relationships
                    </p>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isVisible ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <Card className="h-full hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                                {/* Quote Icon */}
                                <div className="absolute top-4 right-4 opacity-10">
                                    <Quote className="w-16 h-16 text-purple-600" />
                                </div>

                                <CardContent className="pt-6 space-y-4">
                                    {/* Stars */}
                                    <div className="flex gap-1">
                                        {Array.from({ length: testimonial.rating }).map(
                                            (_, i) => (
                                                <Star
                                                    key={i}
                                                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                                                />
                                            )
                                        )}
                                    </div>

                                    {/* Content */}
                                    <p className="text-gray-700 dark:text-gray-300 italic">
                                        &quot;{testimonial.content}&quot;
                                    </p>

                                    {/* Author */}
                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {testimonial.name}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
