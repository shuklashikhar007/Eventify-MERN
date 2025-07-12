import "./aboutus.css";

const AboutUs = () => {
    return (
        <div className="aboutus-container">
            <h1 className="aboutus-title">About Us</h1>

            <p className="aboutus-intro">
                <strong>Eventify</strong> is more than just a project — it's a solution built by students, for students. We're passionate about using technology to make college life easier and more organized.
                The idea for Eventify came from a simple problem: missing out on events buried in WhatsApp messages and scattered across platforms. We decided to solve that.
            </p>

            <div className="developer-section">
                <div className="developer-card">
                    <h2>Shikhar Shukla — Frontend Developer</h2>
                    <p>
                        I’m a 2nd-year undergraduate student pursuing Chemical Engineering at <strong>IIT (BHU), Varanasi</strong>.
                        I specialize in frontend development and have designed the user interface and experience for Eventify using <strong>React, Zustand, Framer Motion</strong>, and other modern tools.
                    </p>
                    <p>
                        I’m an active member of both the <strong>Entrepreneurship Cell (E-Cell)</strong> and the <strong>Science and Technology Council</strong> of IIT BHU, where I regularly contribute to tech initiatives and collaborative projects.
                    </p>
                </div>

                <div className="developer-card">
                    <h2>Tanishq Singh — Backend Developer</h2>
                    <p>
                        I’m also a 2nd-year undergraduate student in <strong>Chemical Engineering</strong> at <strong>IIT (BHU), Varanasi</strong>.
                        I’ve handled the backend development of Eventify, including event creation, database integration, and API management.
                    </p>
                    <p>
                        Apart from being a common member in various college tech initiatives, I’m also a proud member of <strong>COPS (Club of Programmers, IIT BHU)</strong>
                    </p>
                </div>
            </div>

            <div className="aboutus-section">
                <h2>Our Vision</h2>
                <p>
                    We built Eventify to ensure that <strong>no student at IIT BHU ever misses out on an event</strong> — whether it’s a departmental seminar, a club fest, or a spontaneous college gathering.
                    With centralized event management, instant visibility, and intuitive UI/UX, Eventify is here to enhance student engagement across the campus.
                </p>
            </div>

            <div className="aboutus-section">
                
            </div>

            <div className="aboutus-section">
                <h2>What’s Next?</h2>
                <p>
                    We aim to continuously improve Eventify — by adding features like event reminders, RSVP tracking, club-specific filters, and more. Stay tuned as we keep innovating!
                </p>
            </div>
        </div>
    );
};

export default AboutUs;

