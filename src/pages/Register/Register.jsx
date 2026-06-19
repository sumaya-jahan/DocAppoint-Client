import { Link } from "react-router-dom";

const Register = () => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body">
                    <h1 className="text-4xl font-bold text-center mb-6">
                        Register
                    </h1>

                    <form className="space-y-4">
                        <div>
                            <label className="label">Name</label>
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div>
                            <label className="label">Email</label>
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div>
                            <label className="label">Photo URL</label>
                            <input
                                type="text"
                                placeholder="Photo URL"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div>
                            <label className="label">Password</label>
                            <input
                                type="password"
                                placeholder="Password"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <button className="btn btn-primary w-full">
                            Register
                        </button>
                    </form>

                    <button className="btn btn-outline w-full mt-4">
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