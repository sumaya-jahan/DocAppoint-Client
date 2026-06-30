import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { AuthContext } from "../../providers/AuthProvider";

const BookAppointment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [doctor, setDoctor] = useState(null);

    useEffect(() => {
        fetch(`https://docappoint-server-uvkv.onrender.com/doctors/${id}`)
            .then((res) => res.json())
            .then((data) => setDoctor(data));
    }, [id]);

    const handleBooking = async (e) => {
        e.preventDefault();

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
            const res = await fetch(
                "https://docappoint-server-uvkv.onrender.com/appointments",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(booking),
                }
            );

            const data = await res.json();

            if (data.insertedId) {
                toast.success("Appointment booked successfully!");
                form.reset();
                navigate("/dashboard");
            }
        } catch (error) {
            console.log(error);
            toast.error("Booking failed!");
        }
    };

    if (!doctor) {
        return (
            <div className="text-center py-20">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-16 px-6">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">

                    <h2 className="text-3xl font-bold text-center">
                        Book Appointment
                    </h2>

                    <p className="text-center">
                        Doctor: {doctor.name}
                    </p>

                    <form
                        onSubmit={handleBooking}
                        className="space-y-4 mt-6"
                    >
                        <input
                            name="patientName"
                            placeholder="Patient Name"
                            className="input input-bordered w-full"
                            required
                        />

                        <select
                            name="gender"
                            className="select select-bordered w-full"
                            required
                        >
                            <option value="">Select Gender</option>
                            <option>Male</option>
                            <option>Female</option>
                        </select>

                        <input
                            name="phone"
                            placeholder="Phone Number"
                            className="input input-bordered w-full"
                            required
                        />

                        <input
                            type="date"
                            name="date"
                            className="input input-bordered w-full"
                            required
                        />

                        <input
                            name="time"
                            placeholder="10:30 AM"
                            className="input input-bordered w-full"
                            required
                        />

                        <button className="btn btn-primary w-full">
                            Confirm Appointment
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default BookAppointment;