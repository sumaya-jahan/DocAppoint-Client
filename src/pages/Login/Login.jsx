import { useContext, useState } from "react";
import {
    Link,
    useNavigate,
    useLocation,
} from "react-router-dom";
import toast from "react-hot-toast";

import { AuthContext } from "../../providers/AuthProvider";
import PageTitle from "../../components/PageTitle";

const Login = () => {
    const { signInUser, googleLogin } =
        useContext(AuthContext);

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const from =
        location.state?.from?.pathname ||
        location.state ||
        "/";

    const getJwtToken = async (email) => {
        const jwtRes = await fetch(
            "https://docappoint-server-uvkv.onrender.com/jwt",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify({
                    email,
                }),
            }
        );

        const jwtData = await jwtRes.json();

        if (!jwtRes.ok || !jwtData.token) {
            throw new Error(
                jwtData.message ||
                "Failed to generate authentication token"
            );
        }

        localStorage.setItem(
            "access-token",
            jwtData.token
        );
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        const form = e.target;

        const email = form.email.value;
        const password = form.password.value;

        try {
            setLoading(true);

            const result = await signInUser(
                email,
                password
            );

            await getJwtToken(
                result.user.email
            );

            toast.success("Login successful!");

            navigate(from, {
                replace: true,
            });
        } catch (error) {
            console.error(error);

            toast.error(
                error.message ||
                "Login failed!"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);

            const result =
                await googleLogin();

            await getJwtToken(
                result.user.email
            );

            toast.success("Login successful!");

            navigate(from, {
                replace: true,
            });
        } catch (error) {
            console.error(error);

            toast.error(
                error.message ||
                "Google login failed!"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <PageTitle title="Login" />

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
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="btn btn-outline w-full"
                        >
                            Continue with Google
                        </button>

                        <p className="text-center mt-4">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="text-primary font-semibold"
                            >
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;