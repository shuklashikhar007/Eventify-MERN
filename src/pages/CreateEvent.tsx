import { useState, type ChangeEvent, type FormEvent } from "react";
import "./CreateEvent.css";

const CreateEvent = () => {
    const [event, setEvent] = useState({
        title: "",
        society: "",
        details: "",
        isPaid: false,
        target: "",
        mediaLink: "",
    });

    const handleChange = (e: ChangeEvent<any>) => {
        const { name, value, type, checked } = e.target;
        setEvent((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log(event);
        alert("🎉 Event created (Frontend Only)");
    };

    return (
        <div className="create-event-container">
            <h1>Create a New Event</h1>
            <form className="create-event-form" onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Event Title" value={event.title} onChange={handleChange} required />
                <input type="text" name="society" placeholder="Organizing Club / Society" value={event.society} onChange={handleChange} required />
                <textarea name="details" placeholder="Event Description / Details" value={event.details} onChange={handleChange} required />
                <label className="checkbox-container">
                    <input type="checkbox" name="isPaid" checked={event.isPaid} onChange={handleChange} />
                    Is the event Paid?
                </label>
                <input type="text" name="target" placeholder="Target Audience (e.g., All Years, CSE)" value={event.target} onChange={handleChange} required />
                <input type="text" name="mediaLink" placeholder="Link to Instagram / Poster / Website" value={event.mediaLink} onChange={handleChange} />
                <button type="submit">➕ Submit Event</button>
            </form>
        </div>
    );
};

export default CreateEvent;
