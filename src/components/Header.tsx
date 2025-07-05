import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./header.css";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);

    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleTheme = () => setIsDark(!isDark);

    return (
        <header className="header">
            <div className="container">
                <div className="logo">
                    <Link to="/">Eventify</Link>
                </div>

                <nav className={`nav ${isOpen ? "active" : ""}`}>
                    <Link to="/">Home</Link>
                    <Link to="/events">Events</Link>
                    <Link to="/about">About</Link>
                    <Link to="/contact">Contact</Link>
                    <Link to="/create" className="cta">
                        + Create Event
                    </Link>
                </nav>

                <div className="header-controls">
                    <button className="theme-toggle" onClick={toggleTheme}>
                        {isDark ? "🌙" : "☀️"}
                    </button>
                    <button className="menu-toggle" onClick={toggleMenu}>
                        ☰
                    </button>
                </div>
            </div>
        </header>
    );
}
