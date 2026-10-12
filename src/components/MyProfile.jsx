
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient, useSession } from "../lib/auth-client";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const MyProfile = () => {
    const { data: session, isPending } = useSession();
    const user = session?.user;

    const [name, setName] = useState("");
    const [photo, setPhoto] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [updating, setUpdating] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setPhoto(user.image || "");
        }
    }, [user]);

    useEffect(() => {
        if (!selectedFile) {
            setPreview("");
            return;
        }

        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    const handleOpenModal = () => {
        setName(user?.name || "");
        setPhoto(user?.image || "");
        setSelectedFile(null);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        if (updating) return;
        setModalOpen(false);
        setSelectedFile(null);
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            setSelectedFile(null);
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            toast.error("Only JPG, PNG and WebP images allowed.");
            event.target.value = "";
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be smaller than 2 MB.");
            event.target.value = "";
            return;
        }

        setSelectedFile(file);
    };

    const handleUpdateProfile = async (event) => {
        event.preventDefault();

        const updatedName = name.trim();

        if (!updatedName) {
            toast.error("Name is required.");
            return;
        }

        try {
            setUpdating(true);

            let updatedPhoto = photo.trim();

            // Upload image from computer to Cloudinary
            if (selectedFile) {
                const formData = new FormData();
                formData.append("image", selectedFile);

                const response = await fetch(
                    `${API_URL}/api/upload/profile-image`,
                    {
                        method: "POST",
                        credentials: "include",
                        body: formData,
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || "Image upload failed."
                    );
                }

                updatedPhoto = result.imageUrl;
            }

            // Save name and uploaded photo URL in Better Auth
            const result = await authClient.updateUser({
                name: updatedName,
                image: updatedPhoto || null,
            });

            if (result?.error) {
                throw new Error(
                    result.error.message || "Failed to update profile."
                );
            }

            setPhoto(updatedPhoto);
            setSelectedFile(null);
            setModalOpen(false);
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error(error);
            toast.error(
                error?.message || "Failed to update profile."
            );
        } finally {
            setUpdating(false);
        }
    };

    if (isPending) {
        return (
            <div className="flex justify-center items-center py-20">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-500">
                    Please login to view your profile.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold">
                    My Profile
                </h2>
                <p className="text-gray-500 mt-2">
                    View and manage your profile information.
                </p>
            </div>

            {/* Profile Card */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body items-center text-center py-10">
                    <img
                        src={user.image || "https://i.pravatar.cc/150"}
                        alt={`${user.name || "User"} profile`}
                        className="w-28 h-28 rounded-full object-cover border-4 border-base-200"
                        onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src =
                                "https://i.pravatar.cc/150";
                        }}
                    />

                    <h3 className="text-2xl font-bold mt-3">
                        {user.name || "No Name"}
                    </h3>

                    <p className="text-gray-500 break-all">
                        {user.email}
                    </p>

                    <button
                        type="button"
                        onClick={handleOpenModal}
                        className="btn btn-primary mt-4"
                    >
                        Update Profile
                    </button>
                </div>
            </div>

            {/* Update Profile Modal */}
            {modalOpen && (
                <dialog open className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-2xl mb-5">
                            Update Profile
                        </h3>

                        <form
                            onSubmit={handleUpdateProfile}
                            className="space-y-4"
                        >
                            {/* Email */}
                            <div>
                                <label className="label">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={user.email || ""}
                                    readOnly
                                    className="input input-bordered w-full bg-base-200"
                                />
                            </div>

                            {/* Name */}
                            <div>
                                <label className="label">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    placeholder="Your Name"
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            {/* Profile Image Upload */}
                            <div>
                                <label className="label">
                                    Upload Profile Photo
                                </label>

                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleFileChange}
                                    className="file-input file-input-bordered w-full"
                                />

                                <p className="text-xs text-gray-500 mt-1">
                                    JPG, PNG or WebP. Maximum 2 MB.
                                </p>

                                {(preview || photo) && (
                                    <img
                                        src={preview || photo}
                                        alt="Profile photo preview"
                                        className="w-20 h-20 mt-3 rounded-full object-cover"
                                    />
                                )}
                            </div>

                            {/* Optional Photo URL */}
                            <div>
                                <label className="label">
                                    Or Use Photo URL
                                </label>

                                <input
                                    type="url"
                                    value={photo}
                                    onChange={(event) => {
                                        setPhoto(event.target.value);
                                        setSelectedFile(null);
                                    }}
                                    placeholder="https://example.com/photo.jpg"
                                    className="input input-bordered w-full"
                                />
                            </div>

                            {/* Actions */}
                            <div className="modal-action">
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="btn btn-primary"
                                >
                                    {updating ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    disabled={updating}
                                    className="btn"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>

                    <button
                        type="button"
                        aria-label="Close profile modal"
                        onClick={handleCloseModal}
                        className="modal-backdrop"
                    />
                </dialog>
            )}
        </div>
    );
};

export default MyProfile;
