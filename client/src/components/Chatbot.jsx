import { useEffect, useRef, useState } from "react";
import ChatbotIcon from "./ChatbotIcon";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";
import { companyInfo } from "./CompanyInfo";
import closeImg from "../assets/Close.png";
import chatImg from "../assets/Chat.png";
import deleteImg from "../assets/Delete.png";

const APP_URL = import.meta.env.VITE_APP_URL;

const Chatbot = ({ setShowChatbot }) => {
    const chatBodyRef = useRef();
    const [chatHistory, setChatHistory] = useState(() => {
        const savedChatHistory = localStorage.getItem('chatHistory');
        return savedChatHistory ? JSON.parse(savedChatHistory) : [
            {
                hideInChat: true,
                role: "model",
                text: companyInfo,
            },
        ];
    });

    const [isResponseGenerating, setIsResponseGenerating] = useState(false);
    const [apiKey, setApiKey] = useState(null);

    useEffect(() => {
        const fetchApiKey = async () => {
            try {
                const response = await fetch(`${APP_URL}/api/get-api-key`);
                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }
                const data = await response.json();
                setApiKey(data.apiKey);
            } catch (error) {
                console.error("Error fetching API key:", error);
            }
        };

        fetchApiKey();
    }, []);

    const generateBotResponse = async (history) => {
        if (!apiKey) {
            console.error("API Key not available");
            return;
        }

        const updateHistory = (text, isError = false) => {
            setChatHistory((prev) => {
                const updatedHistory = [...prev.filter((msg) => msg.text !== "Thinking..."), { role: "model", text, isError }];
                localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
                return updatedHistory;
            });
        };

        history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: history }),
        };

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, requestOptions);
            const data = await response.json();
            if (!response.ok) throw new Error(data?.error.message || "Something went wrong!");

            const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\\(.?)\\*/g, "$1").trim();
            updateHistory(apiResponseText);
        } catch (error) {
            updateHistory(error.message, true);
        } finally {
            setIsResponseGenerating(false);
        }
    };

    const handleDeleteChatHistory = () => {
        setChatHistory([]);
        localStorage.removeItem('chatHistory');
    };

    useEffect(() => {
        chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
    }, [chatHistory]);

    return (
        <div className="container show-chatbot">
            <button onClick={() => setShowChatbot(false)} id="chatbot-toggler">
                <span className="material-symbols-rounded">
                    <img src={chatImg} alt="Chat" style={{ width: '22px', height: '22px' }} />
                </span>
                <span className="material-symbols-rounded">
                    <img src={closeImg} alt="Close" style={{ width: '22px', height: '22px' }} />
                </span>
            </button>

            <div className="chatbot-popup">
                <div className="chat-header">
                    <div className="header-info">
                        <ChatbotIcon />
                        <h2 className="logo-text">NTQbot</h2>
                    </div>
                    <div className="header-buttons">
                        <button onClick={handleDeleteChatHistory} className="material-symbols-rounded">
                            <img src={deleteImg} alt="Delete" style={{ width: '22px', height: '22px' }} />
                        </button>
                        <button onClick={() => setShowChatbot(false)} className="material-symbols-rounded">
                            <img src={closeImg} alt="Close" style={{ width: '22px', height: '22px' }} />
                        </button>
                    </div>
                </div>

                <div ref={chatBodyRef} className="chat-body">
                    <div className="message bot-message">
                        <ChatbotIcon />
                        <p className="message-text">
                            Hello!<br />How can I help you?
                        </p>
                    </div>

                    {chatHistory.map((chat, index) => (
                        <ChatMessage key={index} chat={chat} />
                    ))}
                </div>

                <div className="chat-footer">
                    <ChatForm
                        chatHistory={chatHistory}
                        setChatHistory={setChatHistory}
                        generateBotResponse={generateBotResponse}
                        isResponseGenerating={isResponseGenerating}
                        setIsResponseGenerating={setIsResponseGenerating}
                    />
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
