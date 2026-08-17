import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import toast from "react-hot-toast";

import { AuthContext } from "../providers/AuthProvider";

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logOut();

            toast.success(
                "Logged out successfully!"
            );

            setMenuOpen(false);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const navLinkClass = ({ isActive }) =>
        isActive
            ? "font-semibold text-primary"
            : "hover:text-primary transition";

    return (
        <nav className="px-4 sm:px-6 py-4 shadow bg-base-100">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center">
                    {/* Logo + Name */}
                    <Link
                        to="/"
                        className="text-2xl font-bold"
                    >
                        DocAppoint
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <NavLink
                            to="/"
                            className={navLinkClass}
                        >
                            Home
                        </NavLink>

                        <NavLink
                            to="/appointments"
                            className={navLinkClass}
                        >
                            All Appointments
                        </NavLink>

                        <NavLink
                            to="/dashboard"
                            className={navLinkClass}
                        >
                            Dashboard
                        </NavLink>
                    </div>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <>
                                <img
                                    src={
                                        user.photoURL ||
                                        "https://i.pravatar.cc/100"
                                    }
                                    alt="Profile"
                                    title={
                                        user.displayName ||
                                        user.email
                                    }
                                    className="w-10 h-10 rounded-full object-cover border"
                                />

                                <button
                                    onClick={handleLogout}
                                    className="btn btn-error btn-sm"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="btn btn-outline btn-sm"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="btn btn-primary btn-sm"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        onClick={() =>
                            setMenuOpen(!menuOpen)
                        }
                        className="btn btn-ghost md:hidden text-xl"
                        aria-label="Toggle navigation menu"
                    >
                        ☰
                    </button>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden mt-4 border-t pt-4">
                        <div className="flex flex-col gap-4">
                            <NavLink
                                to="/"
                                onClick={() =>
                                    setMenuOpen(false)
                                }
                                className={navLinkClass}
                            >
                                Home
                            </NavLink>

                            <NavLink
                                to="/appointments"
                                onClick={() =>
                                    setMenuOpen(false)
                                }
                                className={navLinkClass}
                            >
                                All Appointments
                            </NavLink>

                            <NavLink
                                to="/dashboard"
                                onClick={() =>
                                    setMenuOpen(false)
                                }
                                className={navLinkClass}
                            >
                                Dashboard
                            </NavLink>

                            <div className="border-t pt-4">
                                {user ? (
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={
                                                    user.photoURL ||
                                                    "https://i.pravatar.cc/100"
                                                }
                                                alt="Profile"
                                                className="w-10 h-10 rounded-full object-cover border"
                                            />

                                            <span className="text-sm truncate max-w-36">
                                                {user.displayName ||
                                                    user.email}
                                            </span>
                                        </div>

                                        <button
                                            onClick={
                                                handleLogout
                                            }
                                            className="btn btn-error btn-sm"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-3">
                                        <Link
                                            to="/login"
                                            onClick={() =>
                                                setMenuOpen(
                                                    false
                                                )
                                            }
                                            className="btn btn-outline btn-sm flex-1"
                                        >
                                            Login
                                        </Link>

                                        <Link
                                            to="/register"
                                            onClick={() =>
                                                setMenuOpen(
                                                    false
                                                )
                                            }
                                            className="btn btn-primary btn-sm flex-1"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;