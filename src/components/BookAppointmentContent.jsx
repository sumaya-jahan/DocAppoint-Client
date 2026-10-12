
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession } from "../lib/auth-client";

const API_URL = (
    process.env.NEXT_PUBLIC_API_URL?.startsWith("http")
        ? process.env.NEXT_PUBLIC_API_URL
        : "http://localhost:5000"
).replace(/\/$/, "");

export default function BookAppointmentContent() {
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
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        if (sessionLoading) return;

        if (!user) {
            router.replace(
                `/login?callbackUrl=${encodeURIComponent(`/book/${id}`)}`
            );
            return;
        }

        let cancelled = false;

        async function loadDoctor() {
            try {
                setLoading(true);

                const response = await fetch(
                    `${API_URL}/doctors/${encodeURIComponent(id)}`
                );

                if (!response.ok) {
                    throw new Error("Doctor not found");
                }

                const data = await response.json();

                if (!cancelled) {
                    setDoctor(data);
                }
            } catch (error) {
                console.error(error);

                if (!cancelled) {
                    setDoctor(null);
                    toast.error("Failed to load doctor.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadDoctor();

        return () => {
            cancelled = true;
        };
    }, [id, sessionLoading, user?.id, router]);

    const handleBooking = async (event) => {
        event.preventDefault();

        if (!user || !doctor || bookingLoading) return;

        const form = event.currentTarget;
        const formData = new FormData(form);

        const booking = {
            userEmail: user.email,
            doctorName: doctor.name,
            patientName: String(
                formData.get("patientName") || ""
            ).trim(),
            gender: String(formData.get("gender") || ""),
            phone: String(formData.get("phone") || "").trim(),
            appointmentDate: String(formData.get("date") || ""),
            appointmentTime: String(
                formData.get("time") || ""
            ).trim(),
        };

        try {
            setBookingLoading(true);

            const response = await fetch(`${API_URL}/appointments`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(booking),
            });

            const contentType =
                response.headers.get("content-type") || "";

            if (!contentType.includes("application/json")) {
                throw new Error(
                    `Booking API returned an unexpected response (HTTP ${response.status}). Check backend server and API URL.`
                );
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message || `Booking failed (HTTP ${response.status})`
                );
            }

            toast.success("Appointment booked successfully!");
            form.reset();
            router.push("/dashboard");
        } catch (error) {
            console.error("Booking error:", error);

            toast.error(
                error?.message || "Failed to book appointment."
            );
        } finally {
            setBookingLoading(false);
        }
    };

    if (sessionLoading || (user && loading)) {
        return (
            <div className="min-h-[60vh] flex justify-center items-center">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-[60vh] flex justify-center items-center">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="text-center py-20 px-6">
                <h2 className="text-2xl font-bold mb-3">
                    Doctor Not Found
                </h2>

                <p className="text-gray-500 mb-6">
                    The doctor information could not be loaded.
                </p>

                <button
                    type="button"
                    onClick={() => router.push("/appointments")}
                    className="btn btn-primary"
                >
                    Back to Appointments
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-16 px-6">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h1 className="text-3xl font-bold text-center">
                        Book Appointment
                    </h1>

                    <p className="text-center text-gray-500">
                        Doctor: {doctor.name}
                    </p>

                    <form
                        onSubmit={handleBooking}
                        className="space-y-4 mt-6"
                    >
                        <div>
                            <label className="label">Your Email</label>
                            <input
                                type="email"
                                value={user.email || ""}
                                readOnly
                                className="input input-bordered w-full bg-base-200"
                            />
                        </div>

                        <div>
                            <label className="label">Doctor</label>
                            <input
                                type="text"
                                value={doctor.name}
                                readOnly
                                className="input input-bordered w-full bg-base-200"
                            />
                        </div>

                        <div>
                            <label className="label">Patient Name</label>
                            <input
                                name="patientName"
                                type="text"
                                placeholder="Patient Name"
                                className="input input-bordered w-full"
                                required
                                minLength={2}
                            />
                        </div>

                        <div>
                            <label className="label">Gender</label>
                            <select
                                name="gender"
                                className="select select-bordered w-full"
                                defaultValue=""
                                required
                            >
                                <option value="" disabled>
                                    Select Gender
                                </option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="label">Phone Number</label>
                            <input
                                name="phone"
                                type="tel"
                                placeholder="01712345678"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">
                                Appointment Date
                            </label>
                            <input
                                name="date"
                                type="date"
                                min={
                                    new Date().toLocaleDateString("en-CA")
                                }
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">
                                Appointment Time
                            </label>
                            <input
                                name="time"
                                type="text"
                                placeholder="10:30 AM"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={bookingLoading}
                            className="btn btn-primary w-full"
                        >
                            {bookingLoading
                                ? "Booking..."
                                : "Confirm Appointment"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
