import { useEffect, useState, type FormEvent } from "react";
import { useUserStore } from "@/store/user";
import { useEventStore, type Event } from "@/store/event";
import { useNavigate, useParams } from "react-router";
import { CalendarClock, CalendarPlus, Locate, Loader, Pencil, ShieldOff, ShieldCheck, Text, TextQuote, X } from "lucide-react";

const EditEvent = () => {
    const navigate = useNavigate();
    const { event_id } = useParams<{ event_id: string }>();

    const user = useUserStore((s) => s.user);
    const { updateEvent, getEventById } = useEventStore();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [eventStartTime, setEventStartTime] = useState("");
    const [eventEndTime, setEventEndTime] = useState("");
    const [isCanceled, setIsCanceled] = useState(false);
    const [isRescheduled, setIsRescheduled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (!event_id) return;

        (async () => {
            const fetchedEvent = await getEventById(event_id);
            if (fetchedEvent) {
                setTitle(fetchedEvent.title);
                setDescription(fetchedEvent.description);
                setLocation(fetchedEvent.location);
                setEventStartTime(fetchedEvent.event_start_time);
                setEventEndTime(fetchedEvent.event_end_time);
                setIsCanceled(fetchedEvent.is_canceled);
                setIsRescheduled(fetchedEvent.is_rescheduled);
            }
            setLoading(false);
        })();
    }, []);

    if (loading)
        return (
            <div className="flex-1 w-full flex flex-col gap-2 justify-center items-center">
                <Loader className="size-6 animate-spin" />
                <span className="text-xs sm:text-sm animate-pulse">fetching event</span>
            </div>
        );

    if (title.length === 0 || !event_id)
        return (
            <div className="flex-1 w-full flex flex-col gap-2 justify-center items-center">
                <span className="text-xs sm:text-sm">event not found</span>
            </div>
        );

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const event: Partial<Event> = {
            title,
            description,
            location,
            event_start_time: new Date(eventStartTime).toISOString(),
            event_end_time: new Date(eventEndTime).toISOString(),
            is_canceled: isCanceled,
            is_rescheduled: isRescheduled,
        };

        setIsUpdating(true);

        const updated_event_id = await updateEvent(event_id, event);
        if (updated_event_id) navigate(`/event/${updated_event_id}`);

        setIsUpdating(false);
    };

    return (
        <div className="max-w-2xl flex-1 w-full mx-auto p-8! bg-white shadow-xl rounded-xl">
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
                    <input type="datetime-local" required value={eventStartTime.slice(0, 16)} onChange={(e) => setEventStartTime(e.target.value)} className="w-full px-4! py-2! border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div className="flex items-center gap-2">
                    <CalendarPlus className="size-5 text-gray-500" />
                    <input type="datetime-local" required value={eventEndTime.slice(0, 16)} onChange={(e) => setEventEndTime(e.target.value)} className="w-full px-4! py-2! border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div className="flex items-center gap-2">
                    <ShieldOff className="size-5 text-gray-500" />
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={isCanceled} onChange={(e) => setIsCanceled(e.target.checked)} className="size-4" />
                        Canceled
                    </label>
                </div>

                <div className="flex items-center gap-2">
                    <ShieldCheck className="size-5 text-gray-500" />
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={isRescheduled} onChange={(e) => setIsRescheduled(e.target.checked)} className="size-4" />
                        Rescheduled
                    </label>
                </div>

                <button type="submit" disabled={!user} className={`w-full min-h-12 flex justify-center items-center gap-2 px-6! py-3! rounded-md text-white font-semibold transition cursor-pointer ${user ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"}`}>
                    {isUpdating ? (
                        <Loader className="size-4 animate-spin" />
                    ) : (
                        <>
                            <Pencil className="size-4" />
                            Update Event
                        </>
                    )}
                </button>

                {!user && <p className="text-red-500 text-sm mt-2!">Please login to update this event.</p>}
            </form>
        </div>
    );
};

export default EditEvent;
