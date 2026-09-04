import { Suspense } from "react";
import LoginContent from "../../components/LoginContent";

export const metadata = {
    title: "Login",
    description:
        "Login to DocAppoint to manage your doctor appointments and profile.",
};

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            }
        >
            <LoginContent />
        </Suspense>
    );
}