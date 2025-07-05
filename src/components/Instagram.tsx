import "./socials.css";

const Instagram = () => {
    return (
        <div className="socials-page">
            <h1>Follow the Developers on Instagram</h1>
            <div className="profile-card">
                <img src="https://avatars.githubusercontent.com/u/78887814?v=4" alt="Tanishq Oye" className="admin-img" />
                <h2>Tanishq Singh</h2>
                <a href="https://instagram.com/yahausernamedaldena" target="_blank" rel="noopener noreferrer">
                    📸 Follow on Instagram
                </a>
            </div>

            <div className="profile-card">
                <img src="https://avatars.githubusercontent.com/u/91214408?v=4" alt="Shikhar Shukla" className="admin-img" />
                <h2>Shikhar Shukla</h2>
                <a href="https://instagram.com/notoriousshuklaji" target="_blank" rel="noopener noreferrer">
                    📸 Follow on Instagram
                </a>
            </div>
        </div>
    );
};

export default Instagram;
