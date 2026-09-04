"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import DoctorCard from "./DoctorCard";

const HomeContent = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:5000/doctors")
            .then((res) => {
                if (!res.ok) {
                    throw new Error(
                        "Failed to fetch doctors"
                    );
                }

                return res.json();
            })
            .then((data) => {
                setDoctors(data);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const topDoctors = [...doctors]
        .sort(
            (a, b) =>
                (b.rating || 0) -
                (a.rating || 0)
        )
        .slice(0, 3);

    return (
        <div>
            {/* HERO */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Book Your Doctor
                            Appointment Easily
                        </h1>

                        <p className="mt-6 text-gray-600 text-lg leading-relaxed">
                            Find trusted doctors,
                            schedule appointments,
                            and manage your
                            healthcare journey with
                            DocAppoint.
                        </p>

                        <Link
                            href="/appointments"
                            className="btn btn-primary mt-6"
                        >
                            Book Appointment
                        </Link>
                    </div>

                    <div>
                        <img
                            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d"
                            alt="Doctor consultation"
                            className="w-full h-[350px] md:h-[430px] object-cover rounded-2xl shadow-lg"
                        />
                    </div>
                </div>
            </section>

            {/* TOP RATED DOCTORS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        Top Rated Doctors
                    </h2>

                    <p className="text-gray-500 mt-3">
                        Meet some of our highly
                        rated healthcare
                        professionals.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                ) : topDoctors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {topDoctors.map(
                            (doctor) => (
                                <DoctorCard
                                    key={
                                        doctor.id
                                    }
                                    doctor={
                                        doctor
                                    }
                                />
                            )
                        )}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">
                        No doctors available.
                    </p>
                )}
            </section>

            {/* WHY CHOOSE US */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        Why Choose
                        DocAppoint?
                    </h2>

                    <p className="text-gray-500 mt-3">
                        Simple, secure, and
                        convenient healthcare
                        appointment management.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="card bg-base-100 shadow-xl h-full">
                        <div className="card-body text-center">
                            <h3 className="text-2xl font-bold">
                                Verified Doctors
                            </h3>

                            <p>
                                Connect with
                                experienced and
                                verified doctors
                                from different
                                specialties.
                            </p>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-xl h-full">
                        <div className="card-body text-center">
                            <h3 className="text-2xl font-bold">
                                Easy Booking
                            </h3>

                            <p>
                                Schedule
                                appointments quickly
                                with a simple and
                                user-friendly booking
                                system.
                            </p>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-xl h-full">
                        <div className="card-body text-center">
                            <h3 className="text-2xl font-bold">
                                Secure Management
                            </h3>

                            <p>
                                Manage bookings and
                                profile information
                                securely from your
                                dashboard.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        What Our Patients Say
                    </h2>

                    <p className="text-gray-500 mt-3">
                        Experiences shared by
                        patients using DocAppoint.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="card bg-base-100 shadow-xl h-full">
                        <div className="card-body">
                            <p>
                                &quot;The booking
                                process was very
                                smooth. I found the
                                right doctor within
                                minutes.&quot;
                            </p>

                            <h3 className="font-bold mt-4">
                                — Rahim Uddin
                            </h3>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-xl h-full">
                        <div className="card-body">
                            <p>
                                &quot;Excellent
                                service. Managing
                                appointments has
                                never been this
                                easy.&quot;
                            </p>

                            <h3 className="font-bold mt-4">
                                — Nusrat Jahan
                            </h3>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-xl h-full">
                        <div className="card-body">
                            <p>
                                &quot;The doctors are
                                highly professional
                                and the platform is
                                very user
                                friendly.&quot;
                            </p>

                            <h3 className="font-bold mt-4">
                                — Mahmud Hasan
                            </h3>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomeContent;