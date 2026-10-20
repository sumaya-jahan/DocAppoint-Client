
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useSession } from "../lib/auth-client";
import MyBookings from "./MyBookings";
import MyProfile from "./MyProfile";
import UserOverview from "./UserOverview";
import ThemeToggle from "./ThemeToggle";

export default function DashboardContent() {
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const user = session?.user;

    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        if (!isPending && !user) {
            router.replace("/login?callbackUrl=%2Fdashboard");
        }
    }, [user, isPending, router]);

    if (isPending || !user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <span
                    className="loading loading-spinner loading-lg"
                    aria-label="Loading dashboard"
                />
            </div>
        );
    }

    const menuItems = [
        { id: "overview", label: "Overview" },
        { id: "bookings", label: "My Bookings" },
        { id: "profile", label: "My Profile" },
        { id: "settings", label: "Settings" },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            <div className="flex flex-col md:flex-row gap-6">
                <aside className="w-full md:w-64 shrink-0">
                    <div className="bg-base-100 shadow-xl rounded-xl p-4">
                        <h2 className="text-2xl font-bold mb-4">
                            Dashboard
                        </h2>

                        <nav
                            className="flex flex-col gap-3"
                            aria-label="Dashboard navigation"
                        >
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setActiveTab(item.id)}
                                    aria-current={
                                        activeTab === item.id ? "page" : undefined
                                    }
                                    className={`btn justify-start ${activeTab === item.id
                                            ? "btn-primary"
                                            : "btn-ghost"
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}

                            <Link
                                href="/appointments"
                                className="btn btn-ghost justify-start"
                            >
                                Explore Doctors
                            </Link>
                        </nav>
                    </div>
                </aside>

                <main className="flex-1 min-w-0">
                    {activeTab === "overview" && <UserOverview />}

                    {activeTab === "bookings" && <MyBookings />}

                    {activeTab === "profile" && <MyProfile />}

                    {activeTab === "settings" && (
                        <section className="space-y-5">
                            <h1 className="text-2xl font-bold">
                                Account Settings
                            </h1>

                            <div className="bg-base-100 shadow rounded-xl p-5 space-y-3">
                                <h2 className="text-lg font-semibold">
                                    Account Information
                                </h2>

                                <p>
                                    <strong>Name:</strong>{" "}
                                    {user.name || "Not provided"}
                                </p>

                                <p className="break-all">
                                    <strong>Email:</strong> {user.email}
                                </p>

                                <button
                                    type="button"
                                    onClick={() => setActiveTab("profile")}
                                    className="btn btn-primary"
                                >
                                    Manage Profile
                                </button>
                            </div>

                            <div className="bg-base-100 shadow rounded-xl p-5 space-y-3">
                                <h2 className="text-lg font-semibold">
                                    Appearance
                                </h2>

                                <p className="text-sm text-base-content/70">
                                    Switch between light and dark mode.
                                </p>

                                <ThemeToggle />
                            </div>

                            <div className="bg-base-100 shadow rounded-xl p-5 space-y-3">
                                <h2 className="text-lg font-semibold">
                                    Password & Security
                                </h2>

                                <p className="text-sm text-base-content/70">
                                    Use your registered email to reset your
                                    password.
                                </p>

                                <Link
                                    href="/forgot-password"
                                    className="btn btn-outline"
                                >
                                    Reset Password
                                </Link>
                            </div>

                            <div className="bg-base-100 shadow rounded-xl p-5 space-y-3">
                                <h2 className="text-lg font-semibold">
                                    Help & Privacy
                                </h2>

                                <div className="flex flex-wrap gap-3">
                                    <Link
                                        href="/help"
                                        className="btn btn-outline"
                                    >
                                        Help Center
                                    </Link>

                                    <Link
                                        href="/privacy"
                                        className="btn btn-outline"
                                    >
                                        Privacy Policy
                                    </Link>

                                    <Link
                                        href="/contact"
                                        className="btn btn-outline"
                                    >
                                        Contact Support
                                    </Link>
                                </div>
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}
