"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const INITIATIVES = [
    {
        id: 1,
        title: "The Davidic School of Ministry",
        shortDescription: "An 8-Month equipping and training programme to raise Mighty Men of God.",
        fullDescription: `The Davidic School of Ministry is an 8-Month equipping and training programme in response to the mandate received, to raise a breed of Mighty Men who will take the WISDOM AND POWER of God into the nations, across the various Spheres of Influence.

This intensive program focuses on spiritual formation, biblical training, and practical ministry skills to equip believers for impactful service.

Contact Information:
- Email: davidicschoolofministry@gmail.com
- Phone: 07055146353

Scripture Reference:
1 Samuel 22:2: "And every one that was in distress, and every one that was in debt, and every one that was discontented, gathered themselves unto him; and he became a captain over them: and there were with him about four hundred men."`,
        image: "/images/IMG-20251013-WA0009.jpg",
        color: "bg-[#1a2b2b]",
        contact: {
            email: "davidicschoolofministry@gmail.com",
            phone: "07055146353"
        },
        scripture: "1 Samuel 22:2"
    },
    {
        id: 2,
        title: "THE INTIMACY CAMP 2026",
        shortDescription: "A gathering focused on seeking the face of God, not just His hands.",
        fullDescription: `The INTIMACY CAMP 2026 is a transformative experience designed to draw believers into deeper relationship with God.

Based on the mandate received to raise a pure generation who will seek the face of God and not His hands, this camp creates an atmosphere for supernatural encounters, spiritual breakthroughs, and intimate worship.

Date: April 5th – 7th, 2026
Location: Ago-Iwowe, Ogun State, Nigeria

Join us as we pursue God's presence above all else, becoming the Jacob Generation as described in Psalms 24:6.`,
        image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80",
        color: "bg-green-700",
        date: "April 5th – 7th, 2026",
        location: "Ago-Iwowe, Ogun State, Nigeria"
    },
    {
        id: 3,
        title: "PRAY LIKE A YOUTH-P.L.A.Y",
        shortDescription: "This is an initiative, reigniting the revival fire in specific higher institution campuses across Ogun State.    ",
        fullDescription: `This is an initiative, reigniting the revival fire in specific higher institution campuses across Ogun State. 
We believe in the marriage of PRAYER & The WORD for the growth and transformation of the believer.`,
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80",
        color: "bg-[#1a2b2b]",
        focus: "City-wide revival and transformation"
    },
    //     {
    //         id: 4,
    //         title: "YMR Samaritan",
    //         shortDescription: "Supporting participants through education, empowerment and healthcare.",
    //         fullDescription: `YMR Samaritan is the compassionate arm of The Mighty Men of David initiative, dedicated to supporting YMR participants and their communities through practical assistance.

    // Our focus areas include:
    // - Education: Scholarships, educational materials, and learning support
    // - Empowerment: Skill acquisition, vocational training, and business support
    // - Healthcare: Medical assistance, health education, and wellness programs

    // This initiative embodies the love of Christ by meeting practical needs while sharing the gospel message, ensuring that no one is left behind in our pursuit of raising mighty men for God.`,
    //         image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80",
    //         color: "bg-[#f2f1e8]",
    //         focusAreas: ["Education", "Empowerment", "Healthcare"]
    //     }
];

interface ModalProps {
    initiative: typeof INITIATIVES[0];
    isOpen: boolean;
    onClose: () => void;
}

