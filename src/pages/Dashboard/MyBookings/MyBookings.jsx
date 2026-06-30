import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../../providers/AuthProvider";

const MyBookings = () => {
    const { user } = useContext(AuthContext);

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedBooking, setSelectedBooking] =
        useState(null);

    const [formData, setFormData] = useState({
        patientName: "",
        gender: "",
        phone: "",
        appointmentDate: "",
        appointmentTime: "",
    });

    useEffect(() => {
        if (!user?.email) {
            setLoading(false);
            return;
        }

        const loadBookings = async () => {
            try {
                const res = await fetch(
                    `https://docappoint-server-uvkv.onrender.com/appointments?email=${user.email}`
                );

                const data = await res.json();

                setBookings(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        loadBookings();
    }, [user]);

    const handleDelete = async (id) => {
        try {
            const res = await fetch(
                `https://docappoint-server-uvkv.onrender.com/appointments/${id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await res.json();

            if (data.deletedCount > 0) {
                setBookings(
                    bookings.filter(
                        (booking) => booking._id !== id
                    )
                );

                toast.success(
                    "Appointment deleted successfully!"
                );
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleOpenModal = (booking) => {
        setSelectedBooking(booking);

        setFormData({
            patientName: booking.patientName,
            gender: booking.gender,
            phone: booking.phone,
            appointmentDate:
                booking.appointmentDate,
            appointmentTime:
                booking.appointmentTime,
        });

        document
            .getElementById("update_modal")
            .showModal();
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const res = await fetch(
            `https://docappoint-server-uvkv.onrender.com/appointments/${selectedBooking._id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify(formData),
            }
        );

        const data = await res.json();

        if (data.modifiedCount > 0) {
            const updated = bookings.map(
                (booking) =>
                    booking._id ===
                        selectedBooking._id
                        ? {
                            ...booking,
                            ...formData,
                        }
                        : booking
            );

            setBookings(updated);

            document
                .getElementById("update_modal")
                .close();

            toast.success(
                "Appointment updated successfully!"
            );
        }
    };

    if (loading) {
        return (
            <div className="text-center py-20">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            <h2 className="text-3xl font-bold mb-8">
                My Bookings
            </h2>

            {bookings.length === 0 ? (
                <p className="text-center text-gray-500">
                    No bookings found.
                </p>
            ) : (
                <div className="space-y-5">
                    {bookings.map((booking) => (
                        <div
                            key={booking._id}
                            className="card bg-base-100 shadow-xl"
                        >
                            <div className="card-body">
                                <h3 className="card-title">
                                    {booking.doctorName}
                                </h3>

                                <p>
                                    <strong>Patient:</strong>{" "}
                                    {booking.patientName}
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

                                <div className="flex gap-3 mt-4">
                                    <button
                                        onClick={() =>
                                            handleOpenModal(
                                                booking
                                            )
                                        }
                                        className="btn btn-primary"
                                    >
                                        Update
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                booking._id
                                            )
                                        }
                                        className="btn btn-error"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <dialog
                id="update_modal"
                className="modal"
            >
                <div className="modal-box">
                    <h3 className="font-bold text-xl mb-4">
                        Update Appointment
                    </h3>

                    <form
                        onSubmit={handleUpdate}
                        className="space-y-4"
                    >
                        <input
                            type="text"
                            value={
                                selectedBooking?.doctorName ||
                                ""
                            }
                            readOnly
                            className="input input-bordered w-full"
                        />

                        <input
                            type="email"
                            value={
                                selectedBooking?.userEmail ||
                                ""
                            }
                            readOnly
                            className="input input-bordered w-full"
                        />

                        <input
                            type="text"
                            name="patientName"
                            value={formData.patientName}
                            onChange={handleChange}
                            placeholder="Patient Name"
                            className="input input-bordered w-full"
                            required
                        />

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
                        </select>

                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone"
                            className="input input-bordered w-full"
                            required
                        />

                        <input
                            type="date"
                            name="appointmentDate"
                            value={
                                formData.appointmentDate
                            }
                            onChange={handleChange}
                            className="input input-bordered w-full"
                            required
                        />

                        <input
                            type="text"
                            name="appointmentTime"
                            value={
                                formData.appointmentTime
                            }
                            onChange={handleChange}
                            placeholder="Appointment Time"
                            className="input input-bordered w-full"
                            required
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Save
                            </button>

                            <form method="dialog">
                                <button className="btn">
                                    Cancel
                                </button>
                            </form>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default MyBookings;