import "./socials.css";

const GitHub = () => {
    return (
        <div className="socials-page">
            <h1>Meet the Developers on GitHub</h1>
            <div className="profile-card">
                <h2>Tanishq Oye</h2>
                <a href="https://github.com/oyetanishq" target="_blank" rel="noopener noreferrer">
                    🐙 Visit GitHub
                </a>
                <img src="https://github-readme-stats.vercel.app/api?username=oyetanishq&show_icons=true&theme=radical" alt="Tanishq's GitHub Stats" className="github-card" />
            </div>
            <div className="profile-card">
                <h2>Shikhar Shukla</h2>
                <a href="https://github.com/shuklashikhar007" target="_blank" rel="noopener noreferrer">
                    🐙 Visit GitHub
                </a>
                <img src="https://github-readme-stats.vercel.app/api?username=shuklashikhar007&show_icons=true&theme=radical" alt="Shikhar's GitHub Stats" className="github-card" />
            </div>
        </div>
    );
};

export default GitHub;
