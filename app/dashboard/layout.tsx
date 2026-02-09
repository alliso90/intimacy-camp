"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    Upload,
    Video,
    Music,
    MessageSquare,
    Settings,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import { ROUTES } from "@/src/lib/constants";
import { Button } from "@/src/components/ui/button";

const ADMIN_ROUTES = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/people", label: "People", icon: Users },
    { href: "/dashboard/sermons", label: "Sermons", icon: Upload },
    { href: "/dashboard/media", label: "Media & Clips", icon: Video },
    { href: "/dashboard/audio", label: "Audio Messages", icon: Music },
    { href: "/dashboard/testimonies", label: "Testimonies", icon: MessageSquare },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated, logout, isLoading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
            router.push(ROUTES.LOGIN);
        }
    }, [isAuthenticated, isLoading, user, router]);

    const handleLogout = async () => {
        await logout();
        router.push(ROUTES.HOME);
    };

    if (isLoading || !isAuthenticated || user?.role !== "admin") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="bg-white dark:bg-gray-900"
                >
                    {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
            </div>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                            TIC'26
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {user?.name}
                        </p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 overflow-y-auto">
                        <ul className="space-y-2">
                            {ADMIN_ROUTES.map((route) => {
                                const isActive = pathname === route.href;
                                return (
                                    <li key={route.href}>
                                        <Link
                                            href={route.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                                    ? "bg-gradient-to-r from-green-600 to-teal-600 text-white"
                                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                }`}
                                        >
                                            <route.icon className="w-5 h-5" />
                                            <span className="font-medium">{route.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Logout Button */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:ml-64 min-h-screen">
                <main className="p-6 lg:p-8">
                    {children}
                </main>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
