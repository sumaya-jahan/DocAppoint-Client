
"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "../../lib/auth-client";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error("Please enter your email");
            return;
        }

        try {
            setLoading(true);

            const { error } = await authClient.requestPasswordReset({
                email: email.trim(),
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) {
                toast.error("Unable to process request. Try again.");
                return;
            }

            setSent(true);
            toast.success("Request submitted!");
        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center px-4 py-10">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body">
                    <h1 className="text-3xl font-bold text-center">
                        Forgot Password?
                    </h1>

                    {sent ? (
                        <div className="text-center space-y-4 mt-4">
                            <p>
                                If this email is registered, you will
                                receive a password reset link.
                                Check your inbox and spam folder.
                            </p>

                            <Link href="/login" className="btn btn-primary">
                                Back to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
                            <p className="text-sm text-center">
                                Enter your registered email address.
                            </p>

                            <div>
                                <label htmlFor="reset-email" className="label">
                                    Email Address
                                </label>

                                <input
                                    id="reset-email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full"
                            >
                                {loading ? "Sending..." : "Send Reset Link"}
                            </button>

                            <Link
                                href="/login"
                                className="block text-center text-primary"
                            >
                                Back to Login
                            </Link>
                        </form>
                    )}
                </div>
            </div>
        </main>
    );
}
