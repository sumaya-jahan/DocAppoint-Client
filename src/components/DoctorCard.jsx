import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

const DoctorCard = ({ doctor }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleViewDetails = () => {
        if (user) {
            navigate(`/doctor/${doctor.id}`);
        } else {
            navigate("/login", {
                state: {
                    from: {
                        pathname: `/doctor/${doctor.id}`,
                    },
                    previous: location.pathname,
                },
            });
        }
    };

    return (
        <div className="card bg-base-100 shadow-xl h-full">
            <figure className="p-4">
                <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-40 h-40 rounded-full object-cover"
                />
            </figure>

            <div className="card-body text-center flex flex-col">
                <h2 className="card-title justify-center">
                    {doctor.name}
                </h2>

                <p>{doctor.specialty}</p>
                <p>Experience: {doctor.experience}</p>
                <p>Fee: ৳{doctor.fee}</p>

                <div className="mt-auto">
                    <button
                        onClick={handleViewDetails}
                        className="btn btn-primary mt-3"
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DoctorCard;