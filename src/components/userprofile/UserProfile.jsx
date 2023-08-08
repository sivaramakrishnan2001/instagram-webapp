import React, { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { GetRequest, PostRequest, UpdateRequest } from '../../connector/APIsCommunicator';
import { APIsPath } from '../../connector/APIsPath';
import { AppScreensKeys, ComponentsKeys, LocalStorageKeys, SessionStorageKeys } from '../../connector/AppConfig';
import { Comments } from '../comments/Comments';
import { Profile } from '../profile/Profile';
import { CustomRangeVideo } from '../customrange/CustomRange';

export const UserProfile = (props) => {

    const videoRef = useRef();
    const varstore = useRef();
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const searchparams = useSearchParams();
    const [user, setUser] = useState({});
    const [myid, setMyId] = useState("");
    const [post, setPost] = useState([]);
    const [reels, setReels] = useState([]);
    const [save, setSave] = useState([]);
    const [seletedtab, setSeletedTab] = useState('POSTS');
    const [playVideo, setPlayVideo] = useState(false);
    const [selectedpost, setSelectedPost] = useState(undefined);
    const [showmoreoptions, setShowMoreoptions] = useState(false);
    const [reload, setReload] = useState(false);
    const [paramid, setParamId] = useState("");
    const [mydetails, setMyDetails] = useState({});
    const [currentTime, setCurrentTime] = useState(0);



    // ==============================================================

    useEffect(() => {
        setMyDetails(JSON.parse(localStorage.getItem("user")));
    }, []);


    useEffect(() => {
        // sessionStorage.setItem(SessionStorageKeys.ActiveMenu,ComponentsKeys.PROFILE);
        setReload((ps) => !ps);
        videoRef.tabs = [
            {
                name: "POSTS",
                icon: <svg aria-label="Posts" className={"svg "} color="#0095f6" fill="#0095f6" height="24" role="img" viewBox="0 0 24 24" width="24">
                    <rect fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="18" x="3" y="3"></rect>
                    <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="9.015" x2="9.015" y1="3" y2="21"></line>
                    <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="14.985" x2="14.985" y1="3" y2="21"></line>
                    <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="9.015" y2="9.015"></line>
                    <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="14.985" y2="14.985"></line>
                </svg>,
            },
            {
                name: "REELS",
                icon: <svg aria-label="Reels" className={"svg "} color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                    <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="2.049" x2="21.95" y1="7.002" y2="7.002"></line>
                    <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="13.504" x2="16.362" y1="2.001" y2="7.002"></line>
                    <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="7.207" x2="10.002" y1="2.11" y2="7.002"></line><path d="M2 12.001v3.449c0 2.849.698 4.006 1.606 4.945.94.908 2.098 1.607 4.946 1.607h6.896c2.848 0 4.006-.699 4.946-1.607.908-.939 1.606-2.096 1.606-4.945V8.552c0-2.848-.698-4.006-1.606-4.945C19.454 2.699 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.546 2 5.704 2 8.552Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><path d="M9.763 17.664a.908.908 0 0 1-.454-.787V11.63a.909.909 0 0 1 1.364-.788l4.545 2.624a.909.909 0 0 1 0 1.575l-4.545 2.624a.91.91 0 0 1-.91 0Z" fillRule="evenodd"></path>
                </svg>,
            },
            {
                name: "SAVE",
                icon: <div className="icon">
                    <svg aria-label="Save" className={"svg "} color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                        <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
                    </svg>
                </div>,
            },
            {
                name: "LIKES",
                icon: <div className="icon">
                    <svg viewBox="0 0 24 24" className={"svg " + "unlike"}>
                        <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"></path>
                    </svg>
                </div>,
            }
        ]
        console.log("params.userId------{}->", params.userId);

        setSeletedTab('POSTS');
        setMyId(JSON.parse(localStorage.getItem("user"))?._id);
        setParamId(params.userId);
    }, [params.userId]);

    useEffect(() => {
        // if (myid === params.userId) {
        //     sessionStorage.setItem(SessionStorageKeys.ActiveMenu, ComponentsKeys.PROFILE);
        // } else {
        //     sessionStorage.setItem(SessionStorageKeys.ActiveMenu, ComponentsKeys.USERPROFILE);
        // }
        console.log("paramid-----", paramid);
        if (paramid) {
            onGetUser();
        }
    }, [paramid]);




    const onMoreOptions = (row) => {
        setSelectedPost(row);
        setShowMoreoptions(true)
    }

    const onLike = (post, userid, liked) => {
        console.log("liked..", liked);
        if (liked[0] !== undefined) {
            onUnLikePostApi(post._id, userid);
        } else {
            onLikePostApi(post._id, userid)
        }
    }

    const onSavePost = (id) => {
        onSavePostApiCall(id);
    }

    const onUnSavePost = (id) => {
        onUnSavePostApiCall(id);
    }

    const handleTimeUpdate = () => {
        setCurrentTime(varstore.videoRef.currentTime);
    };

    const onComment = (meg, row) => {
        meg.trimStart().trimEnd();
        row.comments.push(
            {
                text: meg,
                postedBy: mydetails
            }
        );
        setReload(ps => !ps);
        onCreateCommenMessage(row._id, meg);
    }

    // ==============================================================

    const onGetUser = () => {
        GetRequest(APIsPath.GetUser + paramid, {}, parseGetUserResponse, parseGetUserError);
    }

    const parseGetUserResponse = (resObj) => {
        if (resObj.status) {
            setUser(resObj.data);
            onGetPosts();
        }
    }

    const parseGetUserError = (err) => {
        console.log("err", err);
    }

    // ==============================================================

    const onGetPosts = () => {
        GetRequest(APIsPath.GetUserPost + paramid, {}, parseGetUserPostResponse, parseGetUserPostError);
    }

    const parseGetUserPostResponse = (resObj) => {
        if (resObj.status) {
            setPost(resObj.data);
            getAllReels();
        }
    }

    const parseGetUserPostError = (err) => {
        console.log("err", err);
    }

    // ==============================================================

    const getAllReels = () => {
        GetRequest(APIsPath.GetAllReels, {}, parseGetAllReelsResponse, parseGetAllReelsError);
    }

    const parseGetAllReelsResponse = (resObj) => {
        if (resObj.status) {
            setReels(resObj.data);
            onGetSave();
        }
    }

    const parseGetAllReelsError = (err) => {
        console.log("err", err);
    }

    // ==============================================================

    const onGetSave = () => {
        GetRequest(APIsPath.GetAllSave, {}, parseGetUserSaveResponse, parseGetUserSaveError);
    }

    const parseGetUserSaveResponse = (resObj) => {
        if (resObj.status) {
            setSave(resObj.data);
        }
        console.log(" setSave(resObj.data);", resObj.data);
    }

    const parseGetUserSaveError = (err) => {
        console.log("err", err);
    }



    // ==============================================================

    const onLikePostApi = (postid, userid) => {
        var reqObj = {
            body: {
                postid: postid,
                userid: userid._id,
                token: JSON.parse(LocalStorageKeys.token),
            }
        };
        UpdateRequest(APIsPath.LikePost, reqObj, parseLikePostResponse, parseLikePostError);
    }

    const parseLikePostResponse = (resObj) => {
        if (resObj.status) {
            onGetPosts();
        }
    }

    const parseLikePostError = (err) => {
        console.log("parseLikePostError", err);
    }

    // ==============================================================

    const onUnLikePostApi = (postid, user) => {
        var reqObj = {
            body: {
                postid: postid,
                userid: user._id,
                token: JSON.parse(LocalStorageKeys.token)
            }
        };
        UpdateRequest(APIsPath.UnLikePost, reqObj, parseUnLikePostResponse, parseUnLikePostError);

    }

    const parseUnLikePostResponse = (resObj) => {
        if (resObj.status) {
            onGetPosts();
        }
        console.log("parseUnLikePostResponse", resObj);

    }

    const parseUnLikePostError = (err) => {
        console.log("parseUnLikePostError", err);

    }

    const onSavePostApiCall = (id) => {
        var reqObj = {
            body: {
                postId: id,
            }
        };
        PostRequest(APIsPath.SavePost, reqObj, parseSavePostResponse, parseSavePostError);
    }

    const parseSavePostResponse = (resObj) => {
        if (resObj.status) {
        }
        console.log("parseSavePostResponse", resObj);
    }

    const parseSavePostError = (err) => {
        console.log("parseSavePostError", err);
    }

    const onUnSavePostApiCall = (id) => {
        var reqObj = {
            body: {
                postId: id,
            }
        };
        PostRequest(APIsPath.UnSavePost, reqObj, parseUnSavePostResponse, parseUnSavePostError);
    }

    const parseUnSavePostResponse = (resObj) => {
        if (resObj.status) {
        }
        console.log("parseUnSavePostResponse", resObj);
    }

    const parseUnSavePostError = (err) => {
        console.log("parseUnSavePostError", err);
    }

    // ==============================================================


    const onCreateCommenMessage = (id, message) => {
        var reqObj = {
            body: {
                postid: id,
                text: message
            }
        };
        UpdateRequest(APIsPath.CommentPost, reqObj, parseCreateCommenMessageResponse, parseCreateCommenMessageError);
    }

    const parseCreateCommenMessageResponse = (resObj) => {
        if (resObj.status) {
        }
        console.log("resObj.status", resObj.status);
    }

    const parseCreateCommenMessageError = (err) => {
        console.log("parseCreateCommenMessageError", err);
    }


    if (paramid === myid) {
        return (
            <Profile />
        )
    } else {
        return (
            <div className='user-profilepage'>
                <div className="header">
                    <div className="user">
                        <div className="user-profile">
                            <div className="border">
                                <img src={user.profile} />
                            </div>
                        </div>
                        <div className="user-bio">
                            {/* <div className="user-id">312312</div> */}
                            <div className="user-name">
                                <div>{user.name}</div>
                                {user?.followers?.some((i) => i._id === myid) ?
                                    <div>Following</div>
                                    : <div>Follow</div>
                                }
                                <div className="">Message</div>
                            </div>
                            <div className="content">
                                <div className="user-post"> {post.length + reels.length} posts </div>
                                <div className="followers"> {user.followers?.length} followers </div>
                                <div className="following"> {user.following?.length} following </div>
                            </div>
                            <div className="bio"></div>
                            <div className="website"></div>
                        </div>
                    </div>
                    <div className="highlights">
                        <div className="highlight"></div>
                        <div className="highlight"></div>
                        <div className="highlight"></div>
                        <div className="highlight"></div>
                        <div className="highlight"></div>
                    </div>
                </div>
                <div className="content">
                    <div className="tabs">
                        {videoRef?.tabs?.map((row, key) => {
                            return (
                                <div className="tab" key={key} onClick={() => setSeletedTab(row.name)}>
                                    <div className="icon">
                                        {row.icon}
                                    </div>
                                    {row.name}
                                </div>
                            )
                        })}
                    </div>
                    <div className="my-posts" >
                        {seletedtab === "POSTS" &&
                            <div className="posts" ref={varstore}>
                                {post?.map((row, key) => {
                                    var follower = row.likes.some((i) => {
                                        return i.followers.some((i) => {
                                            return i._id === mydetails._id
                                        })
                                    });
                                    var liked = row.likes?.filter((f) => f._id === JSON.parse(LocalStorageKeys.user)?._id);
                                    var save = row.save?.some((i) => i === JSON.parse(LocalStorageKeys.user)?._id);
                                    return (
                                        <div className={'post ' + key} key={key} >
                                            <div className="post-header">
                                                <div className="profile">
                                                    <div className="logo"
                                                    //  onClick={(e) => onNavigate(e, row.postedBy._id)}
                                                    >
                                                        <img src={row.postedBy?.profile} alt="profile" />
                                                    </div>
                                                    <div className="name">{row.postedBy.name}</div>
                                                </div>
                                                <div className="moreoptions" onClick={(e) => onMoreOptions(e, row)}>
                                                    <svg aria-label="More options" className={"svg "} color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                                                        <circle cx="12" cy="12" r="1.5"></circle><circle cx="6" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle>
                                                    </svg>
                                                </div>
                                            </div>

                                            {!row.audioplay ?
                                                <div className="audio-icon" title="muted" onClick={(e) => {
                                                    e.stopPropagation();
                                                    console.log("row.audioplay1", row.audioplay);

                                                    for (let index = 0; index < post.length; index++) {
                                                        if (index === key) {
                                                            if (row?.type === "video") {
                                                                varstore.current?.children[index]?.children[3]?.children[1]?.play();
                                                                post[index].audioplay = true;
                                                            } else {
                                                                post[index].audioplay = true;
                                                                console.log("post[index].audioplay", post[index].audioplay);
                                                                console.log("row.audioplay2", row.audioplay);
                                                                varstore?.current?.children[index]?.children[2]?.play();
                                                                varstore?.videoRef?.pause();
                                                            }

                                                        } else {
                                                            post[index].audioplay = false;
                                                            if (row?.type && row?.type === "video") {
                                                                varstore?.current?.children[index]?.children[3]?.children[1]?.pause();
                                                            } else {
                                                                varstore?.current?.children[index]?.children[2]?.pause();
                                                            }
                                                        }
                                                    }
                                                    console.log("row.audioplay", row.audioplay);
                                                    // row.audioplay = true;
                                                    setReload((ps) => !ps);
                                                }}>
                                                    <svg aria-label="Audo is muted." color="#ffffff" fill="#ffffff" height="12" role="img" viewBox="0 0 48 48" width="12">
                                                        <path clipRule="evenodd" d="M1.5 13.3c-.8 0-1.5.7-1.5 1.5v18.4c0 .8.7 1.5 1.5 1.5h8.7l12.9 12.9c.9.9 2.5.3 2.5-1v-9.8c0-.4-.2-.8-.4-1.1l-22-22c-.3-.3-.7-.4-1.1-.4h-.6zm46.8 31.4-5.5-5.5C44.9 36.6 48 31.4 48 24c0-11.4-7.2-17.4-7.2-17.4-.6-.6-1.6-.6-2.2 0L37.2 8c-.6.6-.6 1.6 0 2.2 0 0 5.7 5 5.7 13.8 0 5.4-2.1 9.3-3.8 11.6L35.5 32c1.1-1.7 2.3-4.4 2.3-8 0-6.8-4.1-10.3-4.1-10.3-.6-.6-1.6-.6-2.2 0l-1.4 1.4c-.6.6-.6 1.6 0 2.2 0 0 2.6 2 2.6 6.7 0 1.8-.4 3.2-.9 4.3L25.5 22V1.4c0-1.3-1.6-1.9-2.5-1L13.5 10 3.3-.3c-.6-.6-1.5-.6-2.1 0L-.2 1.1c-.6.6-.6 1.5 0 2.1L4 7.6l26.8 26.8 13.9 13.9c.6.6 1.5.6 2.1 0l1.4-1.4c.7-.6.7-1.6.1-2.2z" fillRule="evenodd"></path>
                                                    </svg>
                                                </div>
                                                :
                                                <div className={" audio-icon"} title='playing' onClick={(e) => {
                                                    e.stopPropagation();
                                                    for (let index = 0; index < post.length; index++) {
                                                        if (row.type && row.type === "video") {
                                                            varstore?.current?.children[index]?.children[3]?.children[1]?.pause();
                                                        } else {
                                                            varstore.current?.children[index]?.children[2]?.pause();
                                                        }
                                                    }
                                                    row.audioplay = false;
                                                    setReload((ps) => !ps);
                                                }}>
                                                    <svg aria-label="Audio is playing" className="x1lliihq x1n2onr6" color="rgb(255, 255, 255)" fill="rgb(255, 255, 255)" height="12" role="img" viewBox="0 0 24 24" width="12"><title>Audio is playing</title><path d="M16.636 7.028a1.5 1.5 0 1 0-2.395 1.807 5.365 5.365 0 0 1 1.103 3.17 5.378 5.378 0 0 1-1.105 3.176 1.5 1.5 0 1 0 2.395 1.806 8.396 8.396 0 0 0 1.71-4.981 8.39 8.39 0 0 0-1.708-4.978Zm3.73-2.332A1.5 1.5 0 1 0 18.04 6.59 8.823 8.823 0 0 1 20 12.007a8.798 8.798 0 0 1-1.96 5.415 1.5 1.5 0 0 0 2.326 1.894 11.672 11.672 0 0 0 2.635-7.31 11.682 11.682 0 0 0-2.635-7.31Zm-8.963-3.613a1.001 1.001 0 0 0-1.082.187L5.265 6H2a1 1 0 0 0-1 1v10.003a1 1 0 0 0 1 1h3.265l5.01 4.682.02.021a1 1 0 0 0 1.704-.814L12.005 2a1 1 0 0 0-.602-.917Z"></path></svg>
                                                </div>
                                            }


                                            <audio controls id="beep" >
                                                <source src={row.song?.song} type="audio/mp3" />
                                            </audio>
                                            <div className="post-content" style={{ cursor: "pointer" }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    row.audioplay = !row.audioplay;
                                                    setReload(ps => !ps);

                                                    if (row.audioplay === true) {
                                                        console.log("true-->");

                                                        for (let index = 0; index < post.length; index++) {
                                                            console.log("video ->", row?.type);
                                                            console.log("varstore?.current?.children[index]?.children[3]-->",varstore?.current?.children[index]?.children[3]?.children[1]);
                                                            if (row?.type === "video") {
                                                                if (key !== index) {
                                                                    varstore?.current?.children[index]?.children[3]?.children[1]?.pause();
                                                                    varstore.current.children[index].children[2].pause();
                                                                    post[index].audioplay = false;
                                                                } else {
                                                                    if (row.audioplay === false) {
                                                                        varstore?.current?.children[index]?.children[3]?.children[1]?.pause()
                                                                    } else {
                                                                        varstore?.current?.children[index]?.children[3]?.children[1]?.play()
                                                                    }
                                                                }
                                                            } else {
                                                                varstore.current.children[index].children[2].pause();
                                                                post[index].audioplay = false;
                                                            }
                                                        }
                                                        // varstore.videoRef.play();
                                                    } else {
                                                        console.log("false-->");
                                                        // varstore.videoRef.pause();
                                                        //   console.log("varstore?.current?.children[key]?.children[3]?.children[1]",varstore?.current?.children[key].children[3].children[0].pause());
                                                        varstore?.current?.children[key]?.children[3]?.children[0]?.pause();
                                                    }
                                                }}
                                            >
                                                {!row.audioplay && row?.type === "video" ? <div className="pause"></div> : ""}
                                                {row?.type === "video" ?
                                                    <video
                                                        className='video'
                                                        id='video'
                                                        ref={(elem) => varstore.videoRef = elem}
                                                        src={row.video}
                                                        onTimeUpdate={() => handleTimeUpdate()}
                                                    ></video>
                                                    :
                                                    <img src={row.photo} alt="post" width="300" height="300" />
                                                }
                                            </div>
                                            <div className="post-footer">
                                                <div className="footer-header">
                                                    <div className='icons like messages share'>
                                                        <span className="icon" onClick={() => onLike(row, mydetails, liked)}
                                                        >
                                                            {liked[0] ?
                                                                <svg className={"svg " + "like"} viewBox="0 0 24 24" >
                                                                    <path d="m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                                                                </svg>
                                                                : <svg viewBox="0 0 24 24" className={"svg " + "unlike"}>
                                                                    <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"></path>
                                                                </svg>}
                                                            {row.likes.length}

                                                        </span>
                                                        <span className='icon' onClick={(e) => {
                                                            e.stopPropagation();
                                                            row.isShowComments = !row.isShowComments;
                                                            setReload(ps => !ps);
                                                        }}>
                                                            <svg aria-label="Comment" className={"svg comments"} color="#262626" fill="#262626" height="20" role="img" viewBox="0 0 24 24" width="20">
                                                                <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
                                                            </svg>
                                                            {row.comments.length}
                                                        </span>
                                                        {/* 
                                    <span className='icon'>
                                        <svg aria-label="Share Post" className={"svg "} color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                                            <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line>
                                            <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon>
                                        </svg>
                                    </span> */}
                                                    </div>
                                                    {save ?
                                                        <div className="icon save " onClick={() => onUnSavePost(row._id)}>
                                                            <svg aria-label="Remove" className="x1lliihq x1n2onr6" color="rgb(0, 0, 0)" fill="rgb(0, 0, 0)" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Remove</title><path d="M20 22a.999.999 0 0 1-.687-.273L12 14.815l-7.313 6.912A1 1 0 0 1 3 21V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Z"></path></svg>
                                                        </div> :
                                                        <div className="icon save" onClick={() => onSavePost(row._id)}><svg aria-label="Save" className={"svg "} color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                                                            <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
                                                        </svg>
                                                        </div>
                                                    }
                                                </div>
                                                {!row.isShowComments &&
                                                    <div className="likes">
                                                        <div className="icons">
                                                            {row.likes.map((l, lk) => {
                                                                if (lk === 0 || lk === 1 || lk === 2) {
                                                                    return (
                                                                        <img src={l.profile} alt="" key={lk} />
                                                                    )
                                                                }
                                                            })}
                                                        </div>
                                                        Liked by {row.likes[0]?.name} and {row.likes.length}
                                                        <div onClick={() => {
                                                            row.likedusers = !row.likedusers;
                                                            setReload(ps => !ps);
                                                        }} style={{ paddingLeft: "5px", cursor: "pointer" }}> others</div>
                                                    </div>
                                                }

                                                {row?.likedusers &&
                                                    <div className="liked-users">
                                                        {row.likes.map((l, lk) => {
                                                            if (l._id === mydetails._id) {
                                                                return;
                                                            } else {
                                                                return (
                                                                    <div className="user" key={lk}>
                                                                        <img src={l.profile}
                                                                            // onClick={(e) => onNavigate(e, l._id)} 
                                                                            alt=""
                                                                            key={lk} />
                                                                        <div className="name">{l.name}</div>
                                                                        {follower ?
                                                                            <div className="btn">Unfollow</div>
                                                                            :
                                                                            <div className="btn">Follow</div>
                                                                        }
                                                                    </div>
                                                                )
                                                            }
                                                        })}
                                                    </div>
                                                }

                                                {/* <div className="body"></div> */}
                                                {row.isShowComments &&
                                                    <div className='comments'>
                                                        {row.comments.map((rw, key) => {
                                                            return (
                                                                <div className={rw.postedBy._id === mydetails._id ? 'message replay' : 'message'} key={key}
                                                                >
                                                                    <div className="message">
                                                                        {rw.postedBy._id === mydetails._id === false ?
                                                                            <React.Fragment>
                                                                                <div className="logo" style={{ marginLeft: "5px" }}>
                                                                                    <img src={rw.postedBy.profile} alt="profile" />
                                                                                </div>
                                                                                <div className="content">
                                                                                    <div className="id">{rw.postedBy.name}</div>
                                                                                    <div className="text">{rw.text}</div>
                                                                                </div>
                                                                            </React.Fragment>
                                                                            :
                                                                            <div className="content" style={{ marginRight: "10px", borderRadius: "5px", padding: "0px 10px", cursor: "pointer", background: "#7bc3ff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "30px", minWidth: "40px" }}>
                                                                                {/* <div className="id">{rw.postedBy.name}</div> */}
                                                                                <div className="text" style={{ textAlign: "center" }}>{rw.text}</div>
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                        <Comments profile={mydetails.profile} onChange={(message) => onComment(message, row)} />
                                                    </div>
                                                }


                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        }

                        {seletedtab === "REELS" &&
                            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", columnGap: "50px", rowGap: "20px", padding: "45px", width: "100%", position: "relative" }}>
                                {reels.map((row, key) => {
                                    return (
                                        <div className='all-reels' style={{ width: "330px", position: "relative" }} key={key}>
                                            <CustomRangeVideo row={row} type="reels" />
                                        </div>
                                    )
                                })}
                            </div>
                        }

                        {seletedtab === "SAVE" &&
                            <div className="posts" ref={varstore}>
                               {save?.map((row, key) => {
                                    var follower = row.likes.some((i) => {
                                        return i.followers.some((i) => {
                                            return i._id === mydetails._id
                                        })
                                    });
                                    var liked = row.likes?.filter((f) => f._id === JSON.parse(LocalStorageKeys.user)?._id);
                                    var save = row.save?.some((i) => i === JSON.parse(LocalStorageKeys.user)?._id);
                                    return (
                                        <div className={'post ' + key} key={key} >
                                            <div className="post-header">
                                                <div className="profile">
                                                    <div className="logo"
                                                    //  onClick={(e) => onNavigate(e, row.postedBy._id)}
                                                    >
                                                        <img src={row.postedBy?.profile} alt="profile" />
                                                    </div>
                                                    <div className="name">{row.postedBy.name}</div>
                                                </div>
                                                <div className="moreoptions" onClick={(e) => onMoreOptions(e, row)}>
                                                    <svg aria-label="More options" className={"svg "} color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                                                        <circle cx="12" cy="12" r="1.5"></circle><circle cx="6" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle>
                                                    </svg>
                                                </div>
                                            </div>

                                            {!row.audioplay ?
                                                <div className="audio-icon" title="muted" onClick={(e) => {
                                                    e.stopPropagation();
                                                    console.log("row.audioplay1", row.audioplay);

                                                    for (let index = 0; index < post.length; index++) {
                                                        if (index === key) {
                                                            if (row?.type === "video") {
                                                                varstore.current?.children[index]?.children[3]?.children[1]?.play();
                                                                post[index].audioplay = true;
                                                            } else {
                                                                post[index].audioplay = true;
                                                                console.log("post[index].audioplay", post[index].audioplay);
                                                                console.log("row.audioplay2", row.audioplay);
                                                                varstore?.current?.children[index]?.children[2]?.play();
                                                                varstore?.videoRef?.pause();
                                                            }

                                                        } else {
                                                            post[index].audioplay = false;
                                                            if (row?.type && row?.type === "video") {
                                                                varstore?.current?.children[index]?.children[3]?.children[1]?.pause();
                                                            } else {
                                                                varstore?.current?.children[index]?.children[2]?.pause();
                                                            }
                                                        }
                                                    }
                                                    console.log("row.audioplay", row.audioplay);
                                                    // row.audioplay = true;
                                                    setReload((ps) => !ps);
                                                }}>
                                                    <svg aria-label="Audo is muted." color="#ffffff" fill="#ffffff" height="12" role="img" viewBox="0 0 48 48" width="12">
                                                        <path clipRule="evenodd" d="M1.5 13.3c-.8 0-1.5.7-1.5 1.5v18.4c0 .8.7 1.5 1.5 1.5h8.7l12.9 12.9c.9.9 2.5.3 2.5-1v-9.8c0-.4-.2-.8-.4-1.1l-22-22c-.3-.3-.7-.4-1.1-.4h-.6zm46.8 31.4-5.5-5.5C44.9 36.6 48 31.4 48 24c0-11.4-7.2-17.4-7.2-17.4-.6-.6-1.6-.6-2.2 0L37.2 8c-.6.6-.6 1.6 0 2.2 0 0 5.7 5 5.7 13.8 0 5.4-2.1 9.3-3.8 11.6L35.5 32c1.1-1.7 2.3-4.4 2.3-8 0-6.8-4.1-10.3-4.1-10.3-.6-.6-1.6-.6-2.2 0l-1.4 1.4c-.6.6-.6 1.6 0 2.2 0 0 2.6 2 2.6 6.7 0 1.8-.4 3.2-.9 4.3L25.5 22V1.4c0-1.3-1.6-1.9-2.5-1L13.5 10 3.3-.3c-.6-.6-1.5-.6-2.1 0L-.2 1.1c-.6.6-.6 1.5 0 2.1L4 7.6l26.8 26.8 13.9 13.9c.6.6 1.5.6 2.1 0l1.4-1.4c.7-.6.7-1.6.1-2.2z" fillRule="evenodd"></path>
                                                    </svg>
                                                </div>
                                                :
                                                <div className={" audio-icon"} title='playing' onClick={(e) => {
                                                    e.stopPropagation();
                                                    for (let index = 0; index < post.length; index++) {
                                                        if (row.type && row.type === "video") {
                                                            varstore?.current?.children[index]?.children[3]?.children[1]?.pause();
                                                        } else {
                                                            varstore.current?.children[index]?.children[2]?.pause();
                                                        }
                                                    }
                                                    row.audioplay = false;
                                                    setReload((ps) => !ps);
                                                }}>
                                                    <svg aria-label="Audio is playing" className="x1lliihq x1n2onr6" color="rgb(255, 255, 255)" fill="rgb(255, 255, 255)" height="12" role="img" viewBox="0 0 24 24" width="12"><title>Audio is playing</title><path d="M16.636 7.028a1.5 1.5 0 1 0-2.395 1.807 5.365 5.365 0 0 1 1.103 3.17 5.378 5.378 0 0 1-1.105 3.176 1.5 1.5 0 1 0 2.395 1.806 8.396 8.396 0 0 0 1.71-4.981 8.39 8.39 0 0 0-1.708-4.978Zm3.73-2.332A1.5 1.5 0 1 0 18.04 6.59 8.823 8.823 0 0 1 20 12.007a8.798 8.798 0 0 1-1.96 5.415 1.5 1.5 0 0 0 2.326 1.894 11.672 11.672 0 0 0 2.635-7.31 11.682 11.682 0 0 0-2.635-7.31Zm-8.963-3.613a1.001 1.001 0 0 0-1.082.187L5.265 6H2a1 1 0 0 0-1 1v10.003a1 1 0 0 0 1 1h3.265l5.01 4.682.02.021a1 1 0 0 0 1.704-.814L12.005 2a1 1 0 0 0-.602-.917Z"></path></svg>
                                                </div>
                                            }


                                            <audio controls id="beep" >
                                                <source src={row.song?.song} type="audio/mp3" />
                                            </audio>
                                            <div className="post-content" style={{ cursor: "pointer" }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    row.audioplay = !row.audioplay;
                                                    setReload(ps => !ps);

                                                    if (row.audioplay === true) {
                                                        console.log("true-->");

                                                        for (let index = 0; index < post.length; index++) {
                                                            console.log("video ->", row?.type);
                                                            console.log("varstore?.current?.children[index]?.children[3]-->",varstore?.current?.children[index]?.children[3]?.children[1]);
                                                            if (row?.type === "video") {
                                                                if (key !== index) {
                                                                    varstore?.current?.children[index]?.children[3]?.children[1]?.pause();
                                                                    varstore.current.children[index].children[2].pause();
                                                                    post[index].audioplay = false;
                                                                } else {
                                                                    if (row.audioplay === false) {
                                                                        varstore?.current?.children[index]?.children[3]?.children[1]?.pause()
                                                                    } else {
                                                                        varstore?.current?.children[index]?.children[3]?.children[1]?.play()
                                                                    }
                                                                }
                                                            } else {
                                                                varstore.current.children[index].children[2].pause();
                                                                post[index].audioplay = false;
                                                            }
                                                        }
                                                        // varstore.videoRef.play();
                                                    } else {
                                                        console.log("false-->");
                                                        // varstore.videoRef.pause();
                                                        //   console.log("varstore?.current?.children[key]?.children[3]?.children[1]",varstore?.current?.children[key].children[3].children[0].pause());
                                                        varstore?.current?.children[key]?.children[3]?.children[0]?.pause();
                                                    }
                                                }}
                                            >
                                                {!row.audioplay && row?.type === "video" ? <div className="pause"></div> : ""}
                                                {row?.type === "video" ?
                                                    <video
                                                        className='video'
                                                        id='video'
                                                        ref={(elem) => varstore.videoRef = elem}
                                                        src={row.video}
                                                        onTimeUpdate={() => handleTimeUpdate()}
                                                    ></video>
                                                    :
                                                    <img src={row.photo} alt="post" width="300" height="300" />
                                                }
                                            </div>
                                            <div className="post-footer">
                                                <div className="footer-header">
                                                    <div className='icons like messages share'>
                                                        <span className="icon" onClick={() => onLike(row, mydetails, liked)}
                                                        >
                                                            {liked[0] ?
                                                                <svg className={"svg " + "like"} viewBox="0 0 24 24" >
                                                                    <path d="m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                                                                </svg>
                                                                : <svg viewBox="0 0 24 24" className={"svg " + "unlike"}>
                                                                    <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"></path>
                                                                </svg>}
                                                            {row.likes.length}

                                                        </span>
                                                        <span className='icon' onClick={(e) => {
                                                            e.stopPropagation();
                                                            row.isShowComments = !row.isShowComments;
                                                            setReload(ps => !ps);
                                                        }}>
                                                            <svg aria-label="Comment" className={"svg comments"} color="#262626" fill="#262626" height="20" role="img" viewBox="0 0 24 24" width="20">
                                                                <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
                                                            </svg>
                                                            {row.comments.length}
                                                        </span>
                                                        {/* 
                                    <span className='icon'>
                                        <svg aria-label="Share Post" className={"svg "} color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                                            <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line>
                                            <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon>
                                        </svg>
                                    </span> */}
                                                    </div>
                                                    {save ?
                                                        <div className="icon save " onClick={() => onUnSavePost(row._id)}>
                                                            <svg aria-label="Remove" className="x1lliihq x1n2onr6" color="rgb(0, 0, 0)" fill="rgb(0, 0, 0)" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Remove</title><path d="M20 22a.999.999 0 0 1-.687-.273L12 14.815l-7.313 6.912A1 1 0 0 1 3 21V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Z"></path></svg>
                                                        </div> :
                                                        <div className="icon save" onClick={() => onSavePost(row._id)}><svg aria-label="Save" className={"svg "} color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                                                            <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
                                                        </svg>
                                                        </div>
                                                    }
                                                </div>
                                                {!row.isShowComments &&
                                                    <div className="likes">
                                                        <div className="icons">
                                                            {row.likes.map((l, lk) => {
                                                                if (lk === 0 || lk === 1 || lk === 2) {
                                                                    return (
                                                                        <img src={l.profile} alt="" key={lk} />
                                                                    )
                                                                }
                                                            })}
                                                        </div>
                                                        Liked by {row.likes[0]?.name} and {row.likes.length}
                                                        <div onClick={() => {
                                                            row.likedusers = !row.likedusers;
                                                            setReload(ps => !ps);
                                                        }} style={{ paddingLeft: "5px", cursor: "pointer" }}> others</div>
                                                    </div>
                                                }

                                                {row?.likedusers &&
                                                    <div className="liked-users">
                                                        {row.likes.map((l, lk) => {
                                                            if (l._id === mydetails._id) {
                                                                return;
                                                            } else {
                                                                return (
                                                                    <div className="user" key={lk}>
                                                                        <img src={l.profile}
                                                                            // onClick={(e) => onNavigate(e, l._id)} 
                                                                            alt=""
                                                                            key={lk} />
                                                                        <div className="name">{l.name}</div>
                                                                        {follower ?
                                                                            <div className="btn">Unfollow</div>
                                                                            :
                                                                            <div className="btn">Follow</div>
                                                                        }
                                                                    </div>
                                                                )
                                                            }
                                                        })}
                                                    </div>
                                                }

                                                {/* <div className="body"></div> */}
                                                {row.isShowComments &&
                                                    <div className='comments'>
                                                        {row.comments.map((rw, key) => {
                                                            return (
                                                                <div className={rw.postedBy._id === mydetails._id ? 'message replay' : 'message'} key={key}
                                                                >
                                                                    <div className="message">
                                                                        {rw.postedBy._id === mydetails._id === false ?
                                                                            <React.Fragment>
                                                                                <div className="logo" style={{ marginLeft: "5px" }}>
                                                                                    <img src={rw.postedBy.profile} alt="profile" />
                                                                                </div>
                                                                                <div className="content">
                                                                                    <div className="id">{rw.postedBy.name}</div>
                                                                                    <div className="text">{rw.text}</div>
                                                                                </div>
                                                                            </React.Fragment>
                                                                            :
                                                                            <div className="content" style={{ marginRight: "10px", borderRadius: "5px", padding: "0px 10px", cursor: "pointer", background: "#7bc3ff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "30px", minWidth: "40px" }}>
                                                                                {/* <div className="id">{rw.postedBy.name}</div> */}
                                                                                <div className="text" style={{ textAlign: "center" }}>{rw.text}</div>
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                        <Comments profile={mydetails.profile} onChange={(message) => onComment(message, row)} />
                                                    </div>
                                                }


                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }

}
