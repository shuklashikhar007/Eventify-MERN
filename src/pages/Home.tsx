import { Link } from "react-router-dom";
import "./home.css";
import { motion } from "framer-motion";

const Home = () => {
    return (
        <div className="home-container">
            <motion.h1 initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="homepage-heading">
                Never Miss a College Event Again.
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }} className="homepage-subtext">
                Tired of missing out on important college events just because they were buried in WhatsApp messages?
                <br />
                <br />
                <strong>Eventify</strong> is your centralized event management platform — built to keep every IIT BHU student in the loop. From club fests to departmental seminars, you'll get everything in one place, personalized just for you.
                <br />
                <br />
                <em>Create your account today, and stay notified. Always.</em>
            </motion.p>

            <motion.div className="cta-buttons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}>
                <Link to="/events" className="cta-button">
                    📅 See Upcoming Events
                </Link>
                <Link to="/create" className="cta-button secondary">
                    ➕ Create New Event
                </Link>
            </motion.div>
        </div>
    );
};

export default Home;
