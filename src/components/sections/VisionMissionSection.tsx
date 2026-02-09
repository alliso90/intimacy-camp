"use client";

import { motion } from "framer-motion";
import { Book, Settings, Eye } from "lucide-react";
import Image from "next/image";

export function VisionMissionSection() {
    return (
        <section className="bg-[#0b1517] py-24 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-green-500/20 blur-[150px] -translate-y-1/2 translate-x-1/2 rounded-full" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Vision & Mission Header */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                            Vision & Mission
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 max-w-4xl mx-auto leading-tight">
                        <span className="text-green-500">A pure breed of mighty men</span> , taking the wisdom  <span className="text-white bg-white/10 px-2">and power of God into the Nations</span>
                    </h2>
                </div>

                {/* Big Poster Image (Faces) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl mb-24 border border-white/10"
                >
                    {/* Placeholder for image - replace with actual image path */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-gray-900/40" />

                    {/* You can add a placeholder image or use a real one */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-900/10 via-gray-900/20 to-green-900/10" />

                    {/* Sample pattern overlay */}
                    <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />

                    {/* Info Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col md:flex-row md:items-end md:justify-between gap-6">

                        {/* Event Details */}
                        <div>
                            <div className="text-green-500 font-bold mb-2">APRIL 5TH – 7TH, 2026</div>
                            <div className="text-white text-2xl md:text-3xl font-bold">The INTIMACY CAMP 2026,</div>
                            <div className="text-white/80 text-xl font-light">AGO-IWOWE, OGUN STATE, NIGERIA</div>
                        </div>

                        {/* Branding / Tagline */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">I</span>
                            </div>
                            <div className="text-white font-bold leading-tight">
                                THE INTIMACY CAMP 2026<br />
                                <span className="text-white/60 font-medium">The Jacob Generation(Psalms24:6).</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 px-8 items-start">
                    {/* Text Column */}
                    <div>
                        <div className="mb-12">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-0.5 bg-green-500" />
                                <h3 className="text-4xl font-bold text-white">TIC Vision</h3>
                            </div>
                            <p className="text-gray-400 font-medium mb-6">Raising Mighty Men</p>
                            <div className="pl-6 border-l-2 border-gray-800 italic text-gray-400 text-lg leading-relaxed">
                                To raise a pure breed of mighty men who will take the WISDOM and POWER of God into the Nations, to influence and reshape every sphere of human influence, bringing them into conformity with the will of God.
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-0.5 bg-green-500" />
                                <h3 className="text-4xl font-bold text-white">Our Mission</h3>
                            </div>

                            <p className="text-gray-300 text-lg leading-relaxed mb-6">
                                Our mission is to raise a <span className="text-white font-semibold">pure breed</span> of believers,
                                carrying the <span className="text-white font-semibold">wisdom</span> and
                                <span className="text-white font-semibold"> power</span> of God into the nations
                                through intentional <span className="text-white font-semibold">discipleship</span> and
                                <span className="text-white font-semibold"> mentorship</span>.
                            </p>

                            <div className="border-l-4 border-green-500 pl-6 text-gray-400 text-base leading-relaxed space-y-3">
                                <p className="text-green-400 font-semibold tracking-wide uppercase">
                                    Isaiah 2:2–3
                                </p>

                                <p>
                                    <span className="text-white font-semibold">2.</span> And it shall come to pass in the last days,
                                    that the mountain of the LORD&apos;s house shall be established in the top of the mountains,
                                    and shall be exalted above the hills; and all nations shall flow unto it.
                                </p>

                                <p>
                                    <span className="text-white font-semibold">3.</span> And many people shall go and say,
                                    &quot;Come, let us go up to the mountain of the LORD, to the house of the God of Jacob;
                                    He will teach us His ways, and we will walk in His paths.&quot;
                                    For out of Zion shall go forth the law, and the word of the LORD from Jerusalem.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Cards Column */}
                    <div className="flex flex-col gap-6">
                        {/* Rooted In The Word Card */}
                        <div className="bg-[#1a2b2b] p-8 rounded-3xl flex gap-6 group hover:translate-x-2 transition-transform duration-300">
                            <div className="shrink-0 w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                                <Book className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <h4 className="text-white text-xl font-bold mb-2">Rooted In The Word & Fire</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    We are rooted in scriptures, and full of the WISDOM of God.
                                </p>
                            </div>
                        </div>

                        {/* Rugged In Spirit Card */}
                        <div className="bg-green-600 p-8 rounded-3xl flex gap-6 group hover:translate-x-2 transition-transform duration-300">
                            <div className="shrink-0 w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                                <Settings className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="text-white text-xl font-bold mb-2">Fervent In Prayer </h4>
                                <p className="text-white/80 text-sm leading-relaxed">
                                    Through prayer, fasting, and tarrying, we cultivate discipline, purity, and supernatural boldness.
                                </p>
                            </div>
                        </div>

                        {/* Driven By Purpose Card */}
                        <div className="bg-[#f2f1e8] p-8 rounded-3xl flex gap-6 group hover:translate-x-2 transition-transform duration-300">
                            <div className="shrink-0 w-12 h-12 rounded-xl bg-green-600/10 flex items-center justify-center">
                                <Eye className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h4 className="text-gray-900 text-xl font-bold mb-2">We Are Vision-minded</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    With a desire to see the gospel of the Kingdom pervade every heart and space, we pursue genuine kingdom impact with all diligence and excellence.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}