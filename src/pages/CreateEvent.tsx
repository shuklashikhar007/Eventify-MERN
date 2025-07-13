import { useState, type FormEvent } from "react";
import "./createEvent.css";
import { useUserStore } from "@/store/user";
import { useEventStore, type CreateEventPayload } from "@/store/event";
import { useNavigate } from "react-router";
import { CalendarClock, CalendarPlus, Locate, Loader, Pencil, Text, TextQuote } from "lucide-react";

const CreateEvent = () => {
    const navigate = useNavigate();

    const user = useUserStore((s) => s.user);
    const { createEvent } = useEventStore();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [eventStartTime, setEventStartTime] = useState(new Date().toISOString());
    const [eventEndTime, setEventEndTime] = useState(new Date().toISOString());

    const [isCreating, setIsCreating] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const event: CreateEventPayload = {
            title,
            description,
            location,
            event_start_time: new Date(eventStartTime).toISOString(),
            event_end_time: new Date(eventEndTime).toISOString(),
            is_canceled: false,
            is_rescheduled: false,
        };

        setIsCreating(true);
        const event_id = await createEvent(event);
        if (event_id) navigate(`/event/${event_id}`);
        setIsCreating(false);
    };

    return (
        <div className="max-w-2xl flex-1 w-full mx-6! sm:mx-auto p-8! bg-white shadow-xl rounded-xl">
            <h1 className="text-3xl font-semibold mb-6! flex items-center gap-2">
                <Pencil className="w-6 h-6 text-indigo-500" />
                Edit Event
            </h1>

            <form className="space-y-4!" onSubmit={handleSubmit}>
                <div className="flex items-center gap-2">
                    <Text className="size-5 text-gray-500" />
                    <input type="text" required minLength={2} maxLength={200} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4! py-2! border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div className="flex items-center gap-2">
                    <TextQuote className="size-5 text-gray-500" />
                    <input
                        type="text"
                        required
                        minLength={2}
                        maxLength={1000}
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4! py-2! border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Locate className="size-5 text-gray-500" />
                    <input
                        type="text"
                        required
                        minLength={2}
                        maxLength={255}
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-4! py-2! border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <CalendarClock className="size-5 text-gray-500" />
                    <span className="w-20 text-sm font-semibold">Start Time</span>
                    <input type="datetime-local" required value={eventStartTime.slice(0, 16)} onChange={(e) => setEventStartTime(e.target.value)} className="flex-1 px-4! py-2! border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div className="flex items-center gap-2">
                    <CalendarPlus className="size-5 text-gray-500" />
                    <span className="w-20 text-sm font-semibold">End Time</span>
                    <input type="datetime-local" required value={eventEndTime.slice(0, 16)} onChange={(e) => setEventEndTime(e.target.value)} className="flex-1 px-4! py-2! border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>

                <button type="submit" disabled={!user} className={`w-full min-h-12 flex justify-center items-center gap-2 px-6! py-3! rounded-md text-white font-semibold transition cursor-pointer ${user ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"}`}>
                    {isCreating ? (
                        <Loader className="size-4 animate-spin" />
                    ) : (
                        <>
                            <Pencil className="size-4" />
                            Create Event
                        </>
                    )}
                </button>

                {!user && <p className="text-red-500 text-sm mt-2!">Please login to create an event.</p>}
            </form>
        </div>
    );
};

export default CreateEvent;
