import React, { useEffect, useState } from 'react';
import { Comments } from './Comments';
import { UpdateRequest } from '../../connector/APIsCommunicator';
import { APIsPath } from '../../connector/APIsPath';

export const ViewComments = (props) => {

    const [comments, setComments] = useState([]);
    const [mydetails, setMyDetails] = useState({});
    const [message, setMessage] = useState({});

    // ==================================================================

    useEffect(() => {
        console.log("props ------->>", props.row.comments);
        setMyDetails(JSON.parse(localStorage.getItem("user")) || {});
        setComments(props.comments);
    }, []);

    useEffect(() => {
        props.update(comments);

    }, [comments]);


    const onComment = (meg) => {
        meg.trimStart().trimEnd();
        let obj = {
            text: meg,
            postedBy: mydetails
        }
        setMessage(obj);
        setComments([...comments, obj]);
        onCreateCommenMessage(obj.text);
    }

    // ==============================================================

    const onCreateCommenMessage = (message) => {
        var reqObj = {
            body: {
                reelsid: props.row._id,
                text: message
            }
        };
        UpdateRequest(APIsPath.CommentReels, reqObj, parseCreateCommenMessageResponse, parseCreateCommenMessageError);
    }

    const parseCreateCommenMessageResponse = (resObj) => {
        if (resObj.status) {
        } else {
            setComments(comments.filter((i) => i.text !== message.text));
        }
        console.log("resObj.status", resObj.status);
    }

    const parseCreateCommenMessageError = (err) => {
        console.log("parseCreateCommenMessageError", err);
    }

    // ==================================================================

    return (
        <div className='view-comments-wapper'>


            <div className="view-comments">
               
                {comments.map((row, key) => {
                    if (row.postedBy._id === mydetails._id) {
                        return (
                            <div className="messsage-row right" style={{background:"#fff"}} key={key}>
                                <div className="msg-content">
                                    <div className="content">
                                        <div className="text ow">
                                            {row.text}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    } else {
                        return (
                            <div className={row.postedBy._id === mydetails._id ? "messsage-row right" : "messsage-row left"} key={key}>
                                <div className="msg-content" style={{background:"#fff"}}>
                                    <div className="profile">
                                        <img src={row.postedBy.profile} />
                                    </div>
                                    <div className="content">
                                        <div className="text ow" >
                                            {row.text}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                })}
            </div>

            <div className="keyborad-box" style={{ position: "sticky", top: "90%", zIndex: "999" }}>
                <Comments profile={mydetails.profile} onChange={(message) => onComment(message)} />
            </div>

        </div>
    )
}
