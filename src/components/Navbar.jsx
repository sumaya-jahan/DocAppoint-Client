"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

import {
    signOut,
    useSession,
} from "../lib/auth-client";

import logo from "../assets/logo.png";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] =
        useState(false);

    const {
        data: session,
        isPending,
    } = useSession();

    const user = session?.user;

    const handleLogout = async () => {
        try {
            const result = await signOut();

            if (result?.error) {
                toast.error(
                    result.error.message ||
                    "Logout failed"
                );
                return;
            }

            toast.success(
                "Logged out successfully!"
            );

            setMenuOpen(false);
        } catch (error) {
            toast.error(
                error?.message ||
                "Logout failed"
            );
        }
    };

    const navLinkClass = (path) => {
        const isActive =
            path === "/"
                ? pathname === "/"
                : pathname.startsWith(path);

        return isActive
            ? "font-semibold text-primary"
            : "hover:text-primary transition";
    };

    return (
        <nav className="sticky top-0 z-50 px-4 sm:px-6 py-3 shadow bg-base-100">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center">
                    {/* Logo + Name */}
                    <Link
                        href="/"
                        className="flex items-center gap-2"
                    >
                        <Image
                            src={logo}
                            alt="DocAppoint Logo"
                            width={48}
                            height={48}
                            className="w-12 h-12 object-contain rounded-lg"
                            priority
                        />

                        <span className="text-2xl font-bold">
                            DocAppoint
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href="/"
                            className={navLinkClass(
                                "/"
                            )}
                        >
                            Home
                        </Link>

                        <Link
                            href="/appointments"
                            className={navLinkClass(
                                "/appointments"
                            )}
                        >
                            All Appointments
                        </Link>

                        <Link
                            href="/dashboard"
                            className={navLinkClass(
                                "/dashboard"
                            )}
                        >
                            Dashboard
                        </Link>
                    </div>

                    {user && <Link href="/admin" className="hidden lg:inline-flex text-sm hover:text-primary">Admin</Link>}
                    <ThemeToggle />
                    <div className="hidden lg:flex gap-4 text-sm"><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link></div>
                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center gap-3">
                        {isPending ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : user ? (
                            <>
                                <img
                                    src={
                                        user.image ||
                                        "/favicon.svg"
                                    }
                                    alt="Profile"
                                    title={
                                        user.name ||
                                        user.email
                                    }
                                    className="w-10 h-10 rounded-full object-cover border"
                                />

                                <button
                                    type="button"
                                    onClick={
                                        handleLogout
                                    }
                                    className="btn btn-error btn-sm"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="btn btn-outline btn-sm"
                                >
                                    Login
                                </Link>

                                <Link
                                    href="/register"
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
                            setMenuOpen(
                                !menuOpen
                            )
                        }
                        className="btn btn-ghost md:hidden text-2xl"
                        aria-label="Toggle navigation menu"
                    >
                        ☰
                    </button>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden mt-4 border-t pt-4">
                        <div className="flex flex-col gap-4">
                            <Link
                                href="/"
                                onClick={() =>
                                    setMenuOpen(
                                        false
                                    )
                                }
                                className={navLinkClass(
                                    "/"
                                )}
                            >
                                Home
                            </Link>

                            <Link
                                href="/appointments"
                                onClick={() =>
                                    setMenuOpen(
                                        false
                                    )
                                }
                                className={navLinkClass(
                                    "/appointments"
                                )}
                            >
                                All Appointments
                            </Link>

                            <Link
                                href="/dashboard"
                                onClick={() =>
                                    setMenuOpen(
                                        false
                                    )
                                }
                                className={navLinkClass(
                                    "/dashboard"
                                )}
                            >
                                Dashboard
                            </Link>

                            <Link href="/about" onClick={()=>setMenuOpen(false)}>About</Link><Link href="/contact" onClick={()=>setMenuOpen(false)}>Contact</Link><Link href="/help" onClick={()=>setMenuOpen(false)}>Help</Link>{user&&<Link href="/admin" onClick={()=>setMenuOpen(false)}>Admin</Link>}
                            <div className="border-t pt-4">
                                {isPending ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : user ? (
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={
                                                    user.image ||
                                                    "/favicon.svg"
                                                }
                                                alt="Profile"
                                                className="w-10 h-10 rounded-full object-cover border"
                                            />

                                            <span className="text-sm truncate max-w-36">
                                                {user.name ||
                                                    user.email}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
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
                                            href="/login"
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
                                            href="/register"
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