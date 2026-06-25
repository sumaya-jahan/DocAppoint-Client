import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import toast from "react-hot-toast";

const Register = () => {
    const {
        createUser,
        updateUserProfile,
        googleLogin,
    } = useContext(AuthContext);

    const navigate = useNavigate();

    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        setError("");

        const form = e.target;

        const name = form.name.value;
        const email = form.email.value;
        const photo = form.photo.value;
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
            setError(err.message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await googleLogin();

            toast.success(
                "Login successful!"
            );

            navigate("/");
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
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
                                type="text"
                                name="photo"
                                required
                                placeholder="Photo URL"
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
                            <p className="text-red-500">
                                {error}
                            </p>
                        )}

                        <button className="btn btn-primary w-full">
                            Register
                        </button>
                    </form>

                    <button
                        onClick={handleGoogleLogin}
                        className="btn btn-outline w-full mt-4"
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
    );
};

export default Register;