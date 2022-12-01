import { useState } from "react";
import { User } from "../Room";
import "./messages.css";

interface Message {
  message: string;
  user: User;
  createdAt: string;
}

interface MessagesProps {
  messages: Message[];
  onSendMessage: (message: string, user: User) => void;
  currentUser: User | null;
}

export const Messages = (props: MessagesProps) => {
  const { messages, onSendMessage, currentUser } = props;

  const [message, setMessage] = useState("");

  const formatDate = (date: string) => {
    const newDate = new Date(date);
    const hours = newDate.getHours();
    const minutes = newDate.getMinutes();
    return `${hours}:${minutes}`;
  };

  return (
    <div className="messages-container">
      <div className="messages-header">
        <h2>Messages</h2>
      </div>
      <div className="messages-content">
        {messages.map((message, index) => {
          return (
            <div
              key={index}
              className={
                message.user.id === currentUser?.id
                  ? "currentUser-message"
                  : "message"
              }
            >
              <div className="message-header">
                <p className="message-username">{message.user.name}</p>
                <p>{formatDate(message.createdAt)}</p>
              </div>
              <div className="message-content">
                <p>{message.message}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={message}
          placeholder="Enter your message"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={() => {
            onSendMessage(message, currentUser as User);
            setMessage("");
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};