function InitiativeModal({ initiative, isOpen, onClose }: ModalProps) {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl ${initiative.color}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-white hover:text-black transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Hero Image */}
                <div className="relative h-48 md:h-64">
                    <Image
                        src={initiative.image}
                        alt={initiative.title}
                        fill
                        className="object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-6 left-8 right-8">
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            {initiative.title}
                        </h3>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="prose prose-invert max-w-none">
                        {initiative.fullDescription.split('\n\n').map((paragraph, idx) => (
                            <p
                                key={idx}
                                className={`mb-4 leading-relaxed ${initiative.color === "bg-[#f2f1e8]"
                                        ? "text-gray-700"
                                        : "text-white/90"
                                    }`}
                            >
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    {/* Additional Details */}
                    <div className="mt-8 pt-8 border-t border-white/20">
                        {initiative.contact && (
                            <div className="mb-6">
                                <h4 className={`font-bold mb-3 ${initiative.color === "bg-[#f2f1e8]"
                                        ? "text-gray-900"
                                        : "text-white"
                                    }`}>
                                    Contact Information
                                </h4>
                                <div className="space-y-2">
                                    <p className={`${initiative.color === "bg-[#f2f1e8]"
                                            ? "text-gray-700"
                                            : "text-white/80"
                                        }`}>
                                        📧 {initiative.contact.email}
                                    </p>
                                    <p className={`${initiative.color === "bg-[#f2f1e8]"
                                            ? "text-gray-700"
                                            : "text-white/80"
                                        }`}>
                                        📱 {initiative.contact.phone}
                                    </p>
                                </div>
                            </div>
                        )}

                        {initiative.scripture && (
                            <div className={`p-4 rounded-xl ${initiative.color === "bg-[#f2f1e8]"
                                    ? "bg-green-50"
                                    : "bg-white/10"
                                }`}>
                                <p className={`font-bold mb-2 ${initiative.color === "bg-[#f2f1e8]"
                                        ? "text-green-800"
                                        : "text-white"
                                    }`}>
                                    Key Scripture
                                </p>
                                <p className={`italic ${initiative.color === "bg-[#f2f1e8]"
                                        ? "text-gray-700"
                                        : "text-white/90"
                                    }`}>
                                    &quot;{initiative.scripture}&quot;
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export function InitiativesSection() {
    const [selectedInitiative, setSelectedInitiative] = useState<typeof INITIATIVES[0] | null>(null);

    const handleOpenModal = (initiative: typeof INITIATIVES[0]) => {
        setSelectedInitiative(initiative);
    };

    const handleCloseModal = () => {
        setSelectedInitiative(null);
    };

    return (
        <>
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 relative">
                        {/* Decorative elements */}
                        <div className="absolute top-0 left-10 md:left-40 opacity-20 hidden md:block">
                            <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                                <path d="M10 50 Q50 10 90 50" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
                            </svg>
                        </div>

                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
                                Ministry Arms
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 max-w-2xl mx-auto leading-tight">
                            RAISE A PURE BREED,  <span className="text-green-600">DISCIPLE NATIONS.</span>
                        </h2>
                        <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed text-sm md:text-base">
                            Due to the effectiveness and undeniable impact of THE MIGHTY MEN OF DAVID by the hand of God, several powerful arms have been supernaturally birthed from the vision—each carrying the same fire, passion, and mandate to raise a pure breed of Mighty Men, who will rise with the WISDOM and POWER of God.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {INITIATIVES.map((initiative, index) => (
                            <motion.div
                                key={initiative.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`${initiative.color} rounded-3xl overflow-hidden shadow-xl min-h-[400px] flex flex-col group cursor-pointer`}
                                onClick={() => handleOpenModal(initiative)}
                            >
                                <div className="relative flex-1 p-8 flex flex-col justify-end">
                                    <Image
                                        src={initiative.image}
                                        alt={initiative.title}
                                        fill
                                        className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-8 right-8">
                                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:text-black transition-colors">
                                            <ArrowUpRight className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <h4 className={`text-2xl font-bold mb-3 ${initiative.color === "bg-[#f2f1e8]" ? "text-gray-900" : "text-white"}`}>
                                            {initiative.title}
                                        </h4>
                                        <p className={`text-sm leading-relaxed ${initiative.color === "bg-[#f2f1e8]" ? "text-gray-600" : "text-white/70"}`}>
                                            {initiative.shortDescription}
                                        </p>
                                        <div className="mt-4">
                                            <span className={`text-xs font-semibold ${initiative.color === "bg-[#f2f1e8]" ? "text-green-700" : "text-green-300"}`}>
                                                Click to learn more →
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modal for detailed view */}
            {selectedInitiative && (
                <InitiativeModal
                    initiative={selectedInitiative}
                    isOpen={!!selectedInitiative}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
}