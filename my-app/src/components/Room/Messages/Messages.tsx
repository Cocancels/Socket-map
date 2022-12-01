import { useState } from "react";
import { User } from "../Room";

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

  // function to transform date to proper format
  const formatDate = (date: string) => {
    const newDate = new Date(date);
    const hours = newDate.getHours();
    const minutes = newDate.getMinutes();
    return `${hours}:${minutes}`;
  };

  return (
    <div className="messages-container">
      <input
        type="text"
        value={message}
        placeholder="Enter your message"
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={() => onSendMessage(message, currentUser as User)}>
        Send
      </button>
      <div className="messages-content">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <p>
              <strong>
                {message.user.name} at {formatDate(message.createdAt)} :
              </strong>{" "}
              {message.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
