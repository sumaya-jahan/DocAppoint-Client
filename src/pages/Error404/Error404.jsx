import { Link } from "react-router-dom";
import PageTitle from "../../components/PageTitle";

const Error404 = () => {
    return (
        <>
            <PageTitle title="404 Not Found" />

            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="text-center">
                    <h1 className="text-8xl md:text-9xl font-bold text-primary">
                        404
                    </h1>

                    <h2 className="text-3xl md:text-4xl font-bold mt-4">
                        Page Not Found
                    </h2>

                    <p className="text-gray-500 mt-4 max-w-md mx-auto">
                        The page you are looking for does not exist
                        or may have been moved.
                    </p>

                    <Link
                        to="/"
                        className="btn btn-primary mt-8"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Error404;