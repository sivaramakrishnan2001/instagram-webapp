import React, { useEffect, useRef, useState } from 'react';
import { UpdateRequest } from '../../connector/APIsCommunicator';
import { APIsPath } from '../../connector/APIsPath';
import { DrawerPopup } from '../drawerpopup/DrawerPopup';
import { MoreOptions } from '../post/popups/MoreOptions';
import { DrawerPopupPosition, DrawerPopupSize } from '../../connector/AppConfig';
import { ViewComments } from '../comments/ViewComments';
import { Shares } from '../shares/Shares';

export const CustomRangeVideo = (props) => {

    const videoRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [myid, setMyId] = useState("");
    const [likes, setLikes] = useState([]);
    const [comments, setComments] = useState([]);
    const [like, setLike] = useState(false);
    const [showmoreoptions, setShowMoreoptions] = useState(false);
    const [showcomments, setShowComments] = useState(false);
    const [selectedpost, setSelectedPost] = useState(undefined);
    const [showshares, setShowShares] = useState(false);
    const [rload, setRload] = useState(false);

    // ==============================================================

    useEffect(() => {
        setMyId(JSON.parse(localStorage.getItem("user"))?._id || "");
        setLikes(props.row.likes || []);
        setComments(props.row.comments || []);
    }, []);

    useEffect(() => {
        setLike(props.row.likes.some((i) => i._id === myid));

    }, [likes])



    // ==============================================================
    // onClick

    const onMoreOptions = (e, row) => {
        e.stopPropagation();
        setSelectedPost(row);
        setShowMoreoptions(true)
    }

    const onOuterClick = () => {
        setShowMoreoptions(false);
    }

    // ==============================================================
    // onChange

    const handleRangeChange = (e) => {
        const time = parseFloat(e.target.value);
        setCurrentTime(time);
        videoRef.current.currentTime = time;
    };

    // ==============================================================

    const handlePlayPause = (e) => {
        e.stopPropagation();
        setIsPlaying((prevState) => !prevState);
        if (!isPlaying) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    };

    const handleTimeUpdate = () => {
        setCurrentTime(videoRef.current.currentTime);
    };


    const onLike = (e) => {
        e.stopPropagation();
        if (props.type === "reels") {
            setLikes([...likes, JSON.parse(localStorage.getItem("user"))]);
            onReelsLike();
        } else {
            onStoryLike();
        }
    }

    const onUnlike = (e) => {
        e.stopPropagation();


        if (props.type === "reels") {
            setLikes(likes.filter((i) => i._id !== myid));
            onReelsUnLike();
        } else {
            onStoryUnlike();
        }
    }

    const update = (v) => {
        setComments(v);
        setRload(ps => !ps);
    }

    const updateShares = (v) => {

    }



    // ==============================================================

    const onStoryLike = () => {
        var reqObj = {
            body: {
                postid: props.row._id
            }
        };
        UpdateRequest(APIsPath.LikeStory, reqObj, parseStoryLikeResponse, parseStoryLikeError);
    }

    const parseStoryLikeResponse = (resObj) => {
        if (resObj.status) {
            setLike(true);
        }
    }

    const parseStoryLikeError = (err) => {
        console.log(err);
    }

    // ==============================================================
    // reels 

    const onReelsLike = () => {
        var reqObj = {
            body: {
                reelsid: props.row._id
            }
        };
        UpdateRequest(APIsPath.LikeReels, reqObj, parseReelsLikeResponse, parseReelsLikeError);
    }

    const parseReelsLikeResponse = (resObj) => {
        if (resObj.status) {
            setLike(true);
        } else {
            setLikes(likes.filter((i) => i._id !== myid));
        }
    }

    const parseReelsLikeError = (err) => {
        console.log(err);
    }


    // ==============================================================

    const onStoryUnlike = () => {
        var reqObj = {
            body: {
                postid: props.row._id
            }
        };
        UpdateRequest(APIsPath.UnlikeStory, reqObj, parseStoryUnlikeResponse, parseStoryUnlikeError);
    }

    const parseStoryUnlikeResponse = (resObj) => {
        if (resObj.status) {
            setLike(false);
        }
    }

    const parseStoryUnlikeError = (err) => {
        console.log(err);
    }

    // ==============================================================
    // reels

    const onReelsUnLike = () => {
        var reqObj = {
            body: {
                reelsid: props.row._id
            }
        };
        UpdateRequest(APIsPath.UnLikeReels, reqObj, parseReelsUnLikeeResponse, parseReelsUnLikeeError);
    }

    const parseReelsUnLikeeResponse = (resObj) => {
        if (resObj.status) {
            setLike(false);
        } else {
            setLikes([...likes, JSON.parse(localStorage.getItem("user"))]);
        }
    }

    const parseReelsUnLikeeError = (err) => {
        console.log(err);
    }

    // ==============================================================
    if (!props.row.url) return "";
    return (
        <React.Fragment>
            <div className='video' onClick={(e) => handlePlayPause(e)}>

                {!isPlaying && <div className="pause"></div>}
                {/* <input
    className='range'
    type="range"
    min={0}
    max={videoRef.current && videoRef.current.duration}
    value={currentTime}
    onChange={(e) => handleRangeChange(e)}
/> */}
                <div className="user">
                    <div className="profile" >
                        {props.row?.postedBy?.profile && <img src={props.row?.postedBy?.profile} alt="profile" />}
                    </div>
                    <div className="content">
                        {props.row?.postedBy?.name}
                    </div>
                </div>

                <video
                    style={{ height: "100%", width: "100%", objectFit: "contain" }}
                    ref={videoRef}
                    src={props.row.url}
                    onTimeUpdate={() => handleTimeUpdate()}
                ></video>

                <div className="options" style={{ display: "flex", flexDirection: "column", height: "35%", position: "absolute", top: "70%", right: "3%", rowGap: "23px", zIndex: "99" }}>
                    <div className="icon" style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "white", cursor: "pointer" }}>
                        {like ?
                            <svg aria-label="Unlike" onClick={(e) => onUnlike(e)} className="x1lliihq x1n2onr6" color="rgb(255, 48, 64)" fill="rgb(255, 48, 64)" height="24" role="img" viewBox="0 0 48 48" width="24"><title>Unlike</title><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg> :
                            <svg aria-label="Like" onClick={(e) => onLike(e)} className="x1lliihq x1n2onr6" color="rgb(255, 255, 255)" fill="rgb(255, 255, 255)" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Like</title><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path></svg>
                        }
                        {likes.length}
                    </div>

                    <div className='icon' style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "white", cursor: "pointer" }} onClick={(e) => {
                        e.stopPropagation();
                        props.row.isShowComments = !props.row.isShowComments;
                        setShowComments(true);
                        // setReload(ps => !ps);
                    }}>
                        <svg aria-label="Comment" className={"svg comments"} color="#fff" fill="#fff" height="20" role="img" viewBox="0 0 24 24" width="20">
                            <title>comments</title>
                            <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                        {comments.length}
                    </div>
                    <div className='icon' style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "white", cursor: "pointer" }} onClick={(e) => {
                        e.stopPropagation();
                        setShowShares(true);
                        // setReload(ps => !ps);
                    }}>
                        <svg aria-label="Share Post" className={"svg "} color="#fff" fill="#fff" height="24" role="img" viewBox="0 0 24 24" width="24">
                            <title>Share</title>

                            <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line>
                            <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon>
                        </svg>
                    </div >

                    <div className="moreoptions"
                        onClick={(e) => onMoreOptions(e, props.row)}
                    >
                        <svg className='icon'
                            focusable="false" aria-hidden="true" fill='#fff' viewBox="0 0 24 24" data-testid="MoreVertIcon">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                        </svg>
                    </div>
                </div>



                {/* <button onClick={(e) => handlePlayPause(e)}>{isPlaying ? 'Pause' : 'Play'}</button> */}
            </div>
            {showmoreoptions &&
                <DrawerPopup size="default" position="right" isopen={true}
                    className="sample"
                    content={<MoreOptions selectedpost={selectedpost} />}
                    OuterClick={(e) => onOuterClick(e)}
                />
            }

            {showcomments &&
                <DrawerPopup size={DrawerPopupSize.Default} position={DrawerPopupPosition.Right} isopen={showcomments} className="sample"
                    content={<ViewComments row={props.row} update={(p) => update(p)} comments={comments} onClose={(s) => setShowComments(false)} />}
                    OuterClick={() => setShowComments(false)}
                />
            }

            {showshares &&
                <DrawerPopup size={DrawerPopupSize.Default} position={DrawerPopupPosition.Right} isopen={showshares} className="sample"
                    content={<Shares row={props.row} update={(p) => updateShares(p)} type={"reels"} onClose={(s) => setShowShares(false)} />}
                    OuterClick={() => setShowShares(false)}
                />
            }
        </React.Fragment>
    )
}
