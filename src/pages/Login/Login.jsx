import { useContext } from "react";
import {
    Link,
    useNavigate,
    useLocation,
} from "react-router-dom";
import toast from "react-hot-toast";

import { AuthContext } from "../../providers/AuthProvider";

const Login = () => {
    const {
        signInUser,
        googleLogin,
    } = useContext(AuthContext);

    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state || "/";

    const handleLogin = async (e) => {
        e.preventDefault();

        const form = e.target;

        const email = form.email.value;
        const password = form.password.value;

        try {
            const result = await signInUser(
                email,
                password
            );

            const user = {
                email: result.user.email,
            };

            const jwtRes = await fetch(
                "https://docappoint-server-uvkv.onrender.com/jwt",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(user),
                }
            );

            const jwtData = await jwtRes.json();

            localStorage.setItem(
                "access-token",
                jwtData.token
            );

            toast.success("Login successful!");

            navigate(from, { replace: true });
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await googleLogin();

            const user = {
                email: result.user.email,
            };

            const jwtRes = await fetch(
                "https://docappoint-server-uvkv.onrender.com/jwt",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(user),
                }
            );

            const jwtData = await jwtRes.json();

            localStorage.setItem(
                "access-token",
                jwtData.token
            );

            toast.success("Login successful!");

            navigate(from, {
                replace: true,
            });
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
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
                            <a className="text-sm text-primary cursor-pointer">
                                Forgot Password?
                            </a>
                        </div>

                        <button className="btn btn-primary w-full">
                            Login
                        </button>
                    </form>

                    <button
                        onClick={handleGoogleLogin}
                        className="btn btn-outline w-full mt-4"
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
    );
};

export default Login;