import "./Footer.css";
import { Link } from "react-router";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-left">
                    <p>&copy; {new Date().getFullYear()} (C)Eventify All rights reserved.</p>
                </div>
                <div className="footer-right">
                    <Link to="/LinkedIn">🔗 LinkedIn </Link>
                    <Link to="/Admins">🧑‍💼 Admins</Link>
                    <Link to="/GitHub">🐙 GitHub </Link>
                    <Link to="/Instagram">📸 Instagram</Link>
                </div>
            </div>
        </footer>
    );
}
