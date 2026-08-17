import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../../providers/AuthProvider";

const MyBookings = () => {
    const { user } = useContext(AuthContext);

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(null);

    const [selectedBooking, setSelectedBooking] =
        useState(null);

    const [formData, setFormData] = useState({
        patientName: "",
        gender: "",
        phone: "",
        appointmentDate: "",
        appointmentTime: "",
    });

    // =========================
    // LOAD BOOKINGS
    // =========================
    useEffect(() => {
        if (!user?.email) {
            return;
        }

        const loadBookings = async () => {
            try {
                setLoading(true);

                const token =
                    localStorage.getItem("access-token");

                const res = await fetch(
                    `https://docappoint-server-uvkv.onrender.com/appointments?email=${encodeURIComponent(
                        user.email
                    )}`,
                    {
                        headers: {
                            authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to load appointments"
                    );
                }

                setBookings(data);
            } catch (error) {
                console.error(error);

                toast.error(
                    error.message ||
                    "Failed to load appointments."
                );
            } finally {
                setLoading(false);
            }
        };

        loadBookings();
    }, [user?.email]);

    // =========================
    // DELETE BOOKING
    // =========================
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this appointment?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            setDeleteLoading(id);

            const token =
                localStorage.getItem("access-token");

            const res = await fetch(
                `https://docappoint-server-uvkv.onrender.com/appointments/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message ||
                    "Failed to delete appointment"
                );
            }

            if (data.deletedCount > 0) {
                setBookings((currentBookings) =>
                    currentBookings.filter(
                        (booking) =>
                            booking._id !== id
                    )
                );

                toast.success(
                    "Appointment deleted successfully!"
                );
            }
        } catch (error) {
            console.error(error);

            toast.error(
                error.message ||
                "Failed to delete appointment."
            );
        } finally {
            setDeleteLoading(null);
        }
    };

    // =========================
    // OPEN UPDATE MODAL
    // =========================
    const handleOpenModal = (booking) => {
        setSelectedBooking(booking);

        setFormData({
            patientName:
                booking.patientName || "",
            gender: booking.gender || "",
            phone: booking.phone || "",
            appointmentDate:
                booking.appointmentDate || "",
            appointmentTime:
                booking.appointmentTime || "",
        });

        document
            .getElementById("update_modal")
            ?.showModal();
    };

    // =========================
    // INPUT CHANGE
    // =========================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =========================
    // UPDATE BOOKING
    // =========================
    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!selectedBooking?._id) {
            return;
        }

        try {
            setUpdateLoading(true);

            const token =
                localStorage.getItem("access-token");

            const res = await fetch(
                `https://docappoint-server-uvkv.onrender.com/appointments/${selectedBooking._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                        authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message ||
                    "Failed to update appointment"
                );
            }

            setBookings((currentBookings) =>
                currentBookings.map((booking) =>
                    booking._id ===
                        selectedBooking._id
                        ? {
                            ...booking,
                            ...formData,
                        }
                        : booking
                )
            );

            document
                .getElementById("update_modal")
                ?.close();

            setSelectedBooking(null);

            toast.success(
                "Appointment updated successfully!"
            );
        } catch (error) {
            console.error(error);

            toast.error(
                error.message ||
                "Failed to update appointment."
            );
        } finally {
            setUpdateLoading(false);
        }
    };

    // =========================
    // LOADING
    // =========================
    if (loading) {
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
                    Manage your doctor appointments.
                </p>
            </div>

            {/* No Booking */}
            {bookings.length === 0 ? (
                <div className="text-center py-16 bg-base-100 rounded-2xl shadow">
                    <h3 className="text-xl font-semibold">
                        No bookings found
                    </h3>

                    <p className="text-gray-500 mt-2">
                        You have not booked any appointments yet.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bookings.map((booking) => (
                        <div
                            key={booking._id}
                            className="card bg-base-100 shadow-xl h-full"
                        >
                            <div className="card-body">
                                <h3 className="card-title text-2xl">
                                    {booking.doctorName}
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
                                        {booking.gender}
                                    </p>

                                    <p>
                                        <strong>
                                            Phone:
                                        </strong>{" "}
                                        {booking.phone}
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
                                        {booking.userEmail}
                                    </p>
                                </div>

                                <div className="card-actions mt-auto pt-5">
                                    <button
                                        onClick={() =>
                                            handleOpenModal(
                                                booking
                                            )
                                        }
                                        className="btn btn-primary flex-1"
                                    >
                                        Update
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                booking._id
                                            )
                                        }
                                        disabled={
                                            deleteLoading ===
                                            booking._id
                                        }
                                        className="btn btn-error flex-1"
                                    >
                                        {deleteLoading ===
                                            booking._id ? (
                                            <>
                                                <span className="loading loading-spinner loading-sm"></span>
                                                Deleting...
                                            </>
                                        ) : (
                                            "Delete"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* =========================
                UPDATE MODAL
            ========================= */}
            <dialog
                id="update_modal"
                className="modal"
            >
                <div className="modal-box">
                    <h3 className="font-bold text-2xl mb-5">
                        Update Appointment
                    </h3>

                    <form
                        onSubmit={handleUpdate}
                        className="space-y-4"
                    >
                        {/* Doctor */}
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Doctor
                                </span>
                            </label>

                            <input
                                type="text"
                                value={
                                    selectedBooking?.doctorName ||
                                    ""
                                }
                                readOnly
                                className="input input-bordered w-full bg-base-200"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Email
                                </span>
                            </label>

                            <input
                                type="email"
                                value={
                                    selectedBooking?.userEmail ||
                                    ""
                                }
                                readOnly
                                className="input input-bordered w-full bg-base-200"
                            />
                        </div>

                        {/* Patient Name */}
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Patient Name
                                </span>
                            </label>

                            <input
                                type="text"
                                name="patientName"
                                value={
                                    formData.patientName
                                }
                                onChange={handleChange}
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Gender
                                </span>
                            </label>

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
                                <span className="label-text">
                                    Phone
                                </span>
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        {/* Date */}
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Appointment Date
                                </span>
                            </label>

                            <input
                                type="date"
                                name="appointmentDate"
                                value={
                                    formData.appointmentDate
                                }
                                onChange={handleChange}
                                min={
                                    new Date()
                                        .toISOString()
                                        .split("T")[0]
                                }
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        {/* Time */}
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Appointment Time
                                </span>
                            </label>

                            <input
                                type="text"
                                name="appointmentTime"
                                value={
                                    formData.appointmentTime
                                }
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
                                className="btn"
                                onClick={() => {
                                    document
                                        .getElementById(
                                            "update_modal"
                                        )
                                        ?.close();

                                    setSelectedBooking(
                                        null
                                    );
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                <form
                    method="dialog"
                    className="modal-backdrop"
                >
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default MyBookings;