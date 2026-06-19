import doctors from "../../data/doctors";
import DoctorCard from "../../components/DoctorCard";

const Home = () => {
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
                            Find trusted doctors, schedule appointments, and manage your
                            healthcare journey with DocAppoint.
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
                    {doctors.map((doctor) => (
                        <DoctorCard
                            key={doctor.id}
                            doctor={doctor}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;