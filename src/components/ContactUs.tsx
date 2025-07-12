import "./contactus.css";

const ContactUs = () => {
    return (
        <div className="contactus-container">
            <h1 className="contactus-title">Contact Us</h1>

            <p className="contactus-intro">
                Got questions, feedback, or collaboration ideas? We'd love to hear from you!  
                Reach out to us directly via email or connect on LinkedIn.
            </p>

            <div className="contact-card-container">
                <div className="contact-card">
                    <h2>Shikhar Shukla</h2>
                    <p>Frontend Developer</p>
                    <p>
                        <strong>Email:</strong>{" "}
                        <a href="mailto:shikharcocreviews2@gmail.com">shikharcocreviews2@gmail.com</a>
                    </p>
                    <a
                        href="https://www.linkedin.com/in/shikhar-shukla-2bb1372ba/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="linkedin-button"
                    >
                        🔗 Connect on LinkedIn
                    </a>
                </div>

                <div className="contact-card">
                    <h2>Tanishq Singh</h2>
                    <p>Backend Developer</p>
                    <p>
                        <strong>Email:</strong>{" "}
                        <a href="mailto:hello@tanishqsingh.com">hello@tanishqsingh.com</a>
                    </p>
                    <a
                        href="https://www.linkedin.com/in/oyetanishq/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="linkedin-button"
                    >
                        🔗 Connect on LinkedIn
                    </a>
                </div>
            </div>

            <p className="closing-note">
                We usually respond within 24 hours. Your ideas can help us make Eventify even better!
            </p>
        </div>
    );
};

export default ContactUs;


