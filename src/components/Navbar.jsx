
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

import { signOut, useSession } from "../lib/auth-client";
import { API_URL } from "../lib/api";

import logo from "../assets/logo.png";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
    const pathname = usePathname();

    const [menuOpen, setMenuOpen] = useState(false);
    const [role, setRole] = useState(null);

    const { data: session, isPending } = useSession();
    const user = session?.user;

    // Load the role from the protected backend endpoint.
    useEffect(() => {
        if (!user?.id) {
            return;
        }

        let active = true;

        async function loadRole() {
            try {
                const response = await fetch(
                    `${API_URL}/api/me/role`,
                    {
                        credentials: "include",
                        cache: "no-store",
                    }
                );

                if (!response.ok) {
                    throw new Error("Unable to verify role");
                }

                const data = await response.json();

                if (active) {
                    setRole(
                        data.role === "admin" ? "admin" : "user"
                    );
                }
            } catch {
                if (active) {
                    setRole("user");
                }
            }
        }

        loadRole();

        return () => {
            active = false;
        };
    }, [user?.id]);

    const isAdmin = Boolean(user && role === "admin");

    async function handleLogout() {
        try {
            const result = await signOut();

            if (result?.error) {
                toast.error(
                    result.error.message || "Logout failed"
                );
                return;
            }

            setRole(null);
            setMenuOpen(false);

            toast.success("Logged out successfully!");
        } catch (error) {
            toast.error(
                error?.message || "Logout failed"
            );
        }
    }

    function navLinkClass(path) {
        const active =
            path === "/"
                ? pathname === "/"
                : pathname.startsWith(path);

        return active
            ? "font-semibold text-primary"
            : "hover:text-primary transition";
    }

    function closeMenu() {
        setMenuOpen(false);
    }

    return (
        <nav className="sticky top-0 z-50 px-4 sm:px-6 py-3 shadow bg-base-100">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center gap-3">
                    <Link
                        href="/"
                        className="flex items-center gap-2 min-w-0"
                        onClick={closeMenu}
                    >
                        <Image
                            src={logo}
                            alt="DocAppoint Logo"
                            width={48}
                            height={48}
                            className="w-12 h-12 object-contain rounded-lg"
                            priority
                        />

                        <span className="text-xl sm:text-2xl font-bold truncate">
                            DocAppoint
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href="/"
                            className={navLinkClass("/")}
                        >
                            Home
                        </Link>

                        <Link
                            href="/appointments"
                            className={navLinkClass("/appointments")}
                        >
                            All Appointments
                        </Link>

                        <Link
                            href="/dashboard"
                            className={navLinkClass("/dashboard")}
                        >
                            Dashboard
                        </Link>
                    </div>

                    {/* Admin link is only shown to verified admins */}
                    {isAdmin && (
                        <Link
                            href="/admin"
                            className="hidden lg:inline-flex text-sm hover:text-primary"
                        >
                            Admin
                        </Link>
                    )}

                    <ThemeToggle />

                    <div className="hidden lg:flex gap-4 text-sm">
                        <Link href="/about">About</Link>
                        <Link href="/contact">Contact</Link>
                        <Link href="/privacy">Privacy</Link>
                    </div>

                    {/* Desktop Authentication */}
                    <div className="hidden md:flex items-center gap-3">
                        {isPending ? (
                            <span
                                className="loading loading-spinner loading-sm"
                                aria-label="Checking login"
                            />
                        ) : user ? (
                            <>
                                <img
                                    src={user.image || "/favicon.svg"}
                                    alt="Profile"
                                    title={user.name || user.email}
                                    className="w-10 h-10 rounded-full object-cover border"
                                />

                                <button
                                    type="button"
                                    onClick={handleLogout}
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

                    {/* Mobile Navigation Button */}
                    <button
                        type="button"
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="btn btn-ghost md:hidden text-2xl"
                        aria-label="Toggle navigation menu"
                        aria-expanded={menuOpen}
                        aria-controls="mobile-navigation"
                    >
                        ☰
                    </button>
                </div>

                {/* Mobile Navigation */}
                {menuOpen && (
                    <div
                        id="mobile-navigation"
                        className="md:hidden mt-4 border-t pt-4"
                    >
                        <div className="flex flex-col gap-4">
                            <Link
                                href="/"
                                onClick={closeMenu}
                                className={navLinkClass("/")}
                            >
                                Home
                            </Link>

                            <Link
                                href="/appointments"
                                onClick={closeMenu}
                                className={navLinkClass("/appointments")}
                            >
                                All Appointments
                            </Link>

                            <Link
                                href="/dashboard"
                                onClick={closeMenu}
                                className={navLinkClass("/dashboard")}
                            >
                                Dashboard
                            </Link>

                            <Link
                                href="/about"
                                onClick={closeMenu}
                            >
                                About
                            </Link>

                            <Link
                                href="/contact"
                                onClick={closeMenu}
                            >
                                Contact
                            </Link>

                            <Link
                                href="/help"
                                onClick={closeMenu}
                            >
                                Help
                            </Link>

                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    onClick={closeMenu}
                                    className={navLinkClass("/admin")}
                                >
                                    Admin
                                </Link>
                            )}

                            <div className="border-t pt-4">
                                {isPending ? (
                                    <span
                                        className="loading loading-spinner loading-sm"
                                        aria-label="Checking login"
                                    />
                                ) : user ? (
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <img
                                                src={user.image || "/favicon.svg"}
                                                alt="Profile"
                                                className="w-10 h-10 rounded-full object-cover border"
                                            />

                                            <span className="text-sm truncate max-w-36">
                                                {user.name || user.email}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="btn btn-error btn-sm"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-3">
                                        <Link
                                            href="/login"
                                            onClick={closeMenu}
                                            className="btn btn-outline btn-sm flex-1"
                                        >
                                            Login
                                        </Link>

                                        <Link
                                            href="/register"
                                            onClick={closeMenu}
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
}
