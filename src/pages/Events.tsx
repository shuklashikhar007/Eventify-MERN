import "./events.css";

const mockEvents = [
    {
        id: 1,
        title: "Coding Marathon",
        society: "Programming Club",
        shortDescription: "24-hour coding hackathon with prizes and fun.",
        isPaid: false,
        target: "All BTech Students",
    },
    {
        id: 2,
        title: "Photography Workshop",
        society: "Photography Society",
        shortDescription: "Learn the basics of DSLR and mobile photography.",
        isPaid: true,
        target: "Open to All",
    },
];

const Events = () => {
    return (
        <div className="events-page">
            <h1>Upcoming Events</h1>
            <div className="events-list">
                {mockEvents.map((event) => (
                    <div key={event.id} className="event-preview-card">
                        <h2>{event.title}</h2>
                        <p>
                            <strong>Organized by:</strong> {event.society}
                        </p>
                        <p>{event.shortDescription}</p>
                        <p>
                            <strong>{event.isPaid ? "Paid" : "Free"}</strong>
                        </p>
                        <p>
                            <strong>Target:</strong> {event.target}
                        </p>
                        <button>View Details</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Events;
