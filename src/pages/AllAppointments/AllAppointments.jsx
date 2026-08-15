import { useEffect, useState } from "react";
import DoctorCard from "../../components/DoctorCard";

const AllAppointments = () => {
    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchDoctors = (searchText = "") => {
        setLoading(true);

        const url = searchText
            ? `https://docappoint-server-uvkv.onrender.com/doctors?search=${encodeURIComponent(
                searchText
            )}`
            : "https://docappoint-server-uvkv.onrender.com/doctors";

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setDoctors(data);
            })
            .catch((error) => {
                console.error(error);
                setDoctors([]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleSearch = () => {
        fetchDoctors(search.trim());
    };

    const handleReset = () => {
        setSearch("");
        fetchDoctors();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-16">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
                All Appointments
            </h1>

            <p className="text-center text-gray-500 mb-10">
                Browse available doctors and book your appointment.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 mb-10">
                <input
                    type="text"
                    placeholder="Search Doctor Name..."
                    className="input input-bordered w-full sm:max-w-md"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <button
                    onClick={handleSearch}
                    className="btn btn-primary"
                >
                    Search
                </button>

                {search && (
                    <button
                        onClick={handleReset}
                        className="btn btn-outline"
                    >
                        Reset
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : doctors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {doctors.map((doctor) => (
                        <DoctorCard
                            key={doctor.id}
                            doctor={doctor}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-center text-red-500 mt-10">
                    No doctor found.
                </p>
            )}
        </div>
    );
};

export default AllAppointments;