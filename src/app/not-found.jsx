import Link from "next/link";

export const metadata = {
    title: "Page Not Found",
    description: "The requested page could not be found on DocAppoint.",
};

export default function NotFound() {
    return (
        <section className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="text-center max-w-lg">
                <h1 className="text-8xl font-bold text-primary">
                    404
                </h1>

                <h2 className="text-3xl font-semibold mt-4">
                    Page Not Found
                </h2>

                <p className="text-base-content/70 mt-3">
                    Sorry, the page you are looking for does not exist.
                </p>

                <Link
                    href="/"
                    className="btn btn-primary mt-6"
                >
                    Back to Home
                </Link>
            </div>
        </section>
    );
}