
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient, useSession } from "../lib/auth-client";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const fallbackImage = "https://i.pravatar.cc/150";

export default function MyProfile() {
    const { data: session, isPending, refetch } = useSession();
    const user = session?.user;

    const [name, setName] = useState("");
    const [photo, setPhoto] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [updating, setUpdating] = useState(false);

    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setPhoto(user.image || "");
        }
    }, [user?.id, user?.name, user?.image]);

    useEffect(() => {
        if (!selectedFile) {
            setPreview("");
            return;
        }

        const objectURL = URL.createObjectURL(selectedFile);
        setPreview(objectURL);

        return () => URL.revokeObjectURL(objectURL);
    }, [selectedFile]);

    function openProfileModal() {
        setName(user?.name || "");
        setPhoto(user?.image || "");
        setSelectedFile(null);
        setModalOpen(true);
    }

    function closeProfileModal() {
        if (updating) return;

        setModalOpen(false);
        setSelectedFile(null);
    }

    function handleFileChange(event) {
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
            toast.error("Only JPG, PNG and WebP images are allowed.");
            event.target.value = "";
            setSelectedFile(null);
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be smaller than 2 MB.");
            event.target.value = "";
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
    }

    async function handleUpdateProfile(event) {
        event.preventDefault();

        if (updating) return;

        const updatedName = name.trim();
        const photoURL = photo.trim();

        if (updatedName.length < 2 || updatedName.length > 100) {
            toast.error("Name must contain 2 to 100 characters.");
            return;
        }

        if (!selectedFile && photoURL) {
            try {
                const url = new URL(photoURL);

                if (url.protocol !== "https:") {
                    throw new Error("Invalid protocol");
                }
            } catch {
                toast.error("Please enter a valid HTTPS photo URL.");
                return;
            }
        }

        setUpdating(true);

        try {
            let updatedPhoto = photoURL;

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

                const result = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(
                        result.message || "Image upload failed."
                    );
                }

                if (!result.imageUrl) {
                    throw new Error("Image URL was not returned.");
                }

                updatedPhoto = result.imageUrl;
            }

            const result = await authClient.updateUser({
                name: updatedName,
                image: updatedPhoto || null,
            });

            if (result?.error) {
                throw new Error(
                    result.error.message || "Failed to update profile."
                );
            }

            setName(updatedName);
            setPhoto(updatedPhoto);
            setSelectedFile(null);
            setModalOpen(false);

            await refetch?.();

            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Profile update failed:", error);
            toast.error(
                error?.message || "Failed to update profile."
            );
        } finally {
            setUpdating(false);
        }
    }

    function openPasswordModal() {
        setPasswords({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

        setPasswordError("");
        setShowPassword(false);
        setPasswordModalOpen(true);
    }

    function closePasswordModal() {
        if (changingPassword) return;

        setPasswordModalOpen(false);
        setPasswordError("");

        setPasswords({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
    }

    function updatePasswordField(field, value) {
        setPasswords((previous) => ({
            ...previous,
            [field]: value,
        }));

        setPasswordError("");
    }

    async function handleChangePassword(event) {
        event.preventDefault();

        if (changingPassword) return;

        const {
            currentPassword,
            newPassword,
            confirmPassword,
        } = passwords;

        if (!currentPassword) {
            setPasswordError("Current password is required.");
            return;
        }

        if (newPassword.length < 8) {
            setPasswordError(
                "New password must contain at least 8 characters."
            );
            return;
        }

        if (newPassword.length > 128) {
            setPasswordError(
                "New password must not exceed 128 characters."
            );
            return;
        }

        if (newPassword === currentPassword) {
            setPasswordError(
                "New password must be different from your current password."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError(
                "New password and confirm password do not match."
            );
            return;
        }

        setChangingPassword(true);
        setPasswordError("");

        try {
            const result = await authClient.changePassword({
                currentPassword,
                newPassword,
                revokeOtherSessions: true,
            });

            if (result?.error) {
                throw new Error(
                    result.error.message ||
                    "Failed to change password."
                );
            }

            setPasswords({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

            setPasswordModalOpen(false);

            toast.success("Password changed successfully!");
        } catch (error) {
            console.error("Password change failed:", error);

            setPasswordError(
                error?.message || "Could not change password."
            );
        } finally {
            setChangingPassword(false);
        }
    }

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
                <p className="text-base-content/70">
                    Please login to view your profile.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h2 className="text-3xl md:text-4xl font-bold">
                    My Profile
                </h2>

                <p className="text-base-content/70 mt-2">
                    View and manage your account information.
                </p>
            </div>

            {/* Profile Information */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body items-center text-center py-10">
                    <img
                        src={user.image || fallbackImage}
                        alt={`${user.name || "User"} profile`}
                        className="w-28 h-28 rounded-full object-cover border-4 border-base-200"
                        onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = fallbackImage;
                        }}
                    />

                    <h3 className="text-2xl font-bold mt-3">
                        {user.name || "No Name"}
                    </h3>

                    <p className="text-base-content/70 break-all">
                        {user.email}
                    </p>

                    <button
                        type="button"
                        className="btn btn-primary mt-4"
                        onClick={openProfileModal}
                    >
                        Update Profile
                    </button>
                </div>
            </div>

            {/* Password & Security */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h3 className="card-title">
                        Password & Security
                    </h3>

                    <p className="text-base-content/70">
                        Keep your account secure by using a strong password.
                    </p>

                    <div className="card-actions justify-start mt-4">
                        <button
                            type="button"
                            className="btn btn-outline btn-primary"
                            onClick={openPasswordModal}
                        >
                            Change Password
                        </button>
                    </div>
                </div>
            </div>

            {/* Profile Update Modal */}
            {modalOpen && (
                <dialog open className="modal">
                    <div className="modal-box max-w-lg">
                        <h3 className="font-bold text-2xl mb-5">
                            Update Profile
                        </h3>

                        <form
                            onSubmit={handleUpdateProfile}
                            className="space-y-4"
                        >
                            <div>
                                <label
                                    htmlFor="profile-email"
                                    className="label"
                                >
                                    Email Address
                                </label>

                                <input
                                    id="profile-email"
                                    type="email"
                                    value={user.email || ""}
                                    readOnly
                                    className="input input-bordered w-full bg-base-200"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="profile-name"
                                    className="label"
                                >
                                    Full Name
                                </label>

                                <input
                                    id="profile-name"
                                    type="text"
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    minLength={2}
                                    maxLength={100}
                                    required
                                    className="input input-bordered w-full"
                                    placeholder="Your Name"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="profile-file"
                                    className="label"
                                >
                                    Upload Profile Photo
                                </label>

                                <input
                                    id="profile-file"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleFileChange}
                                    className="file-input file-input-bordered w-full"
                                />

                                <p className="text-xs text-base-content/70 mt-1">
                                    JPG, PNG or WebP. Maximum 2 MB.
                                </p>

                                {(preview || photo) && (
                                    <img
                                        src={preview || photo}
                                        alt="Profile preview"
                                        className="w-20 h-20 rounded-full object-cover mt-3"
                                    />
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="profile-url"
                                    className="label"
                                >
                                    Or Use Photo URL
                                </label>

                                <input
                                    id="profile-url"
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

                            <div className="modal-action">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={updating}
                                >
                                    {updating ? "Saving..." : "Save Changes"}
                                </button>

                                <button
                                    type="button"
                                    className="btn"
                                    disabled={updating}
                                    onClick={closeProfileModal}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>

                    <button
                        type="button"
                        className="modal-backdrop"
                        aria-label="Close profile modal"
                        onClick={closeProfileModal}
                    />
                </dialog>
            )}

            {/* Password Change Modal */}
            {passwordModalOpen && (
                <dialog open className="modal">
                    <div className="modal-box max-w-lg">
                        <h3 className="font-bold text-2xl mb-2">
                            Change Password
                        </h3>

                        <p className="text-sm text-base-content/70 mb-5">
                            Enter your current password and choose a new one.
                        </p>

                        {passwordError && (
                            <div
                                role="alert"
                                className="alert alert-error mb-4 text-sm"
                            >
                                {passwordError}
                            </div>
                        )}

                        <form
                            onSubmit={handleChangePassword}
                            className="space-y-4"
                        >
                            <div>
                                <label
                                    htmlFor="current-password"
                                    className="label"
                                >
                                    Current Password
                                </label>

                                <input
                                    id="current-password"
                                    type={showPassword ? "text" : "password"}
                                    className="input input-bordered w-full"
                                    value={passwords.currentPassword}
                                    onChange={(event) =>
                                        updatePasswordField(
                                            "currentPassword",
                                            event.target.value
                                        )
                                    }
                                    autoComplete="current-password"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="new-password"
                                    className="label"
                                >
                                    New Password
                                </label>

                                <input
                                    id="new-password"
                                    type={showPassword ? "text" : "password"}
                                    className="input input-bordered w-full"
                                    value={passwords.newPassword}
                                    onChange={(event) =>
                                        updatePasswordField(
                                            "newPassword",
                                            event.target.value
                                        )
                                    }
                                    autoComplete="new-password"
                                    minLength={8}
                                    maxLength={128}
                                    required
                                />

                                <p className="text-xs text-base-content/70 mt-1">
                                    Minimum 8 characters.
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="confirm-password"
                                    className="label"
                                >
                                    Confirm New Password
                                </label>

                                <input
                                    id="confirm-password"
                                    type={showPassword ? "text" : "password"}
                                    className="input input-bordered w-full"
                                    value={passwords.confirmPassword}
                                    onChange={(event) =>
                                        updatePasswordField(
                                            "confirmPassword",
                                            event.target.value
                                        )
                                    }
                                    autoComplete="new-password"
                                    required
                                />
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-sm"
                                    checked={showPassword}
                                    onChange={(event) =>
                                        setShowPassword(event.target.checked)
                                    }
                                />

                                <span className="text-sm">
                                    Show passwords
                                </span>
                            </label>

                            <div className="modal-action">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={changingPassword}
                                >
                                    {changingPassword
                                        ? "Changing..."
                                        : "Change Password"}
                                </button>

                                <button
                                    type="button"
                                    className="btn"
                                    disabled={changingPassword}
                                    onClick={closePasswordModal}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>

                    <button
                        type="button"
                        className="modal-backdrop"
                        aria-label="Close password modal"
                        onClick={closePasswordModal}
                    />
                </dialog>
            )}
        </div>
    );
}
