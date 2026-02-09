"use client";

import { motion } from "framer-motion";
import { Users, Flame, BookOpen, Target } from "lucide-react";
import Image from "next/image";

const ITEMS = [
    { title: "Raising Kingdom Leaders", icon: Users, active: true },
    { title: "Igniting Revival Fire", icon: Flame, active: false },
    { title: "Discipleship & Mentorship", icon: BookOpen, active: false },
    { title: "Capacity Building ", icon: Target, active: false },
     { title: "Divine Encounter ", icon: Target, active: false },
];

export function WhoWeAreSection() {
    return (
        <section className="bg-[#f2f1e8] py-24 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Text Area */}
                    <div className="lg:w-1/2">
                        <div className="flex ml-12 items-center gap-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
                                Who We Are
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                           THE <span className="text-green-600">MIGHTY MEN </span> OF DAVID
                        </h2>

                        <div className="grid grid-cols-1 gap-4">
                            {ITEMS.map((item, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ x: 10 }}
                                    className={`flex items-center gap-4 p-4 rounded-full transition-all duration-300 cursor-pointer ${item.active
                                            ? "bg-[#1a2b2b] text-white shadow-lg"
                                            : "text-gray-700 hover:bg-white"
                                        }`}
                                >
                                    <div className={`p-2 rounded-full ${item.active ? "bg-white/10" : "bg-gray-200"}`}>
                                        <item.icon className={`w-5 h-5 ${item.active ? "text-green-500" : "text-gray-500"}`} />
                                    </div>
                                    <span className="font-bold">{item.title}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Image Area */}
                   <div className="lg:w-1/2 relative group">
    {/* Image Container */}
    <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl mt-8 lg:mt-24"
    >
        <Image
            src="/images/IMG-20260116-WA0104.jpg"
            alt="Who We Are"
            fill
            className="object-cover"
        />

        {/* Tooltip Text at Top */}
        <div className="absolute top-4 left-5/8 -translate-x-1/3 pxl-4 py-3 bg-gray-900/90 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none max-w-xs text-center shadow-lg">
            We are a global movement raising a passionate generation empowered to influence nations with the fire and truth of Jesus.
        </div>
    </motion.div>
</div>

                </div>
            </div>
        </section>
    );
}
