import "./socials.css";

const Admins = () => {
    return (
        <div className="socials-page">
            <h1>Meet the Admins of Eventify</h1>

            <div className="admin-card">
                <img src="https://avatars.githubusercontent.com/u/78887814?v=4" alt="Tanishq Oye" className="admin-img" />
                <h2>Tanishq Singh</h2>
                <p>
                    <strong>Role:</strong> Full Stack Developer{" "}
                </p>
                <p>Tanishq leads the most crucial aspect of the website, ensuring smooth functionality and user experience. and building effecient backend technology.</p>
            </div>

            <div className="admin-card">
                <img src="https://avatars.githubusercontent.com/u/91214408?v=4" alt="Shikhar Shukla" className="admin-img" />
                <h2>Shikhar Shukla</h2>
                <p>
                    <strong>Role:</strong> Front - End - Developer
                </p>
                <p>Passionate about building intuitive UIs and efficient Frontend. Shikhar works on frontend architecture and ensures seamless integration of features.</p>
            </div>
        </div>
    );
};

export default Admins;
