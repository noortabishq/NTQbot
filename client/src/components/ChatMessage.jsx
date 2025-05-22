import ChatbotIcon from "./ChatbotIcon";

const ChatMessage = ({ chat }) => {
    const cleanText = chat.text.replace(/\*/g, '').trim();

    return (
        !chat.hideInChat && (
            <div className={`message ${chat.role === "model" ? "bot" : "user"}-message ${chat.isError ? "error" : ""}`}>
                {chat.role === "model" && <ChatbotIcon />}
                <p className="message-text">{cleanText}</p>
            </div>
        )
    );
};

export default ChatMessage;
