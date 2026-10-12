
"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "../lib/auth-client";

const API_URL = (
    process.env.NEXT_PUBLIC_API_URL?.startsWith("http")
        ? process.env.NEXT_PUBLIC_API_URL
        : "http://localhost:5000"
).replace(/\/$/, "");

const emptyForm = {
    patientName: "",
    gender: "",
    phone: "",
    appointmentDate: "",
    appointmentTime: "",
};

async function apiRequest(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        credentials: "include",
        headers: {
            Accept: "application/json",
            ...(options.body
                ? { "Content-Type": "application/json" }
                : {}),
        },
    });

    const contentType =
        response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
        throw new Error(
            `API returned HTML instead of JSON (HTTP ${response.status}). Check API URL.`
        );
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data?.message || `Request failed (HTTP ${response.status})`
        );
    }

    return data;
}

export default function MyBookings() {
    const {
        data: session,
        isPending: sessionLoading,
    } = useSession();

    const user = session?.user;

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [bookingToDelete, setBookingToDelete] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [error, setError] = useState("");

    const loadBookings = useCallback(async () => {
        if (!user?.email) {
            setBookings([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const data = await apiRequest(
                `/appointments?email=${encodeURIComponent(user.email)}`
            );

            if (!Array.isArray(data)) {
                throw new Error("Invalid bookings response.");
            }

            setBookings(data);
        } catch (err) {
            console.error("Load bookings error:", err);
            setError(err.message);
            setBookings([]);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }, [user?.email]);

    useEffect(() => {
        if (!sessionLoading) {
            loadBookings();
        }
    }, [sessionLoading, loadBookings]);

    function openUpdate(booking) {
        setSelectedBooking(booking);

        setFormData({
            patientName: booking.patientName || "",
            gender: booking.gender || "",
            phone: booking.phone || "",
            appointmentDate: booking.appointmentDate || "",
            appointmentTime: booking.appointmentTime || "",
        });
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function handleUpdate(event) {
        event.preventDefault();
        if (!selectedBooking) return;

        setUpdateLoading(true);

        try {
            await apiRequest(
                `/appointments/${selectedBooking._id}`,
                {
                    method: "PUT",
                    body: JSON.stringify(formData),
                }
            );

            setSelectedBooking(null);
            toast.success("Appointment updated successfully!");
            await loadBookings();
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        } finally {
            setUpdateLoading(false);
        }
    }

    async function handleDelete() {
        if (!bookingToDelete) return;

        setDeleteLoading(true);

        try {
            await apiRequest(
                `/appointments/${bookingToDelete._id}`,
                { method: "DELETE" }
            );

            setBookingToDelete(null);
            toast.success("Appointment deleted successfully!");
            await loadBookings();
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        } finally {
            setDeleteLoading(false);
        }
    }

    if (sessionLoading || loading) {
        return (
            <div className="flex justify-center items-center py-16">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-10">
                Please login to view your bookings.
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-3xl font-bold">
                        My Bookings
                    </h2>
                    <p className="text-base-content/70 mt-2">
                        View and manage your doctor appointments.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-outline"
                    onClick={loadBookings}
                >
                    Refresh
                </button>
            </div>

            {error && (
                <div role="alert" className="alert alert-error mb-5">
                    <span>{error}</span>
                </div>
            )}

            {!error && bookings.length === 0 ? (
                <div className="text-center py-16 bg-base-100 rounded-xl shadow-sm">
                    <h3 className="text-2xl font-semibold">
                        No bookings found
                    </h3>
                    <p className="text-base-content/60 mt-2">
                        You have not booked any appointments yet.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {bookings.map((booking) => (
                        <div
                            key={booking._id}
                            className="card bg-base-100 shadow-md"
                        >
                            <div className="card-body">
                                <h3 className="card-title text-2xl">
                                    {booking.doctorName}
                                </h3>

                                <div className="space-y-2 mt-3">
                                    <p>
                                        <strong>Patient:</strong>{" "}
                                        {booking.patientName}
                                    </p>
                                    <p>
                                        <strong>Gender:</strong>{" "}
                                        {booking.gender}
                                    </p>
                                    <p>
                                        <strong>Phone:</strong>{" "}
                                        {booking.phone}
                                    </p>
                                    <p>
                                        <strong>Date:</strong>{" "}
                                        {booking.appointmentDate}
                                    </p>
                                    <p>
                                        <strong>Time:</strong>{" "}
                                        {booking.appointmentTime}
                                    </p>
                                    <p className="break-all">
                                        <strong>Email:</strong>{" "}
                                        {booking.userEmail}
                                    </p>
                                </div>

                                <div className="card-actions mt-auto pt-5">
                                    <button
                                        type="button"
                                        className="btn btn-primary flex-1"
                                        onClick={() => openUpdate(booking)}
                                    >
                                        Update
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-error flex-1"
                                        onClick={() =>
                                            setBookingToDelete(booking)
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Update Appointment */}
            {selectedBooking && (
                <dialog open className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-2xl mb-5">
                            Update Appointment
                        </h3>

                        <form
                            onSubmit={handleUpdate}
                            className="space-y-4"
                        >
                            <div>
                                <label className="label">Doctor</label>
                                <input
                                    type="text"
                                    value={selectedBooking.doctorName || ""}
                                    readOnly
                                    className="input input-bordered w-full bg-base-200"
                                />
                            </div>

                            <div>
                                <label className="label">Email</label>
                                <input
                                    type="email"
                                    value={selectedBooking.userEmail || ""}
                                    readOnly
                                    className="input input-bordered w-full bg-base-200"
                                />
                            </div>

                            <div>
                                <label className="label">
                                    Patient Name
                                </label>
                                <input
                                    type="text"
                                    name="patientName"
                                    value={formData.patientName}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="select select-bordered w-full"
                                    required
                                >
                                    <option value="">
                                        Select Gender
                                    </option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="label">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">
                                    Appointment Date
                                </label>
                                <input
                                    type="date"
                                    name="appointmentDate"
                                    value={formData.appointmentDate}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">
                                    Appointment Time
                                </label>
                                <input
                                    type="text"
                                    name="appointmentTime"
                                    value={formData.appointmentTime}
                                    onChange={handleChange}
                                    placeholder="10:30 AM"
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            <div className="modal-action">
                                <button
                                    type="submit"
                                    disabled={updateLoading}
                                    className="btn btn-primary"
                                >
                                    {updateLoading
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>

                                <button
                                    type="button"
                                    disabled={updateLoading}
                                    onClick={() => setSelectedBooking(null)}
                                    className="btn"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>
            )}

            {/* Delete Confirmation */}
            {bookingToDelete && (
                <dialog open className="modal">
                    <div className="modal-box">
                        <h3 className="text-2xl font-bold">
                            Delete Appointment
                        </h3>

                        <p className="py-5">
                            Are you sure you want to delete your
                            appointment with{" "}
                            <strong>
                                {bookingToDelete.doctorName}
                            </strong>
                            ?
                        </p>

                        <div className="modal-action">
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleteLoading}
                                className="btn btn-error"
                            >
                                {deleteLoading
                                    ? "Deleting..."
                                    : "Yes, Delete"}
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setBookingToDelete(null)
                                }
                                disabled={deleteLoading}
                                className="btn"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
}
