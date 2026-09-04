"use client";

import { useRouter } from "next/navigation";

import { useSession } from "../lib/auth-client";

const DoctorCard = ({ doctor }) => {
    const router = useRouter();

    const {
        data: session,
        isPending,
    } = useSession();

    const user = session?.user;

    const handleViewDetails = () => {
        const doctorPath = `/doctor/${doctor.id}`;

        if (user) {
            router.push(doctorPath);
            return;
        }

        router.push(
            `/login?callbackUrl=${encodeURIComponent(
                doctorPath
            )}`
        );
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

                <p>
                    Experience:{" "}
                    {doctor.experience}
                </p>

                <p>
                    Fee: ৳{doctor.fee}
                </p>

                <div className="mt-auto">
                    <button
                        type="button"
                        onClick={
                            handleViewDetails
                        }
                        disabled={isPending}
                        className="btn btn-primary mt-3"
                    >
                        {isPending ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            "View Details"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DoctorCard;