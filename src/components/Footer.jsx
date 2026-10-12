import Link from "next/link";
import Image from "next/image";

import logo from "../assets/logo.png";

const Footer = () => {
    return (
        <footer className="mt-20 border-t bg-base-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Logo + Name */}
                    <div className="text-center md:text-left">
                        <Link
                            href="/"
                            className="flex items-center justify-center md:justify-start gap-2"
                        >
                            <Image
                                src={logo}
                                alt="DocAppoint Logo"
                                width={48}
                                height={48}
                                className="w-12 h-12 object-contain rounded-lg"
                            />

                            <span className="text-2xl font-bold">
                                DocAppoint
                            </span>
                        </Link>

                        <p className="text-gray-500 mt-2">
                            Doctor Appointment Management System
                        </p>
                    </div>

                    {/* Social Icons */}
                    <div className="flex items-center gap-4">
                        <a
                            href="https://www.facebook.com/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Facebook"
                            className="btn btn-circle btn-outline"
                        >
                            f
                        </a>

                        <a
                            href="https://www.linkedin.com/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="LinkedIn"
                            className="btn btn-circle btn-outline"
                        >
                            in
                        </a>

                        <a
                            href="https://x.com/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="X"
                            className="btn btn-circle btn-outline"
                        >
                            X
                        </a>
                    </div>
                </div>

                <div className="text-center text-sm text-gray-500 mt-8">
                    © 2026 DocAppoint. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;