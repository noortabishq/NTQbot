import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Chatbot from "./Chatbot";
import Hero from "./Hero";
import Toggle from "./Toggle";

const APP_URL = import.meta.env.VITE_APP_URL;

const Home = () => {
    const [showChatbot, setShowChatbot] = useState(false);
    const handleToggleChat = () => {
        setShowChatbot((prev) => !prev);
    };

    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies([]);

    useEffect(() => {
        const verifyUser = async () => {
            if (!cookies.jwt) {
                navigate("/login");
            } else {
                const { data } = await axios.post(
                    `${APP_URL}`,
                    {},
                    {
                        withCredentials: true,
                    }
                );
                if (!data.status) {
                    removeCookie("jwt");
                    navigate("/login");
                } else {
                    const userName = data.user?.name || 'User';
                    toast(`Hello ${userName}`, {
                        theme: "dark",
                    });
                }
            }
        };
        verifyUser();
    }, [cookies, navigate, removeCookie]);

    const logOut = () => {
        removeCookie("jwt");
        navigate("/login");
    };

    return (
        <div>
            <Hero onStartChat={handleToggleChat} />
            <button id="logout-btn" onClick={logOut}>LOGOUT</button>
            {showChatbot && <Chatbot setShowChatbot={setShowChatbot} />}
            <Toggle showChatbot={showChatbot} onToggleChat={handleToggleChat} />
            <ToastContainer />
        </div>
    );
};

export default Home;
