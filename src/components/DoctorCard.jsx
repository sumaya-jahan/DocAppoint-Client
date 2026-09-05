"use client";

import { useRouter } from "next/navigation";
import { useSession } from "../lib/auth-client";

export default function DoctorCard({ doctor }) {
    const router = useRouter();
    const { data: session, isPending } = useSession();

    const handleViewDetails = () => {
        const detailsPath = `/doctor/${doctor.id}`;

        if (!session?.user) {
            router.push(
                `/login?callbackUrl=${encodeURIComponent(detailsPath)}`
            );
            return;
        }

        router.push(detailsPath);
    };

    return (
        <div className="card bg-base-100 shadow-xl border border-base-200 h-full">
            <figure className="h-64 overflow-hidden">
                <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                />
            </figure>

            <div className="card-body">
                <h2 className="card-title text-xl">
                    {doctor.name}
                </h2>

                <p className="text-primary font-semibold">
                    {doctor.specialty}
                </p>

                <div className="space-y-1 text-sm">
                    <p>
                        <strong>Experience:</strong>{" "}
                        {doctor.experience}
                    </p>

                    <p>
                        <strong>Hospital:</strong>{" "}
                        {doctor.hospital}
                    </p>

                    <p>
                        <strong>Location:</strong>{" "}
                        {doctor.location}
                    </p>

                    <p>
                        <strong>Fee:</strong> ৳{doctor.fee}
                    </p>

                    <p>
                        <strong>Rating:</strong>{" "}
                        ⭐ {doctor.rating}
                    </p>
                </div>

                <div className="card-actions justify-end mt-4">
                    <button
                        type="button"
                        onClick={handleViewDetails}
                        disabled={isPending}
                        className="btn btn-primary"
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
}