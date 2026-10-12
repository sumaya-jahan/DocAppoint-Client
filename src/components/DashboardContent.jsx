"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useSession } from "../lib/auth-client";
import MyBookings from "./MyBookings";
import MyProfile from "./MyProfile";
import UserOverview from "./UserOverview";
import Link from "next/link";

const DashboardContent = () => {
    const router = useRouter();

    const {
        data: session,
        isPending,
    } = useSession();

    const user = session?.user;

    const [activeTab, setActiveTab] =
        useState("overview");

    useEffect(() => {
        if (isPending) {
            return;
        }

        if (!user) {
            router.replace(
                "/login?callbackUrl=%2Fdashboard"
            );
        }
    }, [
        user,
        isPending,
        router,
    ]);

    if (isPending) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar */}
                <aside className="w-full md:w-64">
                    <div className="bg-base-100 shadow-xl rounded-2xl p-4">
                        <h2 className="text-2xl font-bold mb-4">
                            Dashboard
                        </h2>

                        <div className="flex flex-col gap-3">
                            <button type="button" onClick={()=>setActiveTab("overview")} className={`btn justify-start ${activeTab==="overview"?"btn-primary":"btn-ghost"}`}>Overview</button>
                            <Link href="/appointments" className="btn btn-ghost justify-start">Explore Doctors</Link>
                            <button
                                type="button"
                                onClick={() =>
                                    setActiveTab(
                                        "bookings"
                                    )
                                }
                                className={`btn justify-start ${activeTab ===
                                        "bookings"
                                        ? "btn-primary"
                                        : "btn-ghost"
                                    }`}
                            >
                                My Bookings
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setActiveTab(
                                        "profile"
                                    )
                                }
                                className={`btn justify-start ${activeTab ===
                                        "profile"
                                        ? "btn-primary"
                                        : "btn-ghost"
                                    }`}
                            >
                                My Profile
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Dashboard Content */}
                <main className="flex-1">
                    {activeTab === "overview" && <UserOverview />}
                    {activeTab ===
                        "bookings" && (
                            <MyBookings />
                        )}

                    {activeTab ===
                        "profile" && (
                            <MyProfile />
                        )}
                </main>
            </div>
        </div>
    );
};

export default DashboardContent;