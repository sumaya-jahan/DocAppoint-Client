import { Link } from "react-router-dom";

const Login = () => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body">
                    <h1 className="text-4xl font-bold text-center mb-6">
                        Login
                    </h1>

                    <form className="space-y-4">
                        <div>
                            <label className="label">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div>
                            <label className="label">Password</label>
                            <input
                                type="password"
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

                    <button className="btn btn-outline w-full mt-4">
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