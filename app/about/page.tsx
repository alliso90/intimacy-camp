"use client";

import { motion } from "framer-motion";
import { Header } from "@/src/components/layout/Header";
import Footer from "@/src/components/layout/Footer";
import { Card, CardContent } from "@/src/components/ui/card";
import { Users, Heart, Target, Zap } from "lucide-react";
import { useIntersectionObserver } from "@/src/hooks/useIntersectionObserver";

const PROGRAM_INFO = {
    title: "About Young Ministers Retreat",
    description: "Young Ministers Retreat (YMR) is a transformative experience designed to ignite a burning generation for God. We equip young leaders to passionately pursue their faith and transform every sphere of life with divine purpose.",
    mission: "To raise up a generation of young ministers who are on fire for Jesus, equipped with the Word, empowered by the Spirit, and ready to impact their world.",
    vision: "A global movement of young people passionately pursuing God and transforming their communities through authentic faith and bold action.",
};

const CONVENER = {
    name: "Pastor Emmanuel Adeyemi",
    title: "Founder & Lead Convener",
    bio: "Pastor Emmanuel has been in ministry for over 15 years, with a heart for raising up the next generation of leaders. His passion is to see young people discover their purpose and walk in their God-given calling.",
    image: "👨‍💼", // Placeholder emoji
};

const DEPARTMENTS = [
    {
        name: "Worship & Creative Arts",
        description: "Leading powerful worship experiences and creative expressions",
        teamLead: "Sarah Johnson",
        icon: "🎵",
        color: "from-purple-500 to-pink-500",
    },
    {
        name: "Prayer & Intercession",
        description: "Building a foundation of prayer and spiritual warfare",
        teamLead: "David Chen",
        icon: "🙏",
        color: "from-blue-500 to-cyan-500",
    },
    {
        name: "Discipleship & Teaching",
        description: "Equipping believers with sound biblical teaching",
        teamLead: "Grace Okafor",
        icon: "📖",
        color: "from-green-500 to-emerald-500",
    },
    {
        name: "Evangelism & Outreach",
        description: "Reaching the lost and making disciples",
        teamLead: "Michael Brown",
        icon: "🌍",
        color: "from-orange-500 to-red-500",
    },
    {
        name: "Media & Communications",
        description: "Spreading the message through digital platforms",
        teamLead: "Rachel Kim",
        icon: "📱",
        color: "from-indigo-500 to-purple-500",
    },
    {
        name: "Hospitality & Logistics",
        description: "Creating welcoming and organized environments",
        teamLead: "James Wilson",
        icon: "🏠",
        color: "from-yellow-500 to-orange-500",
    },
];

const VALUES = [
    {
        title: "Passion for God",
        description: "We pursue an authentic, burning relationship with Jesus",
        icon: Heart,
    },
    {
        title: "Excellence",
        description: "We do everything with excellence as unto the Lord",
        icon: Zap,
    },
    {
        title: "Community",
        description: "We believe in the power of authentic Christian community",
        icon: Users,
    },
    {
        title: "Purpose",
        description: "We help young people discover and walk in their calling",
        icon: Target,
    },
];

export default function AboutPage() {
    const [heroRef, heroVisible] = useIntersectionObserver({ threshold: 0.1, freezeOnceVisible: true });
    const [convenerRef, convenerVisible] = useIntersectionObserver({ threshold: 0.1, freezeOnceVisible: true });
    const [valuesRef, valuesVisible] = useIntersectionObserver({ threshold: 0.1, freezeOnceVisible: true });
    const [deptsRef, deptsVisible] = useIntersectionObserver({ threshold: 0.1, freezeOnceVisible: true });

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Header />

            {/* Hero Section */}
            <section ref={heroRef} className="pt-32 pb-20 bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={heroVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            {PROGRAM_INFO.title}
                        </h1>
                        <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
                            {PROGRAM_INFO.description}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={heroVisible ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Card className="h-full bg-gradient-to-br from-green-500 to-teal-500 text-white border-none">
                                <CardContent className="p-8">
                                    <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                                    <p className="text-lg opacity-90">{PROGRAM_INFO.mission}</p>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={heroVisible ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <Card className="h-full bg-gradient-to-br from-blue-500 to-purple-500 text-white border-none">
                                <CardContent className="p-8">
                                    <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                                    <p className="text-lg opacity-90">{PROGRAM_INFO.vision}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section ref={valuesRef} className="py-20 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={valuesVisible ? { opacity: 1, y: 0 } : {}}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            The principles that guide everything we do
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {VALUES.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={valuesVisible ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className="h-full hover:shadow-xl transition-shadow duration-300">
                                    <CardContent className="p-6 text-center">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                                            <value.icon className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {value.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Convener Section */}
            <section ref={convenerRef} className="py-20 bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={convenerVisible ? { opacity: 1, y: 0 } : {}}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold mb-4">Meet Our Convener</h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={convenerVisible ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto"
                    >
                        <Card className="overflow-hidden">
                            <CardContent className="p-8 md:p-12">
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    <div className="flex-shrink-0">
                                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-6xl">
                                            {CONVENER.image}
                                        </div>
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-3xl font-bold mb-2">{CONVENER.name}</h3>
                                        <p className="text-green-600 dark:text-green-400 font-semibold mb-4">
                                            {CONVENER.title}
                                        </p>
                                        <p className="text-gray-700 dark:text-gray-300 text-lg">
                                            {CONVENER.bio}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </section>

            {/* Departments Section */}
            <section ref={deptsRef} className="py-20 bg-white dark:bg-gray-950">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={deptsVisible ? { opacity: 1, y: 0 } : {}}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4">Our Departments</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Meet the teams that make it all happen
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {DEPARTMENTS.map((dept, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={deptsVisible ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                className="group"
                            >
                                <Card className="h-full overflow-hidden hover:shadow-2xl transition-all duration-300">
                                    <div className={`h-2 bg-gradient-to-r ${dept.color}`} />
                                    <CardContent className="p-6">
                                        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                            {dept.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2">{dept.name}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                                            {dept.description}
                                        </p>
                                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <p className="text-sm text-gray-500 dark:text-gray-500">
                                                Team Lead
                                            </p>
                                            <p className="font-semibold text-green-600 dark:text-green-400">
                                                {dept.teamLead}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
