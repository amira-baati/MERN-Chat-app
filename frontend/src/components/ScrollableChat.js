import { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { 
  isLastMessage, 
  isSameSender, 
  isSameSenderMargin,
  isSameUser
 } from "../config/ChatLogics";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <>
      <style>
        {`
          .scrollable-chat-container {
            display: flex;
            flex-direction: column;
            overflow-y: scroll;
            height: 400px;
          }

          .message-container {
            display: flex;
          }

          .avatar {
            margin-top: 7px;
            margin-right: 8px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
          }

          .message {
            background-color: #b9f5d0;
            border-radius: 20px;
            padding: 5px 15px;
            max-width: 75%;
          }

          .user-message {
            background-color: #bee3f8;
          }

          .message-label {
            font-size: 12px;
            margin-bottom: 5px;
          }
        `}
      </style>

      <div className="scrollable-chat-container">
        {messages &&
          messages.map((m, i) => (
            <div className="message-container" key={m._id}>
              {(isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
                <div className="avatar-container" style={{ position: "relative" }}>
                  <span className="message-label">{m.sender.name}</span>
                  <img
                    src={m.sender.pic}
                    alt={m.sender.name}
                    className="avatar"
                  />
                </div>
              )}
              <span
                className={`message ${
                  m.sender._id === user._id ? "user-message" : ""
                }`}
                style={{
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                }}
              >
                {m.content}
              </span>
            </div>
          ))}
      </div>
    </>
  );
};

export default ScrollableChat;
