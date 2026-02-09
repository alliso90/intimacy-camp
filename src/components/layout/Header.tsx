"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { ROUTES, APP_NAME } from "@/src/lib/constants";
import { cn } from "@/src/lib/utils";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Change header background after scrolling past hero section (approximately 100vh)
            setIsScrolled(window.scrollY > window.innerHeight * 0.8);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: ROUTES.HOME, label: "Home" },
        { href: "/sermons", label: "Sermons" },
        { href: "/about", label: "About" },
        { href: "#events", label: "Events" },
        { href: "#counselling", label: "Counselling" },
        { href: "#resources", label: "Resource" },
    ];

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-white dark:bg-gray-900 shadow-md"
                    : "bg-transparent"
            )}
        >
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo Section */}
                    <Link
                        href="/some-other-route" // <-- change this to the route you want
                        className="flex items-center gap-3"
                    >
                        {/* Logo Image */}
                        <div className="relative w-12 h-12">
                            <Image
                                src="/images/20230803_194307_0000.png" // <-- your logo file
                                alt="Intimacy Camp Logo"
                                fill
                                className="object-contain"
                            />
                        </div>

                        {/* Text Name */}
                        <span
                            className={cn(
                                "text-2xl font-bold transition-colors",
                                isScrolled ? "text-gray-900 dark:text-white" : "text-white"
                            )}
                        >
                            The Mighty Men Of David
                        </span>
                    </Link>


                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "transition-colors font-medium hover:text-green-500",
                                    isScrolled
                                        ? "text-gray-700 dark:text-gray-300"
                                        : "text-white",
                                    link.label === "Home" && !isScrolled && "text-green-400"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link href={ROUTES.REGISTER}>
                            <Button
                                className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6"
                            >
                                Register Now
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <X className={cn("w-6 h-6", isScrolled ? "text-gray-900" : "text-white")} />
                        ) : (
                            <Menu className={cn("w-6 h-6", isScrolled ? "text-gray-900" : "text-white")} />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                <div
                    className={cn(
                        "md:hidden overflow-hidden transition-all duration-300",
                        isMenuOpen ? "max-h-96 pb-4" : "max-h-0"
                    )}
                >
                    <div className="flex flex-col gap-4 pt-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "transition-colors font-medium",
                                    isScrolled
                                        ? "text-gray-700 dark:text-gray-300"
                                        : "text-white"
                                )}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="flex flex-col gap-2 pt-2">
                            <Link href={ROUTES.REGISTER}>
                                <Button className="w-full bg-green-500 hover:bg-green-600">
                                    Register Now
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}
