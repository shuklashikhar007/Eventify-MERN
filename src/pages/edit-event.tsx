import { useEffect, useState, type FormEvent } from "react";
import "./createEvent.css";
import { useUserStore } from "@/store/user";
import { useEventStore, type Event } from "@/store/event";
import { useNavigate, useParams } from "react-router";

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

    if (loading) return <h1>Loading...</h1>;
    if (title.length === 0 || !event_id) return <h1>Event not found</h1>;

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

        const updated_event_id = await updateEvent(event_id, event);

        if (updated_event_id) navigate(`/event/${updated_event_id}`);
    };

    return (
        <div className="create-event-container">
            <h1>Create a New Event</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" required minLength={2} maxLength={200} placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <input type="text" required minLength={2} maxLength={1000} placeholder="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                <input type="text" required minLength={2} maxLength={255} placeholder="location" value={location} onChange={(e) => setLocation(e.target.value)} />

                <input type="datetime-local" required placeholder="start time" value={eventStartTime.slice(0, 16)} onChange={(e) => setEventStartTime(e.target.value)} />
                <input type="datetime-local" required placeholder="end time" value={eventEndTime.slice(0, 16)} onChange={(e) => setEventEndTime(e.target.value)} />

                <div>
                    <input type="checkbox" checked={isCanceled} onChange={(e) => setIsCanceled(e.target.checked)} />
                    <label>is canceled</label>
                </div>
                <div>
                    <input type="checkbox" checked={isRescheduled} onChange={(e) => setIsRescheduled(e.target.checked)} />
                    <label>is reschedule</label>
                </div>

                <button type="submit" disabled={!user}>
                    submit
                </button>
                {!user && <p className="error">Please login to create an event.</p>}
            </form>
        </div>
    );
};

export default EditEvent;
