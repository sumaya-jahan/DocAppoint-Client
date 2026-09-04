"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useSession } from "../lib/auth-client";

const MyBookings = () => {
    const {
        data: session,
        isPending: sessionLoading,
    } = useSession();

    const user = session?.user;

    const [bookings, setBookings] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [updateLoading, setUpdateLoading] =
        useState(false);

    const [deleteLoading, setDeleteLoading] =
        useState(false);

    const [selectedBooking, setSelectedBooking] =
        useState(null);

    const [bookingToDelete, setBookingToDelete] =
        useState(null);

    const [formData, setFormData] =
        useState({
            patientName: "",
            gender: "",
            phone: "",
            appointmentDate: "",
            appointmentTime: "",
        });

    // ======================================
    // LOAD CURRENT USER BOOKINGS
    // ======================================
    useEffect(() => {
        if (sessionLoading) {
            return;
        }

        if (!user?.email) {
            setBookings([]);
            setLoading(false);
            return;
        }

        const loadBookings = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `http://localhost:5000/appointments?email=${encodeURIComponent(
                        user.email
                    )}`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to load appointments"
                    );
                }

                setBookings(data);
            } catch (error) {
                console.error(error);

                toast.error(
                    error?.message ||
                    "Failed to load appointments."
                );
            } finally {
                setLoading(false);
            }
        };

        loadBookings();
    }, [
        user?.email,
        sessionLoading,
    ]);

    // ======================================
    // OPEN UPDATE MODAL
    // ======================================
    const handleOpenUpdate = (booking) => {
        setSelectedBooking(booking);

        setFormData({
            patientName:
                booking.patientName || "",
            gender:
                booking.gender || "",
            phone:
                booking.phone || "",
            appointmentDate:
                booking.appointmentDate || "",
            appointmentTime:
                booking.appointmentTime || "",
        });
    };

    // ======================================
    // CLOSE UPDATE MODAL
    // ======================================
    const handleCloseUpdate = () => {
        setSelectedBooking(null);
    };

    // ======================================
    // INPUT CHANGE
    // ======================================
    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setFormData(
            (previousData) => ({
                ...previousData,
                [name]: value,
            })
        );
    };

    // ======================================
    // UPDATE BOOKING
    // ======================================
    const handleUpdate = async (
        event
    ) => {
        event.preventDefault();

        if (!selectedBooking?._id) {
            return;
        }

        try {
            setUpdateLoading(true);

            const response = await fetch(
                `http://localhost:5000/appointments/${selectedBooking._id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    credentials:
                        "include",

                    body: JSON.stringify(
                        formData
                    ),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to update appointment"
                );
            }

            setBookings(
                (currentBookings) =>
                    currentBookings.map(
                        (booking) =>
                            booking._id ===
                                selectedBooking._id
                                ? {
                                    ...booking,
                                    ...formData,
                                }
                                : booking
                    )
            );

            setSelectedBooking(null);

            toast.success(
                "Appointment updated successfully!"
            );
        } catch (error) {
            console.error(error);

            toast.error(
                error?.message ||
                "Failed to update appointment."
            );
        } finally {
            setUpdateLoading(false);
        }
    };

    // ======================================
    // DELETE BOOKING
    // ======================================
    const handleDelete = async () => {
        if (!bookingToDelete?._id) {
            return;
        }

        try {
            setDeleteLoading(true);

            const response = await fetch(
                `http://localhost:5000/appointments/${bookingToDelete._id}`,
                {
                    method: "DELETE",
                    credentials:
                        "include",
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to delete appointment"
                );
            }

            if (data.deletedCount > 0) {
                setBookings(
                    (currentBookings) =>
                        currentBookings.filter(
                            (booking) =>
                                booking._id !==
                                bookingToDelete._id
                        )
                );

                toast.success(
                    "Appointment deleted successfully!"
                );
            }

            setBookingToDelete(null);
        } catch (error) {
            console.error(error);

            toast.error(
                error?.message ||
                "Failed to delete appointment."
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    if (
        sessionLoading ||
        loading
    ) {
        return (
            <div className="flex justify-center items-center py-20">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
            <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold">
                    My Bookings
                </h2>

                <p className="text-gray-500 mt-2">
                    Manage your doctor
                    appointments.
                </p>
            </div>

            {bookings.length === 0 ? (
                <div className="text-center py-16 bg-base-100 rounded-2xl shadow">
                    <h3 className="text-xl font-semibold">
                        No bookings found
                    </h3>

                    <p className="text-gray-500 mt-2">
                        You have not booked any
                        appointments yet.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bookings.map(
                        (booking) => (
                            <div
                                key={
                                    booking._id
                                }
                                className="card bg-base-100 shadow-xl h-full"
                            >
                                <div className="card-body">
                                    <h3 className="card-title text-2xl">
                                        {
                                            booking.doctorName
                                        }
                                    </h3>

                                    <div className="space-y-2 mt-3">
                                        <p>
                                            <strong>
                                                Patient:
                                            </strong>{" "}
                                            {
                                                booking.patientName
                                            }
                                        </p>

                                        <p>
                                            <strong>
                                                Gender:
                                            </strong>{" "}
                                            {
                                                booking.gender
                                            }
                                        </p>

                                        <p>
                                            <strong>
                                                Phone:
                                            </strong>{" "}
                                            {
                                                booking.phone
                                            }
                                        </p>

                                        <p>
                                            <strong>
                                                Date:
                                            </strong>{" "}
                                            {
                                                booking.appointmentDate
                                            }
                                        </p>

                                        <p>
                                            <strong>
                                                Time:
                                            </strong>{" "}
                                            {
                                                booking.appointmentTime
                                            }
                                        </p>

                                        <p className="break-all">
                                            <strong>
                                                Email:
                                            </strong>{" "}
                                            {
                                                booking.userEmail
                                            }
                                        </p>
                                    </div>

                                    <div className="card-actions mt-auto pt-5">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleOpenUpdate(
                                                    booking
                                                )
                                            }
                                            className="btn btn-primary flex-1"
                                        >
                                            Update
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setBookingToDelete(
                                                    booking
                                                )
                                            }
                                            className="btn btn-error flex-1"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            )}
            {/* UPDATE MODAL */}
            {selectedBooking && (
                <dialog
                    open
                    className="modal"
                >
                    <div className="modal-box">
                        <h3 className="font-bold text-2xl mb-5">
                            Update Appointment
                        </h3>

                        <form
                            onSubmit={
                                handleUpdate
                            }
                            className="space-y-4"
                        >
                            <div>
                                <label className="label">
                                    Doctor
                                </label>

                                <input
                                    type="text"
                                    value={
                                        selectedBooking.doctorName ||
                                        ""
                                    }
                                    readOnly
                                    className="input input-bordered w-full bg-base-200"
                                />
                            </div>

                            <div>
                                <label className="label">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={
                                        selectedBooking.userEmail ||
                                        ""
                                    }
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
                                    value={
                                        formData.patientName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">
                                    Gender
                                </label>

                                <select
                                    name="gender"
                                    value={
                                        formData.gender
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="select select-bordered w-full"
                                    required
                                >
                                    <option value="">
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

                            <div>
                                <label className="label">
                                    Phone
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={
                                        formData.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">
                                    Appointment
                                    Date
                                </label>

                                <input
                                    type="date"
                                    name="appointmentDate"
                                    value={
                                        formData.appointmentDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min={new Date()
                                        .toISOString()
                                        .split(
                                            "T"
                                        )[0]}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">
                                    Appointment
                                    Time
                                </label>

                                <input
                                    type="text"
                                    name="appointmentTime"
                                    value={
                                        formData.appointmentTime
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="10:30 AM"
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            <div className="modal-action">
                                <button
                                    type="submit"
                                    disabled={
                                        updateLoading
                                    }
                                    className="btn btn-primary"
                                >
                                    {updateLoading ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleCloseUpdate
                                    }
                                    disabled={
                                        updateLoading
                                    }
                                    className="btn"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>

                    <button
                        type="button"
                        aria-label="Close update modal"
                        onClick={
                            handleCloseUpdate
                        }
                        className="modal-backdrop"
                    />
                </dialog>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {bookingToDelete && (
                <dialog
                    open
                    className="modal"
                >
                    <div className="modal-box">
                        <h3 className="text-2xl font-bold">
                            Delete Appointment
                        </h3>

                        <p className="py-5">
                            Are you sure you want
                            to delete your
                            appointment with{" "}
                            <strong>
                                {
                                    bookingToDelete.doctorName
                                }
                            </strong>
                            ?
                        </p>

                        <div className="modal-action">
                            <button
                                type="button"
                                onClick={
                                    handleDelete
                                }
                                disabled={
                                    deleteLoading
                                }
                                className="btn btn-error"
                            >
                                {deleteLoading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Deleting...
                                    </>
                                ) : (
                                    "Yes, Delete"
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setBookingToDelete(
                                        null
                                    )
                                }
                                disabled={
                                    deleteLoading
                                }
                                className="btn"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>

                    <button
                        type="button"
                        aria-label="Close delete modal"
                        onClick={() =>
                            setBookingToDelete(
                                null
                            )
                        }
                        className="modal-backdrop"
                    />
                </dialog>
            )}
        </div>
    );
};

export default MyBookings;