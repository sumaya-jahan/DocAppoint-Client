"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useSession } from "../lib/auth-client";
import { API_URL } from "../lib/api";

export default function DoctorDetailsContent({ doctorId }) {
    const router = useRouter();

    const {
        data: session,
        isPending: sessionLoading,
    } = useSession();

    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (sessionLoading) {
            return;
        }

        if (!session?.user) {
            router.replace(
                `/login?callbackUrl=${encodeURIComponent(
                    `/doctor/${doctorId}`
                )}`
            );
            return;
        }

        if (!doctorId) {
            setError("Doctor not found.");
            setLoading(false);
            return;
        }

        const loadDoctor = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/doctors/${doctorId}`,
                    {
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        "Could not load doctor."
                    );
                }

                const data = await response.json();

                setDoctor(data);
            } catch (err) {
                console.error(err);
                setError(
                    "Could not load doctor details."
                );
            } finally {
                setLoading(false);
            }
        };

        loadDoctor();
    }, [
        doctorId,
        session,
        sessionLoading,
        router,
    ]);

    if (sessionLoading || loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!session?.user) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error || !doctor) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
                <h1 className="text-3xl font-bold">
                    Doctor Not Found
                </h1>

                <p className="text-base-content/70">
                    {error ||
                        "The requested doctor could not be found."}
                </p>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                        router.push("/appointments")
                    }
                >
                    Back to All Appointments
                </button>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-base-200 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="card lg:card-side bg-base-100 shadow-xl overflow-hidden">
                    <figure className="lg:w-2/5 bg-base-200">
                        <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-full h-full min-h-[420px] object-cover"
                        />
                    </figure>

                    <div className="card-body lg:w-3/5">
                        <div>
                            <p className="text-primary font-semibold mb-2">
                                {doctor.specialty}
                            </p>

                            <h1 className="text-3xl md:text-4xl font-bold">
                                {doctor.name}
                            </h1>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4 mt-4">
                            <div className="bg-base-200 rounded-xl p-4">
                                <p className="text-sm opacity-70">
                                    Experience
                                </p>
                                <p className="font-semibold">
                                    {doctor.experience ||
                                        "Not available"}
                                </p>
                            </div>

                            <div className="bg-base-200 rounded-xl p-4">
                                <p className="text-sm opacity-70">
                                    Rating
                                </p>
                                <p className="font-semibold">
                                    ⭐ {doctor.rating}
                                </p>
                            </div>

                            <div className="bg-base-200 rounded-xl p-4">
                                <p className="text-sm opacity-70">
                                    Consultation Fee
                                </p>
                                <p className="font-semibold">
                                    ৳{doctor.fee}
                                </p>
                            </div>

                            <div className="bg-base-200 rounded-xl p-4">
                                <p className="text-sm opacity-70">
                                    Availability
                                </p>
                                <p className="font-semibold">
                                    {Array.isArray(
                                        doctor.availability
                                    )
                                        ? doctor.availability.join(
                                            ", "
                                        )
                                        : doctor.availability ||
                                        "Not available"}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 mt-4">
                            <p>
                                <strong>Hospital:</strong>{" "}
                                {doctor.hospital ||
                                    "Not available"}
                            </p>

                            <p>
                                <strong>Location:</strong>{" "}
                                {doctor.location ||
                                    "Not available"}
                            </p>

                            {doctor.description && (
                                <div>
                                    <h2 className="font-bold text-lg mb-1">
                                        About Doctor
                                    </h2>

                                    <p className="text-base-content/70 leading-relaxed">
                                        {doctor.description}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="card-actions mt-6">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() =>
                                    router.push(
                                        `/book/${doctor.id}`
                                    )
                                }
                            >
                                Book Appointment
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() =>
                                    router.push(
                                        "/appointments"
                                    )
                                }
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}