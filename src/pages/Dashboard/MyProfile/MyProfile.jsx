import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../../providers/AuthProvider";

const MyProfile = () => {
    const { user, updateUserProfile } =
        useContext(AuthContext);

    const [name, setName] = useState("");
    const [photo, setPhoto] = useState("");
    const [updating, setUpdating] = useState(false);

    // Keep form data synced with logged-in user
    useEffect(() => {
        if (user) {
            setName(user.displayName || "");
            setPhoto(user.photoURL || "");
        }
    }, [user]);

    const handleOpenModal = () => {
        setName(user?.displayName || "");
        setPhoto(user?.photoURL || "");

        document
            .getElementById("update_profile_modal")
            ?.showModal();
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        try {
            setUpdating(true);

            await updateUserProfile(
                name.trim(),
                photo.trim()
            );

            toast.success(
                "Profile updated successfully!"
            );

            document
                .getElementById("update_profile_modal")
                ?.close();
        } catch (error) {
            console.error(error);

            toast.error(
                error.message ||
                "Failed to update profile."
            );
        } finally {
            setUpdating(false);
        }
    };

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

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body items-center text-center py-10">
                    <img
                        src={
                            user?.photoURL ||
                            "https://i.pravatar.cc/150"
                        }
                        alt={
                            user?.displayName
                                ? `${user.displayName} profile`
                                : "Profile"
                        }
                        className="w-28 h-28 rounded-full object-cover border-4 border-base-200"
                        onError={(e) => {
                            e.currentTarget.src =
                                "https://i.pravatar.cc/150";
                        }}
                    />

                    <h3 className="text-2xl font-bold mt-3">
                        {user?.displayName || "No Name"}
                    </h3>

                    <p className="text-gray-500 break-all">
                        {user?.email}
                    </p>

                    <button
                        onClick={handleOpenModal}
                        className="btn btn-primary mt-4"
                    >
                        Update Profile
                    </button>
                </div>
            </div>

            {/* Update Profile Modal */}
            <dialog
                id="update_profile_modal"
                className="modal"
            >
                <div className="modal-box">
                    <h3 className="font-bold text-2xl mb-5">
                        Update Profile
                    </h3>

                    <form
                        onSubmit={handleUpdateProfile}
                        className="space-y-4"
                    >
                        {/* Email - Read Only */}
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Email Address
                                </span>
                            </label>

                            <input
                                type="email"
                                value={user?.email || ""}
                                readOnly
                                className="input input-bordered w-full bg-base-200"
                            />
                        </div>

                        {/* Name */}
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Name
                                </span>
                            </label>

                            <input
                                type="text"
                                className="input input-bordered w-full"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                required
                            />
                        </div>

                        {/* Photo URL */}
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Photo URL
                                </span>
                            </label>

                            <input
                                type="url"
                                className="input input-bordered w-full"
                                placeholder="https://example.com/photo.jpg"
                                value={photo}
                                onChange={(e) =>
                                    setPhoto(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="modal-action">
                            <button
                                type="submit"
                                disabled={updating}
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
                                className="btn"
                                disabled={updating}
                                onClick={() =>
                                    document
                                        .getElementById(
                                            "update_profile_modal"
                                        )
                                        ?.close()
                                }
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                <form
                    method="dialog"
                    className="modal-backdrop"
                >
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default MyProfile;