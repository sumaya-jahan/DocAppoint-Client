import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="px-6 py-4 shadow">
            <div className="max-w-7xl mx-auto flex justify-between items-center">

                <Link
                    to="/"
                    className="text-2xl font-bold"
                >
                    DocAppoint
                </Link>

                <div className="space-x-4">
                    <Link to="/">
                        Home
                    </Link>

                    <Link to="/appointments">
                        All Appointments
                    </Link>

                    <Link to="/dashboard">
                        Dashboard
                    </Link>
                </div>

                <div className="space-x-2">
                    <Link to="/login">
                        <button className="btn btn-outline">
                            Login
                        </button>
                    </Link>

                    <Link to="/register">
                        <button className="btn btn-primary">
                            Register
                        </button>
                    </Link>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;