import { useState } from "react";
import MyBookings from "./MyBookings/MyBookings";
import MyProfile from "./MyProfile/MyProfile";
import PageTitle from "../../components/PageTitle";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("bookings");

    return (
        <>
            <PageTitle title="Dashboard" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64">
                        <div className="bg-base-100 shadow-xl rounded-2xl p-4">
                            <h2 className="text-2xl font-bold mb-4">
                                Dashboard
                            </h2>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() =>
                                        setActiveTab("bookings")
                                    }
                                    className={`btn justify-start ${activeTab === "bookings"
                                            ? "btn-primary"
                                            : "btn-ghost"
                                        }`}
                                >
                                    My Bookings
                                </button>

                                <button
                                    onClick={() =>
                                        setActiveTab("profile")
                                    }
                                    className={`btn justify-start ${activeTab === "profile"
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
                        {activeTab === "bookings" && (
                            <MyBookings />
                        )}

                        {activeTab === "profile" && (
                            <MyProfile />
                        )}
                    </main>
                </div>
            </div>
        </>
    );
};

export default Dashboard;