/** @type {import('next').NextConfig} */
const nextConfig = {
    turbopack: {
        root: process.cwd(),
    },
    async rewrites() {
        return [
            {
                source: "/doctors",
                destination: "http://localhost:5000/doctors",
            },
            {
                source: "/doctors/:path*",
                destination: "http://localhost:5000/doctors/:path*",
            },
            {
                source: "/api/:path*",
                destination: "http://localhost:5000/api/:path*",
            },
        ];
    },
};

export default nextConfig;