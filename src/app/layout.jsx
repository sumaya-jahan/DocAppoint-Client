import "../index.css";

import Providers from "./providers";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
    title: {
        default: "DocAppoint",
        template: "%s | DocAppoint",
    },
    description:
        "DocAppoint is a doctor appointment booking system where users can find doctors and manage appointments.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" data-theme="light">
            <body className="min-h-screen bg-base-100 text-base-content">
                <Providers>
                    <Navbar />

                    <main className="min-h-screen">
                        {children}
                    </main>

                    <Footer />
                </Providers>
            </body>
        </html>
    );
}