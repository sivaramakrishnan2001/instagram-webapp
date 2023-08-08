import React, { useEffect, useState } from 'react';
import { GetRequest, PostRequest } from '../../connector/APIsCommunicator';
import { APIsPath } from '../../connector/APIsPath';

export const LeftSilder2 = (props) => {

    const [string, setString] = useState('');
    const [users, setUsers] = useState([]);
    const [conversation, setConversation] = useState([]);
    const [mydestails, setMyDestails] = useState({});
    const [selecteduser, setSelectedUser] = useState({});


    // ==============================================================

    useEffect(() => {
        setMyDestails(JSON.parse(localStorage.getItem("user")) || {});
        getUsers();

    }, []);

    useEffect(() => {
        if (selecteduser) {
            let id = conversation.filter((i) => i._id === selecteduser._id)[0];
            console.log("id", id);
            if (id) {
                props.onClick && props.onClick(selecteduser);
            } else {
                if (selecteduser._id) {
                    createConversation();
                }
            }
        }

        props.onClick && props.onClick(selecteduser);

    }, [selecteduser]);


    // ==============================================================
    // onClick

    const onClickUser = (row) => {
        setSelectedUser(row);
    }

    // ==============================================================
    // API Call Funcions

    const createConversation = () => {
        console.log("CreateConversation");
        PostRequest(APIsPath.CreateConversation, {
            body: {
                conversationUserId: selecteduser._id
            }
        }, parsecreateConversationResponse, parsecreateConversationError);
    }

    const parsecreateConversationResponse = (resObj) => {
        console.log("resObj.status", resObj.status);
        if (resObj.status) {
            getAllConversationUser();
        }
    }

    const parsecreateConversationError = (err) => {
        alert(err.message);
    }

    // ==============================================================

    const getUsers = () => {
        GetRequest(APIsPath.GetUsers, {}, parseGetUsersResponse, parseGetUsersError);
    }

    const parseGetUsersResponse = (resObj) => {
        if (!resObj.status) return;
        setUsers(resObj.data);
        getAllConversationUser();
    }

    const parseGetUsersError = (err) => {
        alert(err.message);
    }

    // ==============================================================

    const getAllConversationUser = () => {
        GetRequest(APIsPath.GetAllConversationUser, {}, parseGetConversationUserResponse, parseGetConversationUserError);
    }

    const parseGetConversationUserResponse = (resObj) => {
        console.log("resObj.data", resObj.data);
        setConversation(resObj.data || []);
        if (!resObj.status) return;
    }

    const parseGetConversationUserError = (err) => {
        alert(err.message);
    }



    // ==============================================================
    if (!users) return "loading...";
    return (
        <section className="discussions">
            <div className="discussion search">
                <div className="searchbar">
                    <i className="fa fa-search" aria-hidden="true"></i>
                    <input type="text" placeholder="Search..." onChange={(e) => setString(e.target.value)} />
                </div>
            </div>
            {string ?
                <React.Fragment>
                    {users.map((row, key) => {
                        console.log("row/////////////", row);
                        if (row._id !== mydestails._id) {
                            return (
                                <div key={key} className={row._id === selecteduser?._id ? "discussion message-active" : "discussion"} onClick={() => onClickUser(row)}>
                                    {/* <div className="photo"
                                        style={{ backgroundImage: `url(${row?.participants[1].user.profile})` }}
                                    >
                                        <div className="online"></div>
                                    </div> */}
                                    <img className='photo' src={row?.participants[1].user.profile} alt="profile" />

                                    <div className="desc-contact">
                                        <p className="name">{row?.name}</p>
                                        <p className="message">9 pm at the bar if possible 😳</p>
                                    </div>
                                    <div className="timer">12 sec</div>
                                </div>
                            )
                        }
                    })}
                </React.Fragment>
                :
                <React.Fragment>
                    {conversation.map((row, key) => {
                        console.log("`url(${row?.participants[1].user.profile})`", `url(${row?.participants[1].user.profile})`);
                        if (row?.participants[1].user._id !== mydestails._id) {
                            return (
                                <div key={key} className={row._id === selecteduser?._id ? "discussion message-active" : "discussion"} onClick={() => onClickUser(row)}>
                                    {/* <div className="photo"
                                        style={{ backgroundImage: `url(${row?.participants[1].user.profile})` }}
                                    >
                                        <div className="online"></div>
                                    </div> */}
                                    <img className='photo' src={row?.participants[1].user.profile} alt="profile" />
                                    <div className="desc-contact">
                                        <p className="name">{row?.participants[1].user.name}</p>
                                        <p className="message"> {row?.lastmessage?.text}</p>
                                    </div>
                                    <div className="timer">12 sec</div>
                                </div>
                            )
                        }
                    })}
                </React.Fragment>
            }
        </section>
    )
}
