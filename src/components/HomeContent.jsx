"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DoctorCard from "./DoctorCard";
import { API_URL } from "../lib/api";

const HomeContent = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDoctors = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(`${API_URL}/doctors`);

                if (!response.ok) {
                    throw new Error("Failed to load doctors.");
                }

                const data = await response.json();

                const topRatedDoctors = [...data]
                    .sort(
                        (a, b) =>
                            Number(b.rating || 0) -
                            Number(a.rating || 0)
                    )
                    .slice(0, 3);

                setDoctors(topRatedDoctors);
            } catch (err) {
                console.error(err);
                setError("Could not load doctors.");
            } finally {
                setLoading(false);
            }
        };

        loadDoctors();
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <section className="bg-base-200">
                <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        <div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                Your Health,
                                <span className="text-primary">
                                    {" "}
                                    Our Priority
                                </span>
                            </h1>

                            <p className="mt-6 text-lg text-base-content/70 max-w-xl">
                                Find trusted doctors, view their details,
                                and book appointments easily with
                                DocAppoint.
                            </p>

                            <div className="mt-8">
                                <Link
                                    href="/appointments"
                                    className="btn btn-primary"
                                >
                                    Find a Doctor
                                </Link>
                            </div>
                        </div>

                        <div>
                            <img
                                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1000&q=80"
                                alt="Doctor"
                                className="w-full h-[420px] object-cover rounded-2xl shadow-xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Top Rated Doctors */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        Top Rated Doctors
                    </h2>

                    <p className="mt-3 text-base-content/70">
                        Meet some of our highest-rated healthcare
                        professionals.
                    </p>
                </div>

                {loading && (
                    <div className="flex justify-center py-12">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                )}

                {!loading && error && (
                    <div className="alert alert-error max-w-2xl mx-auto">
                        <span>{error}</span>
                    </div>
                )}

                {!loading && !error && doctors.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {doctors.map((doctor) => (
                            <DoctorCard
                                key={doctor._id || doctor.id}
                                doctor={doctor}
                            />
                        ))}
                    </div>
                )}

                {!loading && !error && doctors.length === 0 && (
                    <p className="text-center text-base-content/70">
                        No doctors available.
                    </p>
                )}

                <div className="text-center mt-10">
                    <Link
                        href="/appointments"
                        className="btn btn-outline btn-primary"
                    >
                        View All Doctors
                    </Link>
                </div>
            </section>

            {/* Why Choose DocAppoint */}
            <section className="bg-base-200 py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Why Choose DocAppoint?
                        </h2>

                        <p className="mt-3 text-base-content/70">
                            Simple, secure, and convenient healthcare
                            appointment management.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body text-center">
                                <div className="text-4xl">✓</div>

                                <h3 className="card-title justify-center">
                                    Trusted Doctors
                                </h3>

                                <p className="text-base-content/70">
                                    Browse experienced doctors and check
                                    their professional information before
                                    booking.
                                </p>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body text-center">
                                <div className="text-4xl">📅</div>

                                <h3 className="card-title justify-center">
                                    Easy Booking
                                </h3>

                                <p className="text-base-content/70">
                                    Book and manage your appointments
                                    quickly from one simple dashboard.
                                </p>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body text-center">
                                <div className="text-4xl">🔒</div>

                                <h3 className="card-title justify-center">
                                    Secure Access
                                </h3>

                                <p className="text-base-content/70">
                                    Better Auth helps protect your account
                                    and private appointment information.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        What Our Patients Say
                    </h2>

                    <p className="mt-3 text-base-content/70">
                        Experiences shared by patients using DocAppoint.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card bg-base-200 shadow-sm">
                        <div className="card-body">
                            <p className="text-base-content/80">
                                “Booking a doctor appointment was very
                                simple. I could find the doctor I needed
                                and manage everything from my dashboard.”
                            </p>

                            <div className="mt-4">
                                <h3 className="font-semibold">
                                    Sarah Ahmed
                                </h3>
                                <p className="text-sm text-base-content/60">
                                    Patient
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-200 shadow-sm">
                        <div className="card-body">
                            <p className="text-base-content/80">
                                “DocAppoint made the appointment process
                                quick and convenient. The interface is
                                easy to understand and use.”
                            </p>

                            <div className="mt-4">
                                <h3 className="font-semibold">
                                    Rahim Hasan
                                </h3>
                                <p className="text-sm text-base-content/60">
                                    Patient
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomeContent;