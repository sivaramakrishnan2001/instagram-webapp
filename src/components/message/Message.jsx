import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { GetRequest } from '../../connector/APIsCommunicator';
import { APIsPath } from '../../connector/APIsPath';
import { LocalStorageKeys } from '../../connector/AppConfig';
import { MessageBox } from '../../uielements/messagebox/MessageBox';
import { LeftSilder } from './LeftSilder';
import { StickyNotes } from '../stickynotes/StickyNotes';

export const Message = (props) => {

    const [selectedUser, setSelectedUser] = useState(undefined);
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

    // ==============================================================

    useEffect(() => {
        setSocket(props.socket);

    }, [props.socket]);

    useEffect(() => {
        console.log("socket", socket);
        if (!socket || !user) return;

        socket.emit('addUser', user._id);

        socket.on('getUsers', (users) => {
            console.log("users = ", users);

        });

        socket.on('getMessage', (data) => {
            console.log("data", data);
            let msg = {
                senderId: data.senderId,
                message: data.text,
                myself: false
            }

            setArrivalMessage(msg);
        })


    }, [socket]);

    useEffect(() => {
        console.log("arrivalMessage0", arrivalMessage, "selectedUser", selectedUser);

        if (arrivalMessage) {
            console.log("arrivalMessage", arrivalMessage);
            setMessages((prev) => [...prev, arrivalMessage]);

        }
    }, [arrivalMessage]);




    useEffect(() => {
        if (!selectedUser) return;
        onGetMessages();

    }, [selectedUser]);

    // ==============================================================

    const onSelectUser = (row) => {
        console.log("row", row);
        setSelectedUser(row);
    }

    // ==============================================================

    const onSend = (data) => {
        socket.emit("sendMessage", {
            senderId: user._id,
            // receiverId: selectedUser._id,
            text: data,
        });
    }

    // ==============================================================

    const onGetMessages = () => {
        GetRequest(APIsPath.GetMessages + "/" + JSON.parse(LocalStorageKeys.user)?._id + "/" + selectedUser?._id, {}, parseGetMessagesResponse, parseGetMessagesError);
    }

    const parseGetMessagesResponse = (resObj) => {
        if (resObj.status) {
            setMessages(resObj.data);
        } else {
            alert(resObj.message)
        }
    }

    const parseGetMessagesError = (err) => {
        alert(err.message);
    }

    // ==============================================================

    return (
        <div className='message-container'>
            {/* <StickyNotes /> */}
            <div className="left">
                <div className="header"></div>
                <LeftSilder onClick={onSelectUser} />
            </div>
            <div className="right">
                <div className="messages">
                    {/* {messages?.map((row, key) => {
                        return (
                            <div className={row?.myself ? "message right" : "message left"} key={key}>{row.message}</div>
                        )
                    })} */}
                </div>
                <MessageBox onSend={onSend} />
            </div>
        </div>
    )
}


