import { useEffect, useState } from "react";
import "./events.css";
import { useEventStore, type Event } from "@/store/event";
import { Link } from "react-router";



const Events = () => {
    const [page, setPage] = useState(1);
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const loadEvents = useEventStore((e) => e.loadEvents);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setIsLoading(true);
                const data = await loadEvents(page);
                setEvents(data);
            } catch (error) {
                console.error("Failed to load events:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, [page]);

    if (isLoading) return <p>events loading...</p>;

    return (
        <div className="events-page">
            <h1>Upcoming Events</h1>
            <div className="events-list">
                {events.map((event) => (
                    <div key={event.event_id} className="event-preview-card">
                        <h2>{event.title}</h2>
                        <p>{event.description}</p>
                        <p>
                            <strong>{event.is_canceled ? "canceled" : "not canceled"}</strong>
                            <strong>{event.is_rescheduled ? "reschedule" : "not reschedule"}</strong>
                        </p>
                        <Link to={`/event/${event.event_id}`}>View Details</Link>
                    </div>
                ))}
            </div>
            <div>
                {page === 1 ? (
                    events.length === 10 ? (
                        <div>
                            <p onClick={() => setPage(page + 1)}>next page {page + 1}</p>
                        </div>
                    ) : (
                        <p>page: {page}</p>
                    )
                ) : events.length === 10 ? (
                    <div>
                        <p onClick={() => setPage(page - 1)}>prev page {page - 1}</p>
                        <p onClick={() => setPage(page + 1)}>next page {page + 1}</p>
                    </div>
                ) : (
                    <p onClick={() => setPage(page - 1)}>prev page {page - 1}</p>
                )}
            </div>
        </div>
    );
};

export default Events;
