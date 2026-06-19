import doctors from "../../data/doctors";
import DoctorCard from "../../components/DoctorCard";

const AllAppointments = () => {
    return (
        <div className="max-w-7xl mx-auto px-6 py-16">
            <h1 className="text-5xl font-bold text-center mb-4">
                All Appointments
            </h1>

            <p className="text-center text-gray-500 mb-10">
                Browse available doctors and book your appointment.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
                {doctors.map((doctor) => (
                    <DoctorCard
                        key={doctor.id}
                        doctor={doctor}
                    />
                ))}
            </div>
        </div>
    );
};

export default AllAppointments;