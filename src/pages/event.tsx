import { useEventStore, type Event, type EventUpdater } from "@/store/event";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

function EventUpdater({ updater }: { updater: EventUpdater }) {
    return (
        <div>
            <p>
                Updated by: {updater.updated_by.name} ({updater.updated_by.email})
            </p>
            <p>At: {new Date(updater.UpdatedAt).toLocaleString()}</p>
        </div>
    );
}

export default function EventPage() {
    const { event_id } = useParams<{ event_id: string }>();
    const getEventById = useEventStore((s) => s.getEventById);
    const [event, setEvent] = useState<Event | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!event_id) return;

        (async () => {
            const fetchedEvent = await getEventById(event_id);
            if (fetchedEvent) setEvent(fetchedEvent);
            setLoading(false);
        })();
    }, []);

    if (loading) return <h1>Loading...</h1>;
    if (!event) return <h1>Event not found</h1>;

    return (
        <div>
            <p>EVENT ID: {event.event_id}</p>
            <p>TITLE: {event.title}</p>
            <p>DESC: {event.description}</p>
            <p>EVENT CREATED BY: {event.created_by.email}</p>
            <p>EVENT CREATED BY: {event.created_by.name}</p>
            <p>EVENT CREATED AT: {new Date(event.UpdatedAt).toLocaleString()}</p>
            {event.created_by.image_url && <img src={event.created_by.image_url} />}
            {event.event_updaters.map((eu) => (
                <EventUpdater key={eu.event_updater_id} updater={eu} />
            ))}

            <Link to={`/edit-event/${event.event_id}`}>edit this event</Link>
        </div>
    );
}
