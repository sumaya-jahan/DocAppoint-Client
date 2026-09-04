"use client";

import { useEffect, useState } from "react";
import {
    useParams,
    useRouter,
} from "next/navigation";
import toast from "react-hot-toast";

import { useSession } from "../lib/auth-client";

const BookAppointmentContent = () => {
    const params = useParams();
    const router = useRouter();

    const id = params.id;

    const {
        data: session,
        isPending: sessionLoading,
    } = useSession();

    const user = session?.user;

    const [doctor, setDoctor] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [
        bookingLoading,
        setBookingLoading,
    ] = useState(false);

    useEffect(() => {
        if (sessionLoading) {
            return;
        }

        // Private route
        if (!user) {
            const bookingPath =
                `/book/${id}`;

            router.replace(
                `/login?callbackUrl=${encodeURIComponent(
                    bookingPath
                )}`
            );

            return;
        }

        const fetchDoctor = async () => {
            try {
                setLoading(true);

                const response =
                    await fetch(
                        `http://localhost:5000/doctors/${id}`
                    );

                if (!response.ok) {
                    throw new Error(
                        "Doctor not found"
                    );
                }

                const data =
                    await response.json();

                setDoctor(data);
            } catch (error) {
                console.error(error);

                setDoctor(null);

                toast.error(
                    "Failed to load doctor information."
                );
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

    const handleBooking = async (
        event
    ) => {
        event.preventDefault();

        if (!user?.email) {
            toast.error(
                "Please login first."
            );

            router.push("/login");
            return;
        }

        if (!doctor) {
            toast.error(
                "Doctor information is unavailable."
            );
            return;
        }

        const form =
            event.currentTarget;

        const booking = {
            userEmail: user.email,
            doctorName: doctor.name,
            patientName:
                form.patientName.value.trim(),
            gender:
                form.gender.value,
            phone:
                form.phone.value.trim(),
            appointmentDate:
                form.date.value,
            appointmentTime:
                form.time.value.trim(),
        };

        try {
            setBookingLoading(true);

            const response =
                await fetch(
                    "http://localhost:5000/appointments",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        credentials:
                            "include",

                        body: JSON.stringify(
                            booking
                        ),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to book appointment"
                );
            }

            if (data.insertedId) {
                toast.success(
                    "Appointment booked successfully!"
                );

                form.reset();

                router.push(
                    "/dashboard"
                );

                router.refresh();
            }
        } catch (error) {
            console.error(error);

            toast.error(
                error?.message ||
                "Booking failed!"
            );
        } finally {
            setBookingLoading(false);
        }
    };

    if (sessionLoading) {
        return (
            <div className="min-h-[60vh] flex justify-center items-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-[60vh] flex justify-center items-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-[60vh] flex justify-center items-center">
                <span className="loading loading-spinner loading-lg"></span>
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
                    The doctor information
                    could not be loaded.
                </p>

                <button
                    type="button"
                    onClick={() =>
                        router.push(
                            "/appointments"
                        )
                    }
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
                        Doctor:{" "}
                        {doctor.name}
                    </p>

                    <form
                        onSubmit={
                            handleBooking
                        }
                        className="space-y-4 mt-6"
                    >
                        {/* Email */}
                        <div>
                            <label className="label">
                                Your Email
                            </label>

                            <input
                                type="email"
                                value={
                                    user.email ||
                                    ""
                                }
                                readOnly
                                className="input input-bordered w-full bg-base-200"
                            />
                        </div>

                        {/* Doctor */}
                        <div>
                            <label className="label">
                                Doctor
                            </label>

                            <input
                                type="text"
                                value={
                                    doctor.name
                                }
                                readOnly
                                className="input input-bordered w-full bg-base-200"
                            />
                        </div>

                        {/* Patient Name */}
                        <div>
                            <label className="label">
                                Patient Name
                            </label>

                            <input
                                name="patientName"
                                type="text"
                                placeholder="Patient Name"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="label">
                                Gender
                            </label>

                            <select
                                name="gender"
                                className="select select-bordered w-full"
                                defaultValue=""
                                required
                            >
                                <option
                                    value=""
                                    disabled
                                >
                                    Select
                                    Gender
                                </option>

                                <option value="Male">
                                    Male
                                </option>

                                <option value="Female">
                                    Female
                                </option>

                                <option value="Other">
                                    Other
                                </option>
                            </select>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="label">
                                Phone Number
                            </label>

                            <input
                                name="phone"
                                type="tel"
                                placeholder="01712345678"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        {/* Date */}
                        <div>
                            <label className="label">
                                Appointment
                                Date
                            </label>

                            <input
                                type="date"
                                name="date"
                                min={
                                    new Date()
                                        .toISOString()
                                        .split(
                                            "T"
                                        )[0]
                                }
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        {/* Time */}
                        <div>
                            <label className="label">
                                Appointment
                                Time
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
                            disabled={
                                bookingLoading
                            }
                            className="btn btn-primary w-full"
                        >
                            {bookingLoading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Booking...
                                </>
                            ) : (
                                "Confirm Appointment"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookAppointmentContent;