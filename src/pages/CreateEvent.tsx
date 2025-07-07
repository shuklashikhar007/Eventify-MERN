import { useState, type FormEvent } from "react";
import "./createEvent.css";
import { useUserStore } from "@/store/user";
import { useEventStore, type CreateEventPayload } from "@/store/event";
import { useNavigate } from "react-router";

const CreateEvent = () => {
    const navigate = useNavigate();

    const user = useUserStore((s) => s.user);
    const { createEvent } = useEventStore();

    const [title, setTitle] = useState("title 1");
    const [description, setDescription] = useState("desc");
    const [location, setLocation] = useState("loca1");

    const [eventStartTime, setEventStartTime] = useState(new Date().toISOString());
    const [eventEndTime, setEventEndTime] = useState(new Date().toISOString());

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

        const event_id = await createEvent(event);

        if (event_id) navigate(`/event/${event_id}`);
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

                <button type="submit" disabled={!user}>
                    submit
                </button>
                {!user && <p className="error">Please login to create an event.</p>}
            </form>
        </div>
    );
};

export default CreateEvent;
