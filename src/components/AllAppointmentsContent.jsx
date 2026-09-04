"use client";

import { useEffect, useState } from "react";
import DoctorCard from "./DoctorCard";
import { API_URL } from "../lib/api";

const AllAppointmentsContent = () => {
    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDoctors = async (searchText = "") => {
        try {
            setLoading(true);
            setError("");

            const url = searchText.trim()
                ? `${API_URL}/doctors?search=${encodeURIComponent(
                    searchText.trim()
                )}`
                : `${API_URL}/doctors`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Failed to load doctors.");
            }

            const data = await response.json();
            setDoctors(data);
        } catch (err) {
            console.error(err);
            setError("Could not load doctors. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDoctors();
    }, []);

    const handleSearch = (event) => {
        event.preventDefault();
        loadDoctors(search);
    };

    const handleReset = () => {
        setSearch("");
        loadDoctors("");
    };

    return (
        <section className="min-h-screen bg-base-200 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold">
                        All Appointments
                    </h1>

                    <p className="mt-3 text-base-content/70">
                        Browse our doctors and find the right specialist for
                        your healthcare needs.
                    </p>
                </div>

                <form
                    onSubmit={handleSearch}
                    className="max-w-2xl mx-auto mb-10"
                >
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search by doctor name"
                            className="input input-bordered w-full"
                        />

                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Search
                        </button>

                        <button
                            type="button"
                            onClick={handleReset}
                            className="btn btn-outline"
                        >
                            Reset
                        </button>
                    </div>
                </form>

                {loading && (
                    <div className="flex justify-center py-16">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                )}

                {!loading && error && (
                    <div className="alert alert-error max-w-2xl mx-auto">
                        <span>{error}</span>
                    </div>
                )}

                {!loading && !error && doctors.length === 0 && (
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-semibold">
                            No doctors found
                        </h2>

                        <p className="mt-2 text-base-content/70">
                            Try searching with another doctor name.
                        </p>
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
            </div>
        </section>
    );
};

export default AllAppointmentsContent;