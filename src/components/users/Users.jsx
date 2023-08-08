import React, { useEffect, useState } from 'react';
import { GetRequest, PostRequest, UpdateRequest } from '../../connector/APIsCommunicator';
import { APIsPath } from '../../connector/APIsPath';
import { AppScreensKeys, ComponentsKeys } from '../../connector/AppConfig';
import { useNavigate } from 'react-router-dom';

export const Users = () => {

    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [reload, setReload] = useState(false);
    const [myid, setmyid] = useState("");

    // ==============================================================

    useEffect(() => {
        setmyid(JSON.parse(localStorage.getItem("user"))?._id);
        onGetAllUsers();

    }, []);

    const onFollow = (e, row) => {
        e.stopPropagation();
        let user = JSON.parse(localStorage.getItem("user"));
        row.followers.push(user);
        setReload(ps => !ps);
        console.log("rowrow", row);
        follow(row._id);
    }

    const onUnFollow = (e, row) => {
        e.stopPropagation();
        var user = JSON.parse(localStorage.getItem("user"));
        var users = row.followers.filter((i) => i._id !== user._id);
        row.followers = users;
        setReload(ps => !ps);
        unFollow(row._id);
    }

    // ==============================================================
    // APIs

    const follow = (id) => {
        console.log("id", id);
        var obj = {
            body: {
                id: id,
            }
        }

        console.log("obj", obj);
        // + "/" + "?token=" + token,
        UpdateRequest(APIsPath.Follow, obj, followResponse, followError);
    }

    const followResponse = (resObj) => {
        console.log("resObj", resObj);
    }

    const followError = (err) => {
        console.log("err", err);
    }

    const unFollow = (id) => {
        var obj = {
            body: {
                id: id,
            }
        };
        UpdateRequest(
            APIsPath.UnFollow,
            obj,
            (resObj) => {
            }, (err) => {
            }
        );
    }


    const onGetAllUsers = () => {
        var reqObj = {};
        GetRequest(APIsPath.GetUsers, reqObj, parseGetAllUsersResponse, parseGetAllUsersError);
    }

    const parseGetAllUsersResponse = (resObj) => {
        if (resObj.status) {
            setUsers(resObj.data);
        }
    }

    const parseGetAllUsersError = (err) => {
        console.log("parseGetAllUsersError", err);
    }

    // ==============================================================

    return (
        <div className='users' style={{ paddingLeft: "80px", paddingRight: "25px" }}>
            <div style={{ paddingBottom: "20px" }}>Suggested for you</div>
            {users.map((row, key) => {
                var followers = row.followers.some((i) => i._id === myid);
                var following = row.following.some((i) => i._id === myid);
                if (row._id !== myid) {
                    return (
                        <div className="user" style={{ width: "100%", border: "none" }}

                            key={key}>
                            <div className="profile" style={{ width: "25%" }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (myid === row._id) {
                                        navigate(AppScreensKeys.Home + "/" + ComponentsKeys.PROFILE + "/" + row._id, {
                                            state: {
                                                userId: row._id
                                            }
                                        });
                                    } else {
                                        navigate(AppScreensKeys.Home + "/" + ComponentsKeys.USERPROFILE + "/" + row._id, {
                                            state: {
                                                userId: row._id
                                            }
                                        });
                                    }
                                }}
                            >
                                <img src={row.profile} alt="profile" />
                            </div>
                            <div className="content" style={{ width: "50%" }}>
                                <div className="name" style={{textOverflow:"none"}}>{row.name}</div>
                            </div>
                            <div className="follow" style={{ width: "25%" }}>
                                {followers ?
                                    <div className='' onClick={(e) => onUnFollow(e, row)}>unfollow</div>
                                    :
                                    <div className='' onClick={(e) => onFollow(e, row)}>follow</div>
                                }
                            </div>
                        </div>
                    )
                }
            })}
        </div>
    )
}
