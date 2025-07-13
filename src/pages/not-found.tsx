import { Ghost, ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export default function NotFound() {
    return (
        <div className="flex-1 w-full flex flex-col items-center justify-center p-8! text-center">
            <Ghost className="w-20 h-20 text-purple-500 mb-4! animate-bounce" />

            <h1 className="text-4xl font-bold text-gray-800 mb-2!">404 - Not Found</h1>
            <p className="text-gray-600 max-w-md mb-6!">The page you are looking for doesn't exist or has been moved. Maybe it's hiding like a ghost!</p>

            <Link to="/" className="inline-flex items-center px-4! py-2! bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition">
                <ArrowLeft className="w-4 h-4 mr-2!" />
                Go Back Home
            </Link>
        </div>
    );
}
