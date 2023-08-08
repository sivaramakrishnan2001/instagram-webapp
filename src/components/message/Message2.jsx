import React, { useEffect, useState } from 'react';
import "./message2.css";
import { LeftSilder2 } from './LeftSilder2';
import { APIsPath } from '../../connector/APIsPath';
import { GetRequest, PostRequest } from '../../connector/APIsCommunicator';
import { Comments } from '../comments/Comments';
import { CustomRangeVideo } from '../customrange/CustomRange';

export const Message2 = (props) => {
    const [selectedUser, setSelectedUser] = useState(undefined);
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [user, setUser] = useState();
    const [mydestails, setMyDestails] = useState({});
    const [reload, setReload] = useState(false);

    // ==============================================================

    useEffect(() => {
        setMyDestails(JSON.parse(localStorage.getItem("user")));


    }, []);

    useEffect(() => {
        setSocket(props.socket);

    }, [props.socket]);

    useEffect(() => {
        console.log("socket", socket);
        if (!socket || !mydestails) return;

        socket.emit('addUser', mydestails._id);

        socket.on('getUsers', (users) => {
            console.log("users = ", users);

        });

        socket.on('getMessage', (data) => {
            console.log("data-------->", data);
            let msg = {
                senderId: data.senderId,
                message: data.text,
                myself: false
            }
            let obj = {
                text: data.text,
                imgUrl: '',
                videoUrl: '',
                file: '',
                filename: '',
                type: '',
                sender: {
                    _id: data.senderId
                }
            };

            console.log("obj---->", obj);
            setMessages((prevMessages) => [...prevMessages, obj]);

            setArrivalMessage(msg);
        });




    }, [socket]);

    // useEffect(() => {
    //     console.log("arrivalMessage0", arrivalMessage, "selectedUser", selectedUser);

    //     if (arrivalMessage) {
    //         console.log("arrivalMessage", arrivalMessage);
    //         setMessages((prev) => [...prev, arrivalMessage]);

    //     }
    // }, [arrivalMessage]);



    useEffect(() => {
        console.log("selectedUser", selectedUser);
        if (!selectedUser?._id) return;
        onGetMessages();
    }, [selectedUser]);

    // ==============================================================

    const onSelectUser = (row) => {
        console.log("row", row);
        setSelectedUser(row);
    }

    const onComment = (text) => {
        let obj = {
            text,
            imgUrl: '',
            videoUrl: '',
            file: '',
            filename: '',
            type: '',
            sender: mydestails,
            conversationid: selectedUser?._id
        };
        let obj1 = {
            sender: mydestails,
            conversationid: selectedUser,
            content: {
                text,
                imgUrl: '',
                videoUrl: '',
                file: '',
                filename: '',
                type: '',
            }
        }
        messages.push(obj1);
        socket.emit("sendMessage", {
            senderId: mydestails._id,
            receiverId: selectedUser?.participants[1]?.user?._id,
            text: text,
        });
        console.log("onSendMessage1");

        if (obj.text && obj.conversationid && obj.sender._id) {
            console.log("onSendMessage", obj);

            onSendMessage(obj);
        }


        // setReload((ps) => !ps);
        console.log("onComment obj", obj);
    }



    // ==============================================================

    const onSendMessage = (data) => {
        data.sender = undefined
        let obj = {
            body: data
        }
        console.log("data", data);
        PostRequest(APIsPath.CreateMessages, obj, parseSendMessageResponse, parseSendMessageError);
    }

    const parseSendMessageResponse = (resObj) => {
        if (resObj.status) {
            console.log("resObj", resObj);
        } else {
            alert(resObj.message)
        }
    }

    const parseSendMessageError = (err) => {
        alert(err.message);
    }

    // ==============================================================

    const onGetMessages = () => {
        GetRequest(APIsPath.GetConversationMessages + selectedUser?._id, {}, parseGetMessagesResponse, parseGetMessagesError);
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
        <div className="container">
            <div className="" style={{ display: 'flex', alignItems: "start" }}>
                {/* <nav className="menu">
                    <ul className="items">
                        <li className="item">
                            <i className="fa fa-home" aria-hidden="true"></i>
                        </li>
                        <li className="item">
                            <i className="fa fa-user" aria-hidden="true"></i>
                        </li>
                        <li className="item">
                            <i className="fa fa-pencil" aria-hidden="true"></i>
                        </li>
                        <li className="item item-active">
                            <i className="fa fa-commenting" aria-hidden="true"></i>
                        </li>
                        <li className="item">
                            <i className="fa fa-file" aria-hidden="true"></i>
                        </li>
                        <li className="item">
                            <i className="fa fa-cog" aria-hidden="true"></i>
                        </li>
                    </ul>
                </nav> */}
                <LeftSilder2 onClick={(row) => onSelectUser(row)} />
                <section className="chat" style={{ display: 'flex', flexDirection: "column", width: "100%" }}>
                    <div className="header-chat">
                        <i className="icon fa fa-user-o" aria-hidden="true"></i>
                        <p className="name">{selectedUser && selectedUser?.participants && selectedUser?.participants[1]?.user?.name}</p>
                        <i className="icon clickable fa fa-ellipsis-h right" aria-hidden="true"></i>
                    </div>
                    <div className="messages-chat" style={{ overflowY: "scroll", minHeight: "400px", height: "550px" }}>

                        {messages.map((row, key) => {
                            if (row.sender?._id === mydestails._id) {
                                return (
                                    <React.Fragment key={key}>
                                        {row.reels ?
                                            <div className="message right" style={{ justifyContent: "end" }}>
                                                <div className="all-reels" >
                                                    <CustomRangeVideo row={row.reels} type="reels" />
                                                </div>
                                            </div>
                                            :
                                            <div className="message text-only left" key={key}>
                                                <div className="response">
                                                    <p className="text"> {row?.content?.text}</p>
                                                </div>
                                                {/* <p className="text"> {row.text}</p> */}
                                            </div>
                                        }

                                    </React.Fragment>
                                )
                            } else {
                                return (
                                    <React.Fragment key={key}>
                                        {row.reels ?
                                            <div className="all-post all-reels" style={{ justifyContent: "start" }}>
                                                <CustomRangeVideo row={row.reels} type="reels" />
                                            </div>
                                            :
                                            <div className="message" key={key}>
                                                <div className="photo"
                                                    style={{ backgroundImage: `url(${row.sender.profile})` }}
                                                >
                                                    <div className="online"></div>
                                                </div>
                                                <p className="text">{row?.content?.text}</p>
                                            </div>}
                                    </React.Fragment>
                                )
                            }

                        })}
                    </div>

                    <div className="chat-footer" >
                        <Comments profile={mydestails.profile} onChange={(message) => onComment(message)} />
                    </div>
                </section>
            </div>
        </div>
    )
}
