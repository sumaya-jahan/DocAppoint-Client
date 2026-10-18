
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
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const requested = searchParams.get("callbackUrl");
    const callbackUrl =
        requested?.startsWith("/") && !requested.startsWith("//")
            ? requested
            : "/";

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);

            const result = await signIn.email({
                email: email.trim(),
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

    const handleDemoLogin = () => {
        const demoEmail = process.env.NEXT_PUBLIC_DEMO_EMAIL;
        const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD;

        if (!demoEmail || !demoPassword) {
            toast.error("Demo account is not configured yet.");
            return;
        }

        setEmail(demoEmail);
        setPassword(demoPassword);
        toast.success("Demo credentials filled. Click Login.");
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
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
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
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
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

                    <button
                        type="button"
                        onClick={handleDemoLogin}
                        disabled={loading}
                        className="btn btn-secondary w-full mt-3"
                    >
                        Fill Demo Login
                    </button>

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
