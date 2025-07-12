import { useEffect, useState } from "react";
import "./events.css";
import { useEventStore, type Event } from "@/store/event";
import { Link } from "react-router";

import { Loader } from "lucide-react";

const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    });

function EventCard({ event }: { event: Event }) {
    return (
        <Link to={`/event/${event.event_id}`}>
            <div className="bg-white shadow-lg rounded-2xl p-6! border border-gray-200 hover:shadow-xl transition-all duration-300 mb-5!">
                <div className="flex items-center justify-between mb-2!">
                    <h2 className="text-xl font-semibold text-gray-800">{event.title}</h2>
                    {event.is_canceled && <span className="text-sm text-red-600 font-semibold">Canceled</span>}
                    {!event.is_canceled && event.is_rescheduled && <span className="text-sm text-yellow-500 font-semibold">Rescheduled</span>}
                </div>

                <p className="text-gray-600 mb-3!">{event.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 mb-4!">
                    <div>
                        <strong>📍 Location:</strong> {event.location}
                    </div>
                    <div>
                        <strong>🕒 Starts:</strong> {formatDate(event.event_start_time)}
                    </div>
                    <div>
                        <strong>🕓 Ends:</strong> {formatDate(event.event_end_time)}
                    </div>
                    <div>
                        <strong>👤 Created By:</strong> {event.created_by.name}
                    </div>
                </div>

                <div className="text-xs text-gray-400">
                    Created on {formatDate(event.CreatedAt)} &ensp; | &ensp;Last updated {formatDate(event.UpdatedAt)}
                </div>
            </div>
        </Link>
    );
}

const Events = () => {
    const [page, setPage] = useState(1);
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const loadEvents = useEventStore((e) => e.loadEvents);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setIsLoading(true);
                setEvents(await loadEvents(page));
            } catch (error) {
                console.error("Failed to load events:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, [page]);

    if (isLoading)
        return (
            <div className="flex-1 w-full flex flex-col gap-2 justify-center items-center">
                <Loader className="size-6 animate-spin" />
                <span className="text-xs sm:text-sm animate-pulse">fetching recent events</span>
            </div>
        );

    return (
        <div className="flex flex-col justify-center items-center gap-5 mt-5! w-full">
            <h1 className="font-semibold underline underline-offset-2">Upcoming Events</h1>
            <div className="max-w-2xl mx-auto mt-10 px-4">
                {events.map((event) => (
                    <EventCard event={event} key={event.event_id} />
                ))}
            </div>
            <div className="pb-5!">
                {page === 1 ? (
                    events.length === 10 ? (
                        <div>
                            <p className="cursor-pointer hover:underline hover:underline-offset-2" onClick={() => setPage(page + 1)}>
                                next page {page + 1}
                            </p>
                        </div>
                    ) : (
                        <p>page: {page}</p>
                    )
                ) : events.length === 10 ? (
                    <div className="flex gap-4">
                        <p className="cursor-pointer hover:underline hover:underline-offset-2" onClick={() => setPage(page - 1)}>
                            prev page {page - 1}
                        </p>
                        <p className="cursor-pointer hover:underline hover:underline-offset-2" onClick={() => setPage(page + 1)}>
                            next page {page + 1}
                        </p>
                    </div>
                ) : (
                    <p className="cursor-pointer hover:underline hover:underline-offset-2" onClick={() => setPage(page - 1)}>
                        prev page {page - 1}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Events;
