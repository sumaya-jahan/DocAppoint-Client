import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import toast from "react-hot-toast";
import PageTitle from "../../components/PageTitle";

const Register = () => {
    const {
        createUser,
        updateUserProfile,
        googleLogin,
    } = useContext(AuthContext);

    const navigate = useNavigate();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        setError("");

        const form = e.target;

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const photo = form.photo.value.trim();
        const password = form.password.value;

        if (!/[A-Z]/.test(password)) {
            return setError(
                "Password must contain at least one uppercase letter"
            );
        }

        if (!/[a-z]/.test(password)) {
            return setError(
                "Password must contain at least one lowercase letter"
            );
        }

        if (password.length < 6) {
            return setError(
                "Password must be at least 6 characters"
            );
        }

        try {
            setLoading(true);

            await createUser(email, password);

            await updateUserProfile(
                name,
                photo
            );

            toast.success(
                "Registration successful!"
            );

            navigate("/login");
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Registration failed!"
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

            const jwtRes = await fetch(
                "https://docappoint-server-uvkv.onrender.com/jwt",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        email: result.user.email,
                    }),
                }
            );

            const jwtData = await jwtRes.json();

            if (!jwtRes.ok || !jwtData.token) {
                throw new Error(
                    jwtData.message ||
                    "Failed to generate token"
                );
            }

            localStorage.setItem(
                "access-token",
                jwtData.token
            );

            toast.success(
                "Google signup successful!"
            );

            navigate("/");
        } catch (err) {
            console.error(err);

            toast.error(
                err.message ||
                "Google signup failed!"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <PageTitle title="Register" />

            <div className="min-h-screen flex items-center justify-center px-4 py-10">
                <div className="card w-full max-w-md bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h1 className="text-4xl font-bold text-center mb-6">
                            Register
                        </h1>

                        <form
                            onSubmit={handleRegister}
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
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="btn btn-outline w-full"
                        >
                            Continue with Google
                        </button>

                        <p className="text-center mt-4">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-primary font-semibold"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;