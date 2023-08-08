import React, { useEffect, useState } from 'react'
import { GetRequest, PostRequest } from '../../connector/APIsCommunicator';
import { APIsPath } from '../../connector/APIsPath';

export const Shares = (props) => {

    const [shares, setShares] = useState([]);
    const [filterlist, setFilterList] = useState([]);
    const [users, setUsers] = useState([]);
    const [mydetails, setMyDetails] = useState({});

    // ==================================================================

    useEffect(() => {
        setMyDetails(JSON.parse(localStorage.getItem("user")) || {});
        getUsers();
    }, []);

    // ==================================================================
    const onShare = (e, row) => {
        console.log("props.type", props.type);
        if (props.type === "reels") {
            onSendReels(row);
        }

        if (props.type === "post") {

        }
    }
    // ==================================================================


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

    // ==================================================================

    const getAllConversationUser = () => {
        GetRequest(APIsPath.GetAllConversationUser, {}, parseGetConversationUserResponse, parseGetConversationUserError);
    }

    const parseGetConversationUserResponse = (resObj) => {
        console.log("resObj.data", resObj.data);
        setShares(resObj.data || []);
        if (!resObj.status) return;
    }

    const parseGetConversationUserError = (err) => {
        alert(err.message);
    }

    // ==================================================================



    const onSendReels = (row) => {
        let obj = {
            body: {
                conversationid: row._id,
                reelsid: props.row._id
            }
        };
        console.log("obj", obj);
        PostRequest(APIsPath.SendReels, obj, parseSendReelsResponse, parseSendReelsError);
    }

    const parseSendReelsResponse = (resObj) => {
        console.log("resObj-->", resObj);
    }

    const parseSendReelsError = (err) => {
        alert(err.message);
    }

    // ==================================================================

    return (
        <div className='shares-wapper'>
            <div className="search-wapper">
                <div className="search">
                    <input type="text" />
                </div>
            </div>
            <div className="shares-container">
                {shares.map((row, key) => {
                    if (row.participants[1].user._id !== mydetails._id) {
                        console.log("row.participants[1].user.profile",row.participants[1].user.profile);
                        return (
                            <div className="user-row" key={key} onClick={(e) => onShare(e, row)}>
                                <div className="profile">
                                    <img src={row.participants[1].user.profile} alt="" />
                                </div>
                                <div className="content">
                                    <div className="name">{row.participants[1].user.name}</div>
                                    <div className="send">
                                        send
                                    </div>
                                </div>
                            </div>
                        )
                    }
                })}
            </div>
        </div>
    )
}
