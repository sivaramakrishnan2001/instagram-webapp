import React, { useEffect, useRef, useState } from 'react';
import { DrawerPopup } from '../drawerpopup/DrawerPopup';
import { APIsPath } from '../../connector/APIsPath';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { PostRequest } from '../../connector/APIsCommunicator';
import { Songs } from '../songs/Songs';
import { ImageTypes, VideoTypes } from '../../connector/AppConfig';
import { VideoAndImgFileUpload } from '../../uielements/fileupload/VideoAndImgFileUpload';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';


export const CreateStory = (props) => {

    const varstore = useRef();
    const [file, setFile] = useState({});
    const [video, setVideo] = useState({
        url: "", song: {}, location: "", filename: "", type: ""
    });
    const [showsongs, setShowSongs] = useState(false);
    const [showprogress, setShowProgress] = useState(false)

    // =================================================================

    useEffect(() => {
        if (video.url && video.filename && video.type) {
            onCreatePost();
        }
    }, [video]);

    // =================================================================
    // onChange

    const onChangeFile = (f) => {
        setFile(f);
    }

    // =================================================================
    // onClick

    const onSelectedSong = (row) => {
        setVideo({ ...video, song: row });
        setShowSongs(false);
    }


    const onOuterClick = () => {
        setShowSongs(false);
    }

    const onUpload = () => {
        setShowProgress(true);
        // if (VideoTypes.includes(file.type)) {
        //     onUploadVideo();
        // } else if (ImageTypes.includes(file.type)) {
        //     onUploadImage();
        // } else {
        //     alert("file wrong format");
        // }
    }

    // ==============================================================

    const onUploadVideo = () => {
        const filename = new Date().getTime() + " " + file.name;
        const storage = getStorage();
        const storageRef = ref(storage, `videos/${filename}`);
        uploadBytes(storageRef, file).then((snapshot) => {
            console.log("snapshot", snapshot);
            console.log("Video uploaded successfully!");
            // Get the download URL of the uploaded file
            getDownloadURL(storageRef).then((url) => {
                console.log("Download URL:", url);
                setVideo({ ...video, url: url, filename: filename, type: "video" });
                // Perform any additional actions with the URL, such as saving it to a database
            }).catch((error) => {
                console.error("Error getting download URL:", error);
            });
        }).catch((error) => {
            console.error("Error uploading video:", error);
        });
    }

    // ==============================================================

    const onUploadImage = () => {
        const filename = new Date().getTime() + " " + file.name;
        const images = ref(Storage, `images/${filename}`);
        const uploadTask = uploadBytesResumable(images, file);
        uploadTask.on("state_changed", (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            console.log("progress ", progress);
        }, (err) => {
            console.log("err", err);
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                setVideo({ ...video, url: url, filename: filename, type: "image" });
            })
        })
    }

    // ==============================================================
    // apis

    const onCreatePost = () => {
        var data = {
            body: video
        };
        PostRequest(APIsPath.CreateStory, data, parseCreateReelsResponse, parseCreateReelsError);
    }

    const parseCreateReelsResponse = (resObj) => {
        if (resObj.status) {
            setShowProgress(false);
            alert("updated");
        }
        console.log("parseCreateReelsResponse", resObj);
    }

    const parseCreateReelsError = (err) => {
        console.log("parseCreatePostError", err);
    }

    // =================================================================

    return (
        <React.Fragment>
            {!showsongs ?
                <div style={{ display: "flex", justifyContent: "", alignItems: "center", flexDirection: "column", backgroundColor: "#fff", width: "100%", height: "100%", }}>
                    <div className="header" style={{ display: "flex", justifyContent: "end", alignItems: "center", height: "10%", width: "100%", paddingRight: "20px" }}>
                        <div className="close" onClick={() => props.onClose && props.onClose()} style={{ height: "15px", width: "15px" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" style={{ height: "15px", width: "15px" }} viewBox="0 0 16 16">
                                <g id="cancel-button" transform="translate(-17.666 -17.652)">
                                    <g id="Group_108" data-name="Group 108" transform="translate(17.666 17.652)">
                                        <path id="Path_191" data-name="Path 191" d="M128.621,143.836a1.108,1.108,0,0,0,.786.336,1.077,1.077,0,0,0,.785-.336l6.1-6.089,6.1,6.089a1.108,1.108,0,0,0,.786.336,1.077,1.077,0,0,0,.786-.336,1.138,1.138,0,0,0,0-1.588l-6.078-6.07,6.078-6.089a1.138,1.138,0,0,0,0-1.588,1.124,1.124,0,0,0-1.59,0l-6.078,6.089-6.1-6.07a1.123,1.123,0,0,0-1.59,1.588l6.1,6.07-6.078,6.089A1.082,1.082,0,0,0,128.621,143.836Z" transform="translate(-128.279 -128.173)" fill="#383e3a" />
                                    </g>
                                </g>
                            </svg>

                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", width: "80%", height: "80%", marginTop: "10px" }}>
                        <VideoAndImgFileUpload onChange={(f) => onChangeFile(f)} />
                        {/* <div style={{ display: "flex", alignItems: "center", paddingTop: "20px" }} onClick={() => setShowSongs(true)}>
                            <svg className="icon" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AddIcon"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
                            Add Song
                        </div> */}
                        <Button variant="primary" size="sm" style={{ marginTop: "20px" }} disabled={file.type ? true : false} onClick={() => onUpload()}>
                            {showprogress ?
                                <React.Fragment>
                                    <Spinner
                                        as="span"
                                        animation="grow"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    Loading...
                                </React.Fragment>
                                : "Upload"
                            }
                        </Button>
                    </div>
                </div>
                : <Songs onSelectedSong={onSelectedSong} />
            }
        </React.Fragment>
    )
}
