import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useRef, useState } from 'react';
import { GetRequest, UpdateRequest } from '../../connector/APIsCommunicator';
import { APIsPath } from '../../connector/APIsPath';
import { LocalStorageKeys } from '../../connector/AppConfig';
import { Storage } from '../../firebase';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export const Profile = (props) => {

    const varatore = useRef();
    const videoRef = useRef();
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const [user, setUser] = useState('');
    const [profile, setProfile] = useState("");
    const [post, setPost] = useState([]);
    const [reels, setReels] = useState([]);
    const [save, setSave] = useState([]);
    const [likes, setLikes] = useState([]);
    const [paramid, setParamId] = useState("");

    // ==============================================================

    useEffect(() => {
        setParamId(params.userId);
    }, [params.userId]);

    useEffect(() => {
        getProfileApi();
    }, [paramid]);

    useEffect(() => {
        if (!profile) return;
        onUpdateProfile();

    }, [profile]);

    // ==============================================================

    const onFileChange = (e) => {
        const file = e.target.files[0];
        const images = ref(Storage, `images/${file.name + new Date().getDate()}`);
        const uploadTask = uploadBytesResumable(images, file);
        uploadTask.on("state_changed", (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            console.log("progress ", progress);
        }, (err) => {
            console.log("err", err);
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                console.log("url = ", url, ";");
                setProfile(url);
                setUser({ ...user, profile: url });
            })
        })
    }

    // ==============================================================

    const getProfileApi = () => {
        GetRequest(APIsPath.GetProfile + "/" + paramid, {}, parseGetProfileResponse, parseGetProfileError);
    }

    const parseGetProfileResponse = (resObj) => {
        if (resObj.status) {
            setUser(resObj.data.profile);
            onGetPosts();
        }
    }

    const parseGetProfileError = (err) => {
        console.log("parseGetProfileError", err);
    }

    // ==============================================================

    const onUpdateProfile = () => {
        var reqObj = {
            body: {
                token: JSON.parse(LocalStorageKeys.token),
                profile: profile
            }
        };
        UpdateRequest(APIsPath.UpdateProfile, reqObj, parseUpdateProfileResponse, parseUpdateProfileError);
    }

    const parseUpdateProfileResponse = (resObj) => {
        if (resObj.status) {
            console.log(resObj.data, "resObj.data");
            // setPosts(resObj.data.profile);
        }
        console.log("parseUpdateProfileResponse", resObj);
    }

    const parseUpdateProfileError = (err) => {
        console.log("parseUpdateProfileError", err);
    }

    // ==============================================================

    const onGetPosts = () => {
        GetRequest(APIsPath.GetUserPost + paramid, {}, parseGetUserPostResponse, parseGetUserPostError);
    }

    const parseGetUserPostResponse = (resObj) => {
        console.log("resObj", resObj);
        if (resObj.status) {
            setPost(resObj.data);
            getAllReels()
        }
    }

    const parseGetUserPostError = (err) => {
        alert(err.message);
    }

    // ==============================================================

    const getAllReels = () => {
        GetRequest(APIsPath.GetAllReels, {}, parseGetAllReelsResponse, parseGetAllReelsError);
    }

    const parseGetAllReelsResponse = (resObj) => {
        console.log("resObj", resObj);
        if (resObj.status) {
            setReels(resObj.data);
            onGetAllSave();
        }
    }

    const parseGetAllReelsError = (err) => {
        alert(err.message);
    }

    // ==============================================================


    const onGetAllSave = () => {
        GetRequest(APIsPath.GetAllSave, {}, parseGetAllSaveResponse, parseGetAllSaveError);
    }

    const parseGetAllSaveResponse = (resObj) => {
        console.log("GetAllSave", resObj);
        if (resObj.status) {
            GetAllLikes();
        }
    }

    const parseGetAllSaveError = (err) => {
        alert(err.message);
    }

    // ==============================================================

    const GetAllLikes = () => {
        GetRequest(APIsPath.GetAllSave, {}, parseGetAllLikesResponse, parseGetAllLikesError);
    }

    const parseGetAllLikesResponse = (resObj) => {
        console.log("GetAllLikes", resObj);
        if (resObj.status) {
            setLikes(resObj.data)
        }
    }

    const parseGetAllLikesError = (err) => {
        console.log("err", err);
    }

    return (
        <div className='my-profile'>
            <div className="header">
                <div className="user">
                    <div className="user-profile">
                        <div className="border">
                            <img src={user.profile}  onClick={() => varatore.file.click()} />
                        </div>
                        <input ref={(elem) => varatore.file = elem} type="file" onChange={(e) => onFileChange(e)} />
                    </div>
                    <div className="user-bio">
                        {/* <div className="user-id">312312</div> */}
                        <div className="user-name">
                            <div>{user.name}</div>
                            <div>Edit profile</div>
                            <div className="icon">
                                <svg aria-label="Settings" className={"svg "} color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                                    <circle cx="12" cy="12" fill="none" r="8.635" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                                    <path d="M14.232 3.656a1.269 1.269 0 0 1-.796-.66L12.93 2h-1.86l-.505.996a1.269 1.269 0 0 1-.796.66m-.001 16.688a1.269 1.269 0 0 1 .796.66l.505.996h1.862l.505-.996a1.269 1.269 0 0 1 .796-.66M3.656 9.768a1.269 1.269 0 0 1-.66.796L2 11.07v1.862l.996.505a1.269 1.269 0 0 1 .66.796m16.688-.001a1.269 1.269 0 0 1 .66-.796L22 12.93v-1.86l-.996-.505a1.269 1.269 0 0 1-.66-.796M7.678 4.522a1.269 1.269 0 0 1-1.03.096l-1.06-.348L4.27 5.587l.348 1.062a1.269 1.269 0 0 1-.096 1.03m11.8 11.799a1.269 1.269 0 0 1 1.03-.096l1.06.348 1.318-1.317-.348-1.062a1.269 1.269 0 0 1 .096-1.03m-14.956.001a1.269 1.269 0 0 1 .096 1.03l-.348 1.06 1.317 1.318 1.062-.348a1.269 1.269 0 0 1 1.03.096m11.799-11.8a1.269 1.269 0 0 1-.096-1.03l.348-1.06-1.317-1.318-1.062.348a1.269 1.269 0 0 1-1.03-.096" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
                                </svg>
                            </div>
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
                    <div className="tab">
                        <div className="icon">
                            <svg aria-label="Posts" className={"svg " + props.className} color="#0095f6" fill="#0095f6" height="24" role="img" viewBox="0 0 24 24" width="24">
                                <rect fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="18" x="3" y="3"></rect>
                                <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="9.015" x2="9.015" y1="3" y2="21"></line>
                                <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="14.985" x2="14.985" y1="3" y2="21"></line>
                                <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="9.015" y2="9.015"></line>
                                <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="14.985" y2="14.985"></line>
                            </svg></div>
                        POSTS
                    </div>
                    <div className="tab">
                        <div className="icon"> <svg aria-label="Reels" className={"svg " + props.className} color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                            <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="2.049" x2="21.95" y1="7.002" y2="7.002"></line>
                            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="13.504" x2="16.362" y1="2.001" y2="7.002"></line>
                            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="7.207" x2="10.002" y1="2.11" y2="7.002"></line><path d="M2 12.001v3.449c0 2.849.698 4.006 1.606 4.945.94.908 2.098 1.607 4.946 1.607h6.896c2.848 0 4.006-.699 4.946-1.607.908-.939 1.606-2.096 1.606-4.945V8.552c0-2.848-.698-4.006-1.606-4.945C19.454 2.699 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.546 2 5.704 2 8.552Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><path d="M9.763 17.664a.908.908 0 0 1-.454-.787V11.63a.909.909 0 0 1 1.364-.788l4.545 2.624a.909.909 0 0 1 0 1.575l-4.545 2.624a.91.91 0 0 1-.91 0Z" fillRule="evenodd"></path>
                        </svg></div>
                        REELS
                    </div>
                    <div className="tab">
                        <div className="icon"><svg aria-label="Save" className={"svg " + props.className} color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                            <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
                        </svg></div>
                        SAVE
                    </div>
                    <div className="tab">
                        <div className="icon"><svg aria-label="Save" className={"svg " + props.className} color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                            <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
                        </svg></div>
                        SAVE
                    </div>
                </div>
                <div className="my-posts">
                    <div className="posts">
                        <div className="post"></div>
                        <div className="post"></div>
                        <div className="post"></div>
                        <div className="post"></div>
                        <div className="post"></div>
                        <div className="post"></div>
                    </div>
                    <div className="reels">
                        <div className="reel"></div>
                        <div className="reel"></div>
                        <div className="reel"></div>
                        <div className="reel"></div>
                        <div className="reel"></div>
                        <div className="reel"></div>
                    </div>
                    <div className="saves">
                        <div className="save"></div>
                        <div className="save"></div>
                        <div className="save"></div>
                        <div className="save"></div>
                        <div className="save"></div>
                        <div className="save"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}


