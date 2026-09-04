"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
    authClient,
    useSession,
} from "../lib/auth-client";

const MyProfile = () => {
    const {
        data: session,
        isPending,
    } = useSession();

    const user = session?.user;

    const [name, setName] =
        useState("");

    const [photo, setPhoto] =
        useState("");

    const [updating, setUpdating] =
        useState(false);

    const [modalOpen, setModalOpen] =
        useState(false);

    // Keep form synced with current user
    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setPhoto(user.image || "");
        }
    }, [user]);

    const handleOpenModal = () => {
        setName(user?.name || "");
        setPhoto(user?.image || "");
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        if (updating) {
            return;
        }

        setModalOpen(false);
    };

    const handleUpdateProfile = async (
        event
    ) => {
        event.preventDefault();

        const updatedName =
            name.trim();

        const updatedPhoto =
            photo.trim();

        if (!updatedName) {
            toast.error(
                "Name is required."
            );
            return;
        }

        if (!updatedPhoto) {
            toast.error(
                "Photo URL is required."
            );
            return;
        }

        try {
            setUpdating(true);

            const result =
                await authClient.updateUser(
                    {
                        name: updatedName,
                        image: updatedPhoto,
                    }
                );

            if (result?.error) {
                throw new Error(
                    result.error.message ||
                    "Failed to update profile."
                );
            }

            toast.success(
                "Profile updated successfully!"
            );

            setModalOpen(false);
        } catch (error) {
            console.error(error);

            toast.error(
                error?.message ||
                "Failed to update profile."
            );
        } finally {
            setUpdating(false);
        }
    };

    if (isPending) {
        return (
            <div className="flex justify-center items-center py-20">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-500">
                    Please login to view your
                    profile.
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
                    View and manage your
                    profile information.
                </p>
            </div>

            {/* Profile Card */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body items-center text-center py-10">
                    <img
                        src={
                            user.image ||
                            "https://i.pravatar.cc/150"
                        }
                        alt={
                            user.name
                                ? `${user.name} profile`
                                : "Profile"
                        }
                        className="w-28 h-28 rounded-full object-cover border-4 border-base-200"
                        onError={(event) => {
                            event.currentTarget.src =
                                "https://i.pravatar.cc/150";
                        }}
                    />

                    <h3 className="text-2xl font-bold mt-3">
                        {user.name ||
                            "No Name"}
                    </h3>

                    <p className="text-gray-500 break-all">
                        {user.email}
                    </p>

                    <button
                        type="button"
                        onClick={
                            handleOpenModal
                        }
                        className="btn btn-primary mt-4"
                    >
                        Update Profile
                    </button>
                </div>
            </div>

            {/* Update Profile Modal */}
            {modalOpen && (
                <dialog
                    open
                    className="modal"
                >
                    <div className="modal-box">
                        <h3 className="font-bold text-2xl mb-5">
                            Update Profile
                        </h3>

                        <form
                            onSubmit={
                                handleUpdateProfile
                            }
                            className="space-y-4"
                        >
                            {/* Email */}
                            <div>
                                <label className="label">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    value={
                                        user.email ||
                                        ""
                                    }
                                    readOnly
                                    className="input input-bordered w-full bg-base-200"
                                />
                            </div>

                            {/* Name */}
                            <div>
                                <label className="label">
                                    Name
                                </label>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(
                                        event
                                    ) =>
                                        setName(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Your Name"
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            {/* Photo URL */}
                            <div>
                                <label className="label">
                                    Photo URL
                                </label>

                                <input
                                    type="url"
                                    value={photo}
                                    onChange={(
                                        event
                                    ) =>
                                        setPhoto(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="https://example.com/photo.jpg"
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            <div className="modal-action">
                                <button
                                    type="submit"
                                    disabled={
                                        updating
                                    }
                                    className="btn btn-primary"
                                >
                                    {updating ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleCloseModal
                                    }
                                    disabled={
                                        updating
                                    }
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
                        onClick={
                            handleCloseModal
                        }
                        className="modal-backdrop"
                    />
                </dialog>
            )}
        </div>
    );
};

export default MyProfile;