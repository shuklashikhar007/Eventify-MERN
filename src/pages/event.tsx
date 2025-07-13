import { useEventStore, type Event } from "@/store/event";
import { Loader, Pencil, Trash, Clock, UserCircle, MapPinned } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    });

export default function EventPage() {
    const navigate = useNavigate();
    const { event_id } = useParams<{ event_id: string }>();
    const { getEventById, deleteEvent } = useEventStore();
    const [event, setEvent] = useState<Event | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!event_id) return;

        (async () => {
            const fetchedEvent = await getEventById(event_id);
            if (fetchedEvent) setEvent(fetchedEvent);
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

    if (!event)
        return (
            <div className="flex-1 w-full flex flex-col gap-2 justify-center items-center">
                <span className="text-xs sm:text-sm animate-pulse">event not found</span>
            </div>
        );

    const deleteEventHandler = async () => {
        try {
            setIsDeleting(true);
            const isSuccess = await deleteEvent(event.event_id);
            if (isSuccess) navigate("/");
            else throw new Error("you must be logged in to delete");
        } catch (error) {
            alert((error as Error).message);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="max-w-3xl flex-1 w-full mx-6! sm:mx-auto p-6! bg-white rounded-2xl shadow-md border border-gray-200 space-y-4!">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="space-y-1!">
                    <h2 className="text-2xl font-semibold text-gray-800">{event.title}</h2>
                    <p className="text-sm text-gray-500">
                        {formatDateTime(event.event_start_time)} - {formatDateTime(event.event_end_time)}
                    </p>
                    <p className="text-sm text-gray-600 flex justify-start items-center gap-1!">
                        <MapPinned className="size-3 stroke-3" />
                        {event.location}
                    </p>
                </div>
                <div className="flex space-x-2!">
                    <Link to={`/edit-event/${event.event_id}`} className="p-2! rounded-full hover:bg-gray-100 text-gray-600">
                        <Pencil className="w-5 h-5" />
                    </Link>
                    <button onClick={deleteEventHandler} className="p-2! rounded-full hover:bg-red-100 text-red-600 cursor-pointer" disabled={isDeleting}>
                        <Trash className={`w-5 h-5 ${isDeleting && "animate-pulse"}`} />
                    </button>
                </div>
            </div>

            {/* Description */}
            <p className="text-gray-700">{event.description}</p>

            {/* Creator Info */}
            <div className="flex items-center space-x-3! text-sm text-gray-600">
                {event.created_by.image_url ? <img src={event.created_by.image_url} alt={event.created_by.name} className="w-8 h-8 rounded-full object-cover" /> : <UserCircle className="w-8 h-8 text-gray-400" />}
                <div>
                    <p>
                        Created by <span className="font-medium">{event.created_by.name}</span>
                    </p>
                    <p className="text-xs text-gray-500">on {formatDateTime(event.CreatedAt)}</p>
                </div>
            </div>

            {/* Status Flags */}
            <div className="flex space-x-3! text-sm mt-2!">
                {event.is_canceled && <span className="bg-red-100 text-red-700 px-2! py-1! rounded-full font-medium">Canceled</span>}
                {event.is_rescheduled && !event.is_canceled && <span className="bg-yellow-100 text-yellow-800 px-2! py-1! rounded-full font-medium">Rescheduled</span>}
            </div>

            {/* Timeline */}
            <div className="mt-6!">
                <h3 className="text-lg font-semibold text-gray-800 mb-2!">Update History</h3>
                {event.event_updaters.length === 0 && <span className="text-sm">No yet modified</span>}
                <ol className="relative border-l border-gray-300 pl-4! space-y-4!">
                    {[...event.event_updaters]
                        .sort((a, b) => new Date(b.UpdatedAt).getTime() - new Date(a.UpdatedAt).getTime())
                        .map((update) => (
                            <li key={update.event_updater_id} className="ml-2!">
                                <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-1.5 border border-white" />
                                <div className="flex items-start space-x-2!">
                                    {update.updated_by.image_url ? <img src={update.updated_by.image_url} alt={update.updated_by.name} className="w-6 h-6 rounded-full object-cover" /> : <UserCircle className="w-6 h-6 text-gray-400" />}
                                    <div>
                                        <p className="text-sm">
                                            <span className="font-medium">{update.updated_by.name}</span> updated this event
                                        </p>
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {formatDateTime(update.UpdatedAt)}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                </ol>
            </div>
        </div>
    );
}
