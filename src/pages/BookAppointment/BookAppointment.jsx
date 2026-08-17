import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { AuthContext } from "../../providers/AuthProvider";
import PageTitle from "../../components/PageTitle";

const BookAppointment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        fetch(
            `https://docappoint-server-uvkv.onrender.com/doctors/${id}`
        )
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Doctor not found");
                }

                return res.json();
            })
            .then((data) => {
                setDoctor(data);
            })
            .catch((error) => {
                console.error(error);
                toast.error("Failed to load doctor information.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleBooking = async (e) => {
        e.preventDefault();

        if (!user?.email) {
            toast.error("Please login first.");
            navigate("/login");
            return;
        }

        const token = localStorage.getItem("access-token");

        if (!token) {
            toast.error(
                "Authentication token not found. Please login again."
            );
            navigate("/login");
            return;
        }

        const form = e.target;

        const booking = {
            userEmail: user.email,
            doctorName: doctor.name,
            patientName: form.patientName.value,
            gender: form.gender.value,
            phone: form.phone.value,
            appointmentDate: form.date.value,
            appointmentTime: form.time.value,
        };

        try {
            setBookingLoading(true);

            const res = await fetch(
                "https://docappoint-server-uvkv.onrender.com/appointments",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(booking),
                }
            );

            const data = await res.json();

            if (!res.ok) {
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
                navigate("/dashboard");
            }
        } catch (error) {
            console.error(error);

            toast.error(
                error.message || "Booking failed!"
            );
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <PageTitle title="Book Appointment" />

                <div className="flex justify-center items-center py-20">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </>
        );
    }

    if (!doctor) {
        return (
            <>
                <PageTitle title="Doctor Not Found" />

                <div className="text-center py-20 px-6">
                    <h2 className="text-2xl font-bold mb-3">
                        Doctor Not Found
                    </h2>

                    <p className="text-gray-500 mb-6">
                        The doctor information could not be loaded.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/appointments")
                        }
                        className="btn btn-primary"
                    >
                        Back to Appointments
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <PageTitle
                title={`Book Appointment - ${doctor.name}`}
            />

            <div className="max-w-2xl mx-auto py-16 px-6">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="text-3xl font-bold text-center">
                            Book Appointment
                        </h2>

                        <p className="text-center text-gray-500">
                            Doctor: {doctor.name}
                        </p>

                        <form
                            onSubmit={handleBooking}
                            className="space-y-4 mt-6"
                        >
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Your Email
                                    </span>
                                </label>

                                <input
                                    type="email"
                                    value={user?.email || ""}
                                    readOnly
                                    className="input input-bordered w-full bg-base-200"
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Doctor
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    value={doctor.name}
                                    readOnly
                                    className="input input-bordered w-full bg-base-200"
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Patient Name
                                    </span>
                                </label>

                                <input
                                    name="patientName"
                                    type="text"
                                    placeholder="Patient Name"
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Gender
                                    </span>
                                </label>

                                <select
                                    name="gender"
                                    className="select select-bordered w-full"
                                    defaultValue=""
                                    required
                                >
                                    <option value="" disabled>
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

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Phone Number
                                    </span>
                                </label>

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
                                    <span className="label-text">
                                        Appointment Date
                                    </span>
                                </label>

                                <input
                                    type="date"
                                    name="date"
                                    min={
                                        new Date()
                                            .toISOString()
                                            .split("T")[0]
                                    }
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Appointment Time
                                    </span>
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
        </>
    );
};

export default BookAppointment;