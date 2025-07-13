import { useEffect } from "react";
import { Routes, Route } from "react-router";
import { useUserStore } from "@/store/user";
import { Loader } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import About from "@/components/About";
import Contact from "@/components/ContactUs";
import Instagram from "@/components/Instagram";
import LinkedIn from "@/components/LinkedIn";
import GitHub from "@/components/GitHub";
import Admins from "@/components/Admins";

import Home from "@/pages/Home";
import Events from "@/pages/Events";
import CreateEvent from "@/pages/CreateEvent";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import SaveToken from "@/pages/save-token";
import EventPage from "@/pages/event";
import EditEvent from "@/pages/edit-event";
import NotFound from "@/pages/not-found";
import Message from "@/pages/message";

function App() {
    const { refresh, isLoading } = useUserStore();

    useEffect(() => {
        (async () => await refresh())();
    }, []);

    if (isLoading)
        return (
            <div className="min-h-dvh w-full flex flex-col gap-2 justify-center items-center">
                <Loader className="size-6 animate-spin" />
                <span className="text-xs sm:text-sm animate-pulse">please wait</span>
            </div>
        );

    return (
        <div className="app-layout">
            <Header />
            <main className="main-content flex justify-center items-center">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/save-token/:token" element={<SaveToken />} />
                    <Route path="/Events" element={<Events />} />
                    <Route path="/event/:event_id" element={<EventPage />} />
                    <Route path="/edit-event/:event_id" element={<EditEvent />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/CreateEvent" element={<CreateEvent />} />
                    <Route path="/Instagram" element={<Instagram />} />
                    <Route path="/Github" element={<GitHub />} />
                    <Route path="/LinkedIn" element={<LinkedIn />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/Signup" element={<Signup />} />
                    <Route path="/Admins" element={<Admins />} />
                    <Route path="/message/:text" element={<Message />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;
