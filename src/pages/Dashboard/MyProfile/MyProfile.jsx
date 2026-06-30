import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../../providers/AuthProvider";

const MyProfile = () => {
    const { user, updateUserProfile } =
        useContext(AuthContext);

    const [name, setName] = useState(
        user?.displayName || ""
    );

    const [photo, setPhoto] = useState(
        user?.photoURL || ""
    );

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        try {
            await updateUserProfile(name, photo);

            toast.success(
                "Profile updated successfully!"
            );

            document
                .getElementById("update_profile_modal")
                .close();
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">
                My Profile
            </h2>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body items-center text-center">
                    <img
                        src={
                            user?.photoURL ||
                            "https://i.pravatar.cc/150"
                        }
                        alt="profile"
                        className="w-28 h-28 rounded-full"
                    />

                    <h3 className="text-2xl font-bold">
                        {user?.displayName || "No Name"}
                    </h3>

                    <p>{user?.email}</p>

                    <button
                        onClick={() =>
                            document
                                .getElementById(
                                    "update_profile_modal"
                                )
                                .showModal()
                        }
                        className="btn btn-primary mt-4"
                    >
                        Update Profile
                    </button>
                </div>
            </div>

            <dialog
                id="update_profile_modal"
                className="modal"
            >
                <div className="modal-box">
                    <h3 className="font-bold text-xl mb-4">
                        Update Profile
                    </h3>

                    <form
                        onSubmit={handleUpdateProfile}
                        className="space-y-4"
                    >
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            placeholder="Name"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            required
                        />

                        <input
                            type="text"
                            className="input input-bordered w-full"
                            placeholder="Photo URL"
                            value={photo}
                            onChange={(e) =>
                                setPhoto(e.target.value)
                            }
                            required
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Save
                            </button>

                            <button
                                type="button"
                                className="btn"
                                onClick={() =>
                                    document
                                        .getElementById(
                                            "update_profile_modal"
                                        )
                                        .close()
                                }
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default MyProfile;