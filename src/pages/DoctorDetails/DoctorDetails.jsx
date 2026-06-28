import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DoctorDetails = () => {
    const { id } = useParams();

    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5000/doctors/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setDoctor(data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="text-center py-20">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!doctor || doctor.message) {
        return (
            <div className="text-center py-20">
                <h1 className="text-3xl font-bold">
                    Doctor Not Found
                </h1>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">

                    <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-48 h-48 rounded-full mx-auto object-cover"
                    />

                    <h1 className="text-4xl font-bold text-center mt-4">
                        {doctor.name}
                    </h1>

                    <p className="text-center text-lg">
                        {doctor.specialty}
                    </p>

                    <div className="mt-6 space-y-2">
                        <p>
                            <strong>Experience:</strong> {doctor.experience}
                        </p>

                        <p>
                            <strong>Consultation Fee:</strong> ৳{doctor.fee}
                        </p>

                        <p>
                            <strong>Rating:</strong> ⭐ {doctor.rating}
                        </p>
                    </div>

                    <button className="btn btn-primary mt-8">
                        Book Appointment
                    </button>

                </div>
            </div>
        </div>
    );
};

export default DoctorDetails;