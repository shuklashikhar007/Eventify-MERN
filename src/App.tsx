import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Events from "./pages/Events";
import About from "./components/About";
import Contact from "./components/Contact";
import CreateEvent from "./pages/CreateEvent";
import Instagram from "./components/Instagram";
import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import LinkedIn from "./components/LinkedIn";
import GitHub from "./components/GitHub";
import Signup from "./pages/Signup";
import Admins from "./components/Admins";

import { useUserStore } from "@/store/user";
import { useEffect } from "react";

function App() {
    const refresh = useUserStore((s) => s.refresh);

    useEffect(() => {
        (async () => await refresh())();
    }, []);

    return (
        <div className="app-layout">
            <Header />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Events" element={<Events />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/CreateEvent" element={<CreateEvent />} />
                    <Route path="/Instagram" element={<Instagram />} />
                    <Route path="/Github" element={<GitHub />} />
                    <Route path="/LinkedIn" element={<LinkedIn />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/Signup" element={<Signup />} />
                    <Route path="/Admins" element={<Admins />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;
