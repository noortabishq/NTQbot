import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Chatbot from "./Chatbot";
import Hero from "./Hero";
import Toggle from "./Toggle";
const APP_URL = import.meta.env.VITE_API_URL;

const Home = () => {
    const [showChatbot, setShowChatbot] = useState(false);
    const handleToggleChat = () => {
        setShowChatbot((prev) => !prev);
    };

    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies([]);
    const [username, setUsername] = useState("");
    useEffect(() => {
        const verifyCookie = async () => {
            if (!cookies.token) {
                navigate("/login");
            }
            const { data } = await axios.post(
                `${APP_URL}`,
                {},
                { withCredentials: true }
            );
            const { status, user } = data;
            setUsername(user);
            return status
                ? toast(`Hello ${user}`, {
                    position: "top-right",
                })
                : (removeCookie("token"), navigate("/login"));
        };
        verifyCookie();
    }, [cookies, navigate, removeCookie]);
    const Logout = () => {
        removeCookie("token");
        navigate("/signup");
    };
    return (
        <div>
            <Hero onStartChat={handleToggleChat} />
            <button id="logout-btn" onClick={Logout}>LOGOUT</button>
            {showChatbot && <Chatbot setShowChatbot={setShowChatbot} />}
            <Toggle showChatbot={showChatbot} onToggleChat={handleToggleChat} />
            <ToastContainer />
        </div>
    );
};

export default Home;