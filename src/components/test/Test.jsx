

import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
// import style from './style.module.css';



export const Test = () => {

    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState("");
    const [chats, setChats] = useState([]);
    const [typing, setTyping] = useState(false);
    const [typingTimeOut, setTypingTimeOut] = useState(false);


    useEffect(() => {
        setSocket(io('http://localhost:2000'));
        console.log("socket", socket);

    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on("message-from-server", (data) => {
            setChats((prev) => [...prev, data.message]);
        });
        socket.on("typing-started-from-server", () => setTyping(true));
        socket.on("typing-stoped-from-server", () => setTyping(false));

    }, [socket]);



    const onChangeMessage = (e) => {
        setMessage(e.target.value);
        socket.emit("typing-started");

        if (typingTimeOut) clearTimeout(typingTimeOut);
        setTypingTimeOut(
            setTimeout(() => {
                socket.emit("typing-stoped");
            }, 1000)
        );
    }

    const onSendMessage = () => {
        socket.emit('send-message', { message });
        setMessage('');
    }

    return (
        <div>
            <div className="message">
                {
                    typing ? <div>typing</div> : <div></div>
                }
                {chats?.map((row, key) => {
                    return (
                        <div key={key}> {row}</div>
                    )
                })}
            </div>
            <input type="text" value={message} onChange={(e) => onChangeMessage(e)} />
            <button onClick={onSendMessage}>SendMessage</button>
        </div>
    )
}
