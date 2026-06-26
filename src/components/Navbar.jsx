import { useContext } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { AuthContext } from "../providers/AuthProvider";

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext);

    const handleLogout = () => {
        logOut()
            .then(() => {
                toast.success("Logged out successfully!");
            })
            .catch((error) => {
                toast.error(error.message);
            });
    };

    return (
        <nav className="px-6 py-4 shadow">
            <div className="max-w-7xl mx-auto flex justify-between items-center">

                <Link
                    to="/"
                    className="text-2xl font-bold"
                >
                    DocAppoint
                </Link>

                <div className="space-x-4">
                    <Link to="/">Home</Link>

                    <Link to="/appointments">
                        All Appointments
                    </Link>

                    <Link to="/dashboard">
                        Dashboard
                    </Link>
                </div>

                <div className="flex items-center gap-3">

                    {user ? (
                        <>
                            <img
                                src={
                                    user.photoURL ||
                                    "https://i.pravatar.cc/100"
                                }
                                alt="Profile"
                                title={user.displayName}
                                className="w-10 h-10 rounded-full border"
                            />

                            <button
                                onClick={handleLogout}
                                className="btn btn-error"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <button className="btn btn-outline">
                                    Login
                                </button>
                            </Link>

                            <Link to="/register">
                                <button className="btn btn-primary">
                                    Register
                                </button>
                            </Link>
                        </>
                    )}

                </div>

            </div>
        </nav>
    );
};

export default Navbar;