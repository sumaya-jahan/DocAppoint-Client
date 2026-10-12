
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_URL } from "../lib/api";

export default function DoctorDetailsContent({ doctorId }) {
    const router = useRouter();

    const [doctor, setDoctor] = useState(null);
    const [related, setRelated] = useState([]);
    const [activeImage, setActiveImage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadDetails() {
            setLoading(true);
            setError("");
            setDoctor(null);
            setRelated([]);
            setActiveImage(0);

            try {
                const response = await fetch(
                    `${API_URL}/doctors/${encodeURIComponent(doctorId)}`
                );

                if (!response.ok) {
                    throw new Error("Could not load doctor details.");
                }

                const data = await response.json();

                if (cancelled) return;
                setDoctor(data);

                // Fetch related doctors from MongoDB via backend
                const relatedResponse = await fetch(`${API_URL}/doctors`);

                if (relatedResponse.ok) {
                    const doctors = await relatedResponse.json();

                    if (!cancelled && Array.isArray(doctors)) {
                        const matches = doctors
                            .filter((item) => item.id !== data.id)
                            .sort((a, b) => {
                                const aMatch =
                                    a.specialty === data.specialty ? 1 : 0;

                                const bMatch =
                                    b.specialty === data.specialty ? 1 : 0;

                                return bMatch - aMatch;
                            })
                            .slice(0, 4);

                        setRelated(matches);
                    }
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message);
                    setDoctor(null);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        if (doctorId) {
            loadDetails();
        } else {
            setError("Doctor ID is missing.");
            setLoading(false);
        }

        return () => {
            cancelled = true;
        };
    }, [doctorId]);

    if (loading) {
        return (
            <main className="max-w-6xl mx-auto p-6">
                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="skeleton h-96 rounded-xl" />

                    <div className="space-y-4">
                        <div className="skeleton h-10 w-3/4" />
                        <div className="skeleton h-20" />
                        <div className="skeleton h-20" />
                    </div>
                </div>
            </main>
        );
    }

    if (error || !doctor) {
        return (
            <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 p-6">
                <h1 className="text-2xl font-bold">
                    Doctor Not Found
                </h1>

                <p>
                    {error || "The requested doctor does not exist."}
                </p>

                <Link
                    href="/appointments"
                    className="btn btn-primary"
                >
                    Explore Doctors
                </Link>
            </main>
        );
    }

    // Images stored in MongoDB, without duplicates
    const images = [
        doctor.image,
        ...(Array.isArray(doctor.images)
            ? doctor.images
            : []),
    ].filter(
        (value, index, array) =>
            typeof value === "string" &&
            /^https?:\/\//.test(value) &&
            array.indexOf(value) === index
    );

    const currentImage = images[activeImage] || images[0];

    return (
        <main className="min-h-screen bg-base-200 px-4 py-10">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Doctor Details Card */}
                <div className="card lg:card-side bg-base-100 shadow-xl overflow-hidden">
                    {/* Image Gallery */}
                    <div className="lg:w-2/5 p-4 space-y-3">
                        <div className="rounded-xl overflow-hidden bg-base-200">
                            {currentImage ? (
                                <img
                                    src={currentImage}
                                    alt={`${doctor.name} gallery image ${activeImage + 1
                                        }`}
                                    className="w-full h-[350px] lg:h-[450px] object-cover"
                                />
                            ) : (
                                <div className="h-[350px] flex items-center justify-center">
                                    No photograph available
                                </div>
                            )}
                        </div>

                        {images.length > 1 && (
                            <>
                                {/* Thumbnails */}
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {images.map((image, index) => (
                                        <button
                                            key={image}
                                            type="button"
                                            onClick={() =>
                                                setActiveImage(index)
                                            }
                                            aria-label={`View image ${index + 1}`}
                                            aria-pressed={
                                                activeImage === index
                                            }
                                            className={`rounded-xl overflow-hidden border-2 shrink-0 ${activeImage === index
                                                    ? "border-primary"
                                                    : "border-base-300"
                                                }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${doctor.name} thumbnail ${index + 1
                                                    }`}
                                                loading="lazy"
                                                className="w-20 h-20 object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>

                                {/* Gallery Controls */}
                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline"
                                        onClick={() =>
                                            setActiveImage(
                                                (activeImage -
                                                    1 +
                                                    images.length) %
                                                images.length
                                            )
                                        }
                                    >
                                        Previous
                                    </button>

                                    <span className="text-sm">
                                        {activeImage + 1} / {images.length}
                                    </span>

                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline"
                                        onClick={() =>
                                            setActiveImage(
                                                (activeImage + 1) %
                                                images.length
                                            )
                                        }
                                    >
                                        Next
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Doctor Information */}
                    <div className="card-body lg:w-3/5">
                        <p className="text-primary font-semibold">
                            {doctor.specialty}
                        </p>

                        <h1 className="text-3xl md:text-4xl font-bold">
                            {doctor.name}
                        </h1>

                        <div className="grid sm:grid-cols-2 gap-4 mt-4">
                            <div className="bg-base-200 rounded-xl p-4">
                                <p className="text-sm opacity-70">
                                    Experience
                                </p>

                                <strong>
                                    {doctor.experience
                                        ? String(doctor.experience).toLowerCase().includes(
                                            "year"
                                        )
                                            ? doctor.experience
                                            : `${doctor.experience} Years`
                                        : "Not available"}
                                </strong>
                            </div>

                            <div className="bg-base-200 rounded-xl p-4">
                                <p className="text-sm opacity-70">
                                    Rating
                                </p>

                                <strong>
                                    {doctor.rating != null
                                        ? `⭐ ${doctor.rating}`
                                        : "Not rated"}
                                </strong>
                            </div>

                            <div className="bg-base-200 rounded-xl p-4">
                                <p className="text-sm opacity-70">
                                    Consultation Fee
                                </p>

                                <strong>৳{doctor.fee}</strong>
                            </div>

                            <div className="bg-base-200 rounded-xl p-4">
                                <p className="text-sm opacity-70">
                                    Availability
                                </p>

                                <strong>
                                    {Array.isArray(doctor.availability)
                                        ? doctor.availability.join(", ")
                                        : doctor.availability ||
                                        "Not available"}
                                </strong>
                            </div>
                        </div>

                        <div className="space-y-3 mt-4">
                            {doctor.hospital && (
                                <p>
                                    <strong>Hospital:</strong>{" "}
                                    {doctor.hospital}
                                </p>
                            )}

                            <p>
                                <strong>Location:</strong>{" "}
                                {doctor.location ||
                                    "Not available"}
                            </p>

                            {doctor.qualification && (
                                <p>
                                    <strong>Qualification:</strong>{" "}
                                    {doctor.qualification}
                                </p>
                            )}

                            {doctor.description && (
                                <section>
                                    <h2 className="font-bold text-xl mb-2">
                                        About Doctor
                                    </h2>

                                    <p className="opacity-80 leading-relaxed">
                                        {doctor.description}
                                    </p>
                                </section>
                            )}
                        </div>

                        <div className="card-actions mt-6">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() =>
                                    router.push(
                                        `/book/${doctor.id}`
                                    )
                                }
                            >
                                Book Appointment
                            </button>

                            <Link
                                href="/appointments"
                                className="btn btn-outline"
                            >
                                Back
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Related Doctors */}
                {related.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold mb-2">
                            Related Doctors
                        </h2>

                        <p className="text-base-content/70 mb-5">
                            Explore other doctors available on
                            DocAppoint.
                        </p>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {related.map((item) => (
                                <article
                                    key={item.id}
                                    className="card bg-base-100 shadow-md overflow-hidden h-full"
                                >
                                    {item.image && (
                                        <figure>
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                loading="lazy"
                                                className="w-full h-48 object-cover"
                                            />
                                        </figure>
                                    )}

                                    <div className="card-body p-4">
                                        <h3 className="font-bold text-lg">
                                            {item.name}
                                        </h3>

                                        <p className="text-sm text-primary">
                                            {item.specialty}
                                        </p>

                                        <p className="text-sm">
                                            {item.location}
                                        </p>

                                        <p className="text-sm">
                                            Fee: ৳{item.fee}
                                        </p>

                                        {item.rating != null && (
                                            <p className="text-sm">
                                                ⭐ {item.rating}
                                            </p>
                                        )}

                                        <Link
                                            href={`/doctor/${item.id}`}
                                            className="btn btn-primary btn-sm mt-auto"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                {/* Real Reviews, if available */}
                {Array.isArray(doctor.reviews) &&
                    doctor.reviews.length > 0 && (
                        <section className="bg-base-100 rounded-xl p-6">
                            <h2 className="text-2xl font-bold mb-4">
                                Patient Reviews
                            </h2>

                            <div className="space-y-4">
                                {doctor.reviews.map(
                                    (review, index) => (
                                        <div
                                            key={review.id || index}
                                            className="border-b border-base-300 pb-4"
                                        >
                                            {review.name && (
                                                <p className="font-semibold">
                                                    {review.name}
                                                </p>
                                            )}

                                            {review.rating != null && (
                                                <p>
                                                    ⭐ {review.rating}/5
                                                </p>
                                            )}

                                            <p className="mt-1">
                                                {review.comment}
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                        </section>
                    )}
            </div>
        </main>
    );
}
