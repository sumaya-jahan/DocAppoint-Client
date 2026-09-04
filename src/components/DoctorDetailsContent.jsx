"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    useParams,
    useRouter,
} from "next/navigation";

import { useSession } from "../lib/auth-client";
import { API_URL } from "../lib/api";

const DoctorDetailsContent = () => {
    const params = useParams();
    const router = useRouter();

    const id = params.id;

    const {
        data: session,
        isPending: sessionLoading,
    } = useSession();

    const user = session?.user;

    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (sessionLoading) {
            return;
        }

        // Private route
        if (!user) {
            const doctorPath = `/doctor/${id}`;

            router.replace(
                `/login?callbackUrl=${encodeURIComponent(
                    doctorPath
                )}`
            );

            return;
        }

        const fetchDoctor = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `${API_URL}/doctors/${id}`
                );

                if (!response.ok) {
                    throw new Error(
                        "Doctor not found"
                    );
                }

                const data = await response.json();

                setDoctor(data);
            } catch (error) {
                console.error(error);
                setDoctor(null);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctor();
    }, [
        id,
        user,
        sessionLoading,
        router,
    ]);

    if (sessionLoading) {
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

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="text-center py-20 px-6">
                <h1 className="text-3xl font-bold">
                    Doctor Not Found
                </h1>

                <Link
                    href="/appointments"
                    className="btn btn-primary mt-6"
                >
                    Back to Appointments
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                        {/* Doctor Image */}
                        <div className="flex justify-center">
                            <img
                                src={doctor.image}
                                alt={doctor.name}
                                className="w-56 h-56 rounded-2xl object-cover shadow-md"
                            />
                        </div>

                        {/* Doctor Information */}
                        <div className="md:col-span-2">
                            <h1 className="text-3xl md:text-4xl font-bold">
                                {doctor.name}
                            </h1>

                            <p className="text-xl text-primary font-semibold mt-2">
                                {doctor.specialty}
                            </p>

                            <div className="mt-6 space-y-3">
                                <p>
                                    <strong>
                                        Experience:
                                    </strong>{" "}
                                    {doctor.experience}
                                </p>

                                <p>
                                    <strong>
                                        Consultation Fee:
                                    </strong>{" "}
                                    ৳{doctor.fee}
                                </p>

                                {doctor.rating && (
                                    <p>
                                        <strong>
                                            Rating:
                                        </strong>{" "}
                                        ⭐ {doctor.rating}
                                    </p>
                                )}

                                {doctor.hospital && (
                                    <p>
                                        <strong>
                                            Hospital:
                                        </strong>{" "}
                                        {doctor.hospital}
                                    </p>
                                )}

                                {doctor.location && (
                                    <p>
                                        <strong>
                                            Location:
                                        </strong>{" "}
                                        {doctor.location}
                                    </p>
                                )}
                            </div>

                            {doctor.availability &&
                                doctor.availability.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="font-semibold mb-3">
                                            Availability
                                        </h3>

                                        <div className="flex flex-wrap gap-2">
                                            {doctor.availability.map(
                                                (
                                                    day,
                                                    index
                                                ) => (
                                                    <span
                                                        key={index}
                                                        className="badge badge-primary badge-outline"
                                                    >
                                                        {day}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                            {doctor.description && (
                                <div className="mt-6">
                                    <h3 className="font-semibold mb-2">
                                        About Doctor
                                    </h3>

                                    <p className="text-base-content/70 leading-relaxed">
                                        {
                                            doctor.description
                                        }
                                    </p>
                                </div>
                            )}

                            <div className="mt-8">
                                <Link
                                    href={`/book/${doctor.id}`}
                                    className="btn btn-primary"
                                >
                                    Book Appointment
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDetailsContent;