import { Link } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
    return (
        <div className="card bg-base-100 shadow-xl">
            <figure className="p-4">
                <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-40 h-40 rounded-full object-cover"
                />
            </figure>

            <div className="card-body text-center">
                <h2 className="card-title justify-center">
                    {doctor.name}
                </h2>

                <p>{doctor.specialty}</p>
                <p>Experience: {doctor.experience}</p>
                <p>Fee: ৳{doctor.fee}</p>

                <Link to={`/doctor/${doctor.id}`}>
                    <button className="btn btn-primary mt-3">
                        View Details
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default DoctorCard;