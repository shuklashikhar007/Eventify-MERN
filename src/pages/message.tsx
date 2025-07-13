import { useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export default function Message() {
    const { text } = useParams<{ text: string }>();

    return (
        <div className="flex-1 w-full flex justify-center items-center flex-col max-w-xl text-center px-5!">
            <span className="text-sm mb-6!">{text ? text : "no message given."}</span>
            <Link to="/" className="inline-flex items-center px-4! py-2! bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition">
                <ArrowLeft className="w-4 h-4 mr-2!" />
                Go Back Home
            </Link>
        </div>
    );
}
