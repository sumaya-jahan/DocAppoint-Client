"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DoctorCard from "./DoctorCard";
import { API_URL } from "../lib/api";

const HomeContent = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [stats,setStats]=useState(null);
    useEffect(()=>{fetch(`${API_URL}/api/stats`).then(r=>r.ok?r.json():null).then(setStats).catch(()=>{});},[]);

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

            <section className="max-w-7xl mx-auto px-4 py-12" aria-labelledby="stats-title"><h2 id="stats-title" className="text-3xl font-bold mb-6">Our network at a glance</h2>{stats?<div className="grid grid-cols-1 sm:grid-cols-3 gap-5">{[["Doctors",stats.doctors],["Appointments",stats.appointments],["Specialties",stats.specialties]].map(([name,n])=><div key={name} className="bg-base-200 rounded-xl p-6"><p>{name}</p><strong className="text-4xl">{n}</strong></div>)}</div>:<p>Network statistics are available when the server is connected.</p>}</section>
            <section className="bg-base-200 py-12"><div className="max-w-7xl mx-auto px-4"><h2 className="text-3xl font-bold mb-6">How it works</h2><div className="grid md:grid-cols-3 gap-5">{[["1. Browse doctors","Search doctors by specialty or location."],["2. Check details","Read doctor information before booking."],["3. Manage appointments","Sign in to book and review your appointments."]].map(([title,desc])=><article key={title} className="rounded-xl bg-base-100 p-6"><h3 className="font-bold text-xl">{title}</h3><p>{desc}</p></article>)}</div></div></section>
            <section className="max-w-7xl mx-auto px-4 py-12"><h2 className="text-3xl font-bold mb-6">Frequently asked questions</h2><div className="space-y-3">{[["Do I need an account to browse doctors?","No. Doctor listings and individual details are public."],["Can I review my bookings?","Yes. Sign in and open the dashboard to review your appointments."],["How do I contact support?","Use the Contact page to send a message that our team can review."]].map(([q,a])=><details key={q} className="rounded-xl bg-base-200 p-5"><summary className="font-semibold cursor-pointer">{q}</summary><p className="pt-3">{a}</p></details>)}</div></section>
            <section className="bg-base-200 py-12"><div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-6"><div><h2 className="text-3xl font-bold">Care made easier</h2><p className="mt-3">Use your personal dashboard to keep track of doctor appointments and account information.</p></div><div className="flex items-center gap-3"><Link className="btn btn-primary" href="/appointments">Explore doctors</Link><Link className="btn btn-outline" href="/dashboard">My dashboard</Link></div></div></section>
            <section className="max-w-7xl mx-auto px-4 py-12"><h2 className="text-3xl font-bold">Need help choosing?</h2><p className="my-4">See answers to account and appointment questions or contact the team directly.</p><div className="flex gap-3"><Link href="/help" className="btn btn-outline">Help center</Link><Link href="/contact" className="btn btn-primary">Contact us</Link></div></section>
        </div>
    );
};

export default HomeContent;