
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { signIn } from "../lib/auth-client";

export default function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);

    const requested = searchParams.get("callbackUrl");
    const callbackUrl =
        requested?.startsWith("/") && !requested.startsWith("//")
            ? requested
            : "/";

    const handleLogin = async (event) => {
        event.preventDefault();

        const form = event.currentTarget;
        const email = form.elements.namedItem("email").value.trim();
        const password = form.elements.namedItem("password").value;

        try {
            setLoading(true);

            const result = await signIn.email({
                email,
                password,
            });

            if (result?.error) {
                toast.error(result.error.message || "Login failed");
                return;
            }

            toast.success("Login successful!");
            router.replace(callbackUrl);
            router.refresh();
        } catch {
            toast.error("Unable to login. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);

            const result = await signIn.social({
                provider: "google",
                callbackURL: `${window.location.origin}${callbackUrl}`,
            });

            if (result?.error) {
                toast.error(result.error.message || "Google login failed");
            }
        } catch {
            toast.error("Google login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center px-4 py-10">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body">
                    <h1 className="mb-6 text-center text-4xl font-bold">
                        Login
                    </h1>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label htmlFor="login-email" className="label">
                                Email
                            </label>
                            <input
                                id="login-email"
                                type="email"
                                name="email"
                                required
                                autoComplete="email"
                                placeholder="Enter your email"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div>
                            <label htmlFor="login-password" className="label">
                                Password
                            </label>
                            <input
                                id="login-password"
                                type="password"
                                name="password"
                                required
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="text-right">
                            <Link
                                href="/forgot-password"
                                className="text-sm text-primary hover:underline"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <div className="divider">OR</div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="btn btn-outline w-full"
                    >
                        Continue with Google
                    </button>

                    <p className="mt-4 text-center">
                        Don't have an account?{" "}
                        <Link
                            href="/register"
                            className="font-semibold text-primary"
                        >
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
