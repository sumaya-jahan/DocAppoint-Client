import { useEffect, useState } from "react";
import DoctorCard from "../../components/DoctorCard";

const Home = () => {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/doctors")
            .then((res) => res.json())
            .then((data) => setDoctors(data))
            .catch((error) => console.log(error));
    }, []);

    const topDoctors = [...doctors]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);

    return (
        <div>
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid md:grid-cols-2 gap-10 items-center">
                    <div>
                        <h1 className="text-5xl font-bold leading-tight">
                            Book Your Doctor Appointment Easily
                        </h1>

                        <p className="mt-6 text-gray-600">
                            Find trusted doctors, schedule appointments, and
                            manage your healthcare journey with DocAppoint.
                        </p>

                        <button className="btn btn-primary mt-6">
                            Book Appointment
                        </button>
                    </div>

                    <div>
                        <img
                            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d"
                            alt="Doctor"
                            className="rounded-2xl shadow-lg"
                        />
                    </div>
                </div>
            </section>

            {/* Top Rated Doctors */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <h2 className="text-4xl font-bold text-center mb-10">
                    Top Rated Doctors
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {topDoctors.map((doctor) => (
                        <DoctorCard
                            key={doctor.id}
                            doctor={doctor}
                        />
                    ))}
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <h2 className="text-4xl font-bold text-center mb-12">
                    Why Choose DocAppoint?
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body text-center">
                            <h3 className="text-2xl font-bold">
                                Verified Doctors
                            </h3>
                            <p>
                                Connect with experienced and verified doctors
                                from different specialties.
                            </p>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body text-center">
                            <h3 className="text-2xl font-bold">
                                Easy Booking
                            </h3>
                            <p>
                                Schedule appointments quickly with a simple and
                                user-friendly booking system.
                            </p>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body text-center">
                            <h3 className="text-2xl font-bold">
                                Secure Management
                            </h3>
                            <p>
                                Manage bookings and profile information securely
                                from your dashboard.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Patient Testimonials */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <h2 className="text-4xl font-bold text-center mb-12">
                    What Our Patients Say
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <p>
                                "The booking process was very smooth. I found
                                the right doctor within minutes."
                            </p>

                            <h3 className="font-bold mt-4">
                                — Rahim Uddin
                            </h3>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <p>
                                "Excellent service. Managing appointments has
                                never been this easy."
                            </p>

                            <h3 className="font-bold mt-4">
                                — Nusrat Jahan
                            </h3>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <p>
                                "The doctors are highly professional and the
                                platform is very user friendly."
                            </p>

                            <h3 className="font-bold mt-4">
                                — Mahmud Hasan
                            </h3>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;