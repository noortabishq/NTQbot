import { useRef } from "react";
import myImage from '../assets/Send.png';

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse, isResponseGenerating, setIsResponseGenerating }) => {
    const inputRef = useRef();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();
        if (!userMessage || isResponseGenerating) return;

        setIsResponseGenerating(true);
        inputRef.current.value = "";

        setChatHistory((history) => [...history, { role: "user", text: userMessage }]);

        setTimeout(() => {
            setChatHistory((history) => [...history, { role: "model", text: "Thinking..." }]);
            generateBotResponse([...chatHistory, { role: "user", text: userMessage }]);
        }, 600);
    };

    return (
        <form onSubmit={handleFormSubmit} className="chat-form">
            <input ref={inputRef} placeholder="Message..." className="message-input" required />
            <button type="submit" id="send-message" className="material-symbols-rounded">
                <img src={myImage} alt="Send" style={{ width: '22px', height: '22px' }} />
            </button>
        </form>
    );
};

export default ChatForm;
