"use client";

import { useState } from "react";
import Link from "next/link";
import {
    useRouter,
    useSearchParams,
} from "next/navigation";
import toast from "react-hot-toast";

import { signIn } from "../lib/auth-client";

const LoginContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [loading, setLoading] =
        useState(false);

    const requestedCallback =
        searchParams.get("callbackUrl");

    const callbackUrl =
        requestedCallback &&
            requestedCallback.startsWith("/")
            ? requestedCallback
            : "/";

    const handleLogin = async (event) => {
        event.preventDefault();

        const form = event.currentTarget;

        const email =
            form.email.value.trim();

        const password =
            form.password.value;

        try {
            setLoading(true);

            const result =
                await signIn.email({
                    email,
                    password,
                });

            if (result?.error) {
                toast.error(
                    result.error.message ||
                    "Login failed!"
                );

                return;
            }

            toast.success(
                "Login successful!"
            );

            router.push(callbackUrl);
            router.refresh();
        } catch (error) {
            console.error(error);

            toast.error(
                error?.message ||
                "Login failed!"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);

            const absoluteCallbackUrl =
                `${window.location.origin}${callbackUrl}`;

            const result =
                await signIn.social({
                    provider: "google",
                    callbackURL:
                        absoluteCallbackUrl,
                });

            if (result?.error) {
                toast.error(
                    result.error.message ||
                    "Google login failed!"
                );

                setLoading(false);
            }
        } catch (error) {
            console.error(error);

            toast.error(
                error?.message ||
                "Google login failed!"
            );

            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body">
                    <h1 className="text-4xl font-bold text-center mb-6">
                        Login
                    </h1>

                    <form
                        onSubmit={handleLogin}
                        className="space-y-4"
                    >
                        <div>
                            <label className="label">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="Enter your email"
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
                                placeholder="Enter your password"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="text-right">
                            <span className="text-sm text-primary">
                                Forgot Password?
                            </span>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full"
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Logging in...
                                </>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>

                    <div className="divider">
                        OR
                    </div>

                    <button
                        type="button"
                        onClick={
                            handleGoogleLogin
                        }
                        disabled={loading}
                        className="btn btn-outline w-full"
                    >
                        Continue with Google
                    </button>

                    <p className="text-center mt-4">
                        Don&apos;t have an
                        account?{" "}
                        <Link
                            href="/register"
                            className="text-primary font-semibold"
                        >
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginContent;