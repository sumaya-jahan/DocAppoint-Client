"use client";

import { useEffect, useState } from "react";
import DoctorCard from "./DoctorCard";

const AllAppointmentsContent = () => {
    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchDoctors = async (searchText = "") => {
        try {
            setLoading(true);

            const url = searchText
                ? `http://localhost:5000/doctors?search=${encodeURIComponent(
                    searchText
                )}`
                : "http://localhost:5000/doctors";

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch doctors"
                );
            }

            const data = await response.json();

            setDoctors(data);
        } catch (error) {
            console.error(error);
            setDoctors([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleSearch = () => {
        fetchDoctors(search.trim());
    };

    const handleReset = () => {
        setSearch("");
        fetchDoctors();
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-16">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
                All Appointments
            </h1>

            <p className="text-center text-gray-500 mb-10">
                Browse available doctors and
                book your appointment.
            </p>

            {/* Search */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 mb-10">
                <input
                    type="text"
                    placeholder="Search Doctor Name..."
                    className="input input-bordered w-full sm:max-w-md"
                    value={search}
                    onChange={(event) =>
                        setSearch(
                            event.target.value
                        )
                    }
                    onKeyDown={
                        handleKeyDown
                    }
                />

                <button
                    type="button"
                    onClick={
                        handleSearch
                    }
                    className="btn btn-primary"
                >
                    Search
                </button>

                {search && (
                    <button
                        type="button"
                        onClick={
                            handleReset
                        }
                        className="btn btn-outline"
                    >
                        Reset
                    </button>
                )}
            </div>

            {/* Doctor List */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : doctors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {doctors.map(
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
                <p className="text-center text-red-500 mt-10">
                    No doctor found.
                </p>
            )}
        </div>
    );
};

export default AllAppointmentsContent;