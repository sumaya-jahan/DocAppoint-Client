"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
    signIn,
    signUp,
} from "../lib/auth-client";

const RegisterContent = () => {
    const router = useRouter();

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const handleRegister = async (event) => {
        event.preventDefault();

        setError("");

        const form =
            event.currentTarget;

        const name =
            form.name.value.trim();

        const email =
            form.email.value.trim();

        const photo =
            form.photo.value.trim();

        const password =
            form.password.value;

        // Assignment password rules
        if (!/[A-Z]/.test(password)) {
            setError(
                "Password must contain at least one uppercase letter"
            );
            return;
        }

        if (!/[a-z]/.test(password)) {
            setError(
                "Password must contain at least one lowercase letter"
            );
            return;
        }

        if (password.length < 6) {
            setError(
                "Password must be at least 6 characters"
            );
            return;
        }

        try {
            setLoading(true);

            const result =
                await signUp.email({
                    name,
                    email,
                    password,
                    image: photo,
                });

            if (result?.error) {
                setError(
                    result.error.message ||
                    "Registration failed!"
                );

                return;
            }

            toast.success(
                "Registration successful!"
            );

            // Assignment requirement:
            // after normal registration go to Login
            router.push("/login");
        } catch (err) {
            console.error(err);

            setError(
                err?.message ||
                "Registration failed!"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup =
        async () => {
            try {
                setLoading(true);

                const callbackURL =
                    `${window.location.origin}/`;

                const result =
                    await signIn.social({
                        provider: "google",
                        callbackURL,
                    });

                if (result?.error) {
                    toast.error(
                        result.error.message ||
                        "Google signup failed!"
                    );

                    setLoading(false);
                }
            } catch (err) {
                console.error(err);

                toast.error(
                    err?.message ||
                    "Google signup failed!"
                );

                setLoading(false);
            }
        };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body">
                    <h1 className="text-4xl font-bold text-center mb-6">
                        Register
                    </h1>

                    <form
                        onSubmit={
                            handleRegister
                        }
                        className="space-y-4"
                    >
                        <div>
                            <label className="label">
                                Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="Your Name"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div>
                            <label className="label">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="Your Email"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div>
                            <label className="label">
                                Photo URL
                            </label>

                            <input
                                type="url"
                                name="photo"
                                required
                                placeholder="https://example.com/photo.jpg"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div>
                            <label className="label">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                required
                                placeholder="Password"
                                className="input input-bordered w-full"
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full"
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Registering...
                                </>
                            ) : (
                                "Register"
                            )}
                        </button>
                    </form>

                    <div className="divider">
                        OR
                    </div>

                    <button
                        type="button"
                        onClick={
                            handleGoogleSignup
                        }
                        disabled={loading}
                        className="btn btn-outline w-full"
                    >
                        Continue with Google
                    </button>

                    <p className="text-center mt-4">
                        Already have an
                        account?{" "}
                        <Link
                            href="/login"
                            className="text-primary font-semibold"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterContent;