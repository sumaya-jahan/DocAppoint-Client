import { useEffect, useState } from "react";
import DoctorCard from "../../components/DoctorCard";

const AllAppointments = () => {
    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/doctors")
            .then((res) => res.json())
            .then((data) => setDoctors(data))
            .catch((error) => console.log(error));
    }, []);

    const filteredDoctors = doctors.filter((doctor) =>
        doctor.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-16">
            <h1 className="text-5xl font-bold text-center mb-4">
                All Appointments
            </h1>

            <p className="text-center text-gray-500 mb-10">
                Browse available doctors and book your appointment.
            </p>

            <div className="flex justify-center mb-10">
                <input
                    type="text"
                    placeholder="Search Doctor Name..."
                    className="input input-bordered w-full max-w-md"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {filteredDoctors.map((doctor) => (
                    <DoctorCard
                        key={doctor.id}
                        doctor={doctor}
                    />
                ))}
            </div>

            {filteredDoctors.length === 0 && (
                <p className="text-center text-red-500 mt-10">
                    No doctor found.
                </p>
            )}
        </div>
    );
};

export default AllAppointments;