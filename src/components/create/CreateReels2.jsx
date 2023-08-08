import React, { useEffect, useRef, useState } from 'react';
import { DrawerPopup } from '../drawerpopup/DrawerPopup';
import { APIsPath } from '../../connector/APIsPath';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { PostRequest } from '../../connector/APIsCommunicator';
import { Songs } from '../songs/Songs';
import { ImageTypes, VideoTypes } from '../../connector/AppConfig';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { VideoAndImgFileUpload2 } from '../../uielements/fileupload/VideoAndImgFileUpload2';

export const CreateReels2 = (props) => {

    const varstore = useRef();
    const [file, setFile] = useState({});
    const [post, setPost] = useState({ title: "", body: "", url: "", song: {}, location: "", save: [], filename: "", filename: "", type: "" });
    const [video, setVideo] = useState({
        url: "", song: {}, location: "", filename: "", type: ""
    });
    const [showsongs, setShowSongs] = useState(false);
    const [showprogress, setShowProgress] = useState(false);

    // =================================================================

    useEffect(() => {
        if (post.url && post.filename && post.type) {
            onCreatePost();
        }
    }, [post]);

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

    // =================================================================

    const onUpload = () => {
        setShowProgress(true);
        if (VideoTypes.includes(file.type)) {
            onUploadVideo();
        } else if (ImageTypes.includes(file.type)) {
            onUploadImage();
        } else {
            alert("file wrong format");
        }
    }

    // =================================================================

    const onUploadImage = () => {
        const filename = new Date().getTime() + "_" + file.name;
        const images = ref(Storage, `images/${filename}`);
        const uploadTask = uploadBytesResumable(images, file);
        uploadTask.on("state_changed", (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            console.log("progress ", progress);
        }, (err) => {
            console.log("err", err);
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                console.log("url = ", url, ";");
                setPost({ ...post, url: url, filename: filename, type: "image" })
            })
        })
    }

    // =================================================================

    const onUploadVideo = () => {
        const filename = new Date().getTime() + "_" + file.name;
        const storage = getStorage();
        const storageRef = ref(storage, `videos/${filename}`);
        uploadBytes(storageRef, file).then((snapshot) => {
            console.log("snapshot", snapshot);
            console.log("Video uploaded successfully!");
            // Get the download URL of the uploaded file
            getDownloadURL(storageRef).then((url) => {
                console.log("Download URL:", url);
                setPost({ ...post, url: url, filename: filename, type: "video" });
                // Perform any additional actions with the URL, such as saving it to a database
            }).catch((error) => {
                console.error("Error getting download URL:", error);
            });
        }).catch((error) => {
            console.error("Error uploading video:", error);
        });
    }

    // ==============================================================
    // apis

    const onCreatePost = () => {
        console.log("post", post);
        var data = {
            body: post
        };
        if (post !== "") {
            PostRequest(APIsPath.CreateReels, data, parseCreatePostResponse, parseCreatePostError);
        }
    }

    const parseCreatePostResponse = (resObj) => {
        if (resObj.status) {
            setShowProgress(false);
            alert("updated");
            props.onClose(true);
        }
        console.log("parseCreatePostResponse", resObj);
    }

    const parseCreatePostError = (err) => {
        alert("err");
        console.log("parseCreatePostError", err);
    }

    // =================================================================

    return (
        <React.Fragment>
            {!showsongs ?
                <div style={{ display: "flex", justifyContent: "", flexDirection: "column", backgroundColor: "#fff", width: "1000px", height: "100%", overflowY: "scroll" }}>


                    <div style={{ display: "flex", width: "100%", height: "100%", padding: "20px 20px", columnGap: "30px" }}>
                        <VideoAndImgFileUpload2 onChange={(f) => onChangeFile(f)} onClose={() => props?.onClose()} />

                        {/* <div className="right" style={{ display: "none", flexDirection: "column", width: "30%", height: "100%" }}>
                            <input
                                ref={(elem) => varstore.title = elem} type="text"
                                style={{ border: "1px solid #c0c0c0" }}
                                value={post.title}
                                placeholder='title'
                                onChange={(e) => setPost({ ...post, title: e.target.value })}
                                onKeyDown={(e) => e.key === "Enter" ? varstore.body.focus() : ""} />
                            <input
                                ref={(elem) => varstore.body = elem}
                                style={{ border: "1px solid #c0c0c0" }}
                                type="text"
                                value={post.body}
                                onChange={(e) => setPost({ ...post, body: e.target.value })}
                                placeholder='body'
                            />
                           
                            <Button variant="primary" size="sm" style={{ marginTop: "20px" }} disabled={file.type ? false : true} onClick={() => onUpload()}>
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
                        </div> */}

                        {/* <div style={{ display: "flex", alignItems: "center", paddingTop: "20px" }} onClick={() => setShowSongs(true)}>
                    <svg className="icon" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AddIcon"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
                    Add Song
                </div> */}

                    </div>
                </div>
                : <Songs onSelectedSong={onSelectedSong} />
            }
        </React.Fragment>
    )
}
