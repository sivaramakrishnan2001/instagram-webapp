import React, { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import "./videoandimgfileupload2.css";
import { ImageTypes, VideoTypes } from '../../connector/AppConfig';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { PostRequest } from '../../connector/APIsCommunicator';
import { APIsPath } from '../../connector/APIsPath';


export const VideoAndImgFileUpload2 = (props) => {

    const varstore = useRef();
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [url, setUrl] = useState("");
    const [state, setState] = useState("");
    const [currentTime, setCurrentTime] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);

    const [file, setFile] = useState({});
    const [post, setPost] = useState({ title: "", desc: "", url: "", song: {}, location: "", save: [], filename: "", filename: "", type: "" });
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

    useEffect(() => {
        selectedFile && props.onChange && props.onChange(selectedFile);
    }, [selectedFile])

    // =================================================================

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileChange(e.dataTransfer.files[0]);
    };

    const handleFileInputChange = (e) => {
        handleFileChange(e.target.files[0]);
        setState("pause");
    };


    const videoClick = (e, type) => {
        e.stopPropagation();
        if (type === "play") {
            varstore?.video?.play();
            console.log("play");
            setState(type);
        } else {
            varstore?.video?.pause();
            console.log("pause");
            setState(type);
        }
    };

    const handlePlaybackRateChange = (rate) => {
        setPlaybackRate(rate);
        varstore.video.playbackRate = rate;
    };

    const handleVideoClick = (e) => {
        e.stopPropagation();
        console.log("fullscreen");
        if (!document.fullscreenElement) {
            // Enter fullscreen mode
            if (varstore.video.requestFullscreen) {
                varstore.video.requestFullscreen();
            } else if (varstore.video.mozRequestFullScreen) {
                varstore.video.mozRequestFullScreen(); // Firefox
            } else if (varstore.video.webkitRequestFullscreen) {
                varstore.video.webkitRequestFullscreen(); // Chrome, Safari, Opera
            } else if (varstore.video.msRequestFullscreen) {
                varstore.video.msRequestFullscreen(); // IE/Edge
            }
            setIsFullscreen(true);
        } else {
            // Exit fullscreen mode
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen(); // Firefox
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen(); // Chrome, Safari, Opera
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen(); // IE/Edge
            }
            setIsFullscreen(false);
        }
    };

    const handleTimeUpdate = () => {
        setCurrentTime(varstore.video.currentTime);
    };

    const handleRangeChange = (e) => {
        const newTime = e.target.value;
        setCurrentTime(newTime);
        varstore.video.currentTime = newTime;
    };

    const togglePlay = () => {
        varstore.video.paused ? varstore.video.play() : varstore.video.pause();
    };

    const handleFileChange = (file) => {
        const objectURL = URL.createObjectURL(file);
        setUrl(objectURL);
        setSelectedFile(file);
        setFile(file)
    };


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
        const images = ref(Storage, `images/${filename.trim()}`);
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
        const storageRef = ref(storage, `videos/${filename.trim()}`);
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

            <div className="left" style={{ display: "flex", width: "50%", height: "100%" }}>
                <div className='file-upload-wapper2'>
                    <div
                        className={url ? 'ondrop remove' : 'ondrop'}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        style={{ borderColor: isDragging ? 'blue' : '#ccc', position: "relative", display: "flex", padding: `${url ? "0px" : "30px"}` }}
                        onClick={() => {
                            if (!isFullscreen) {
                                varstore.input.click();
                            }
                        }}
                    >
                        {selectedFile ?
                            <React.Fragment>
                                {VideoTypes.includes(selectedFile.type) ?
                                    <video
                                        ref={(elem) => varstore.video = elem}
                                        onDoubleClick={(e) => handleVideoClick(e)}
                                        onTimeUpdate={(e) => handleTimeUpdate(e)}
                                        src={url}
                                        controls>
                                    </video> :
                                    ImageTypes.includes(selectedFile.type) && <img src={url} alt="img" />
                                }
                            </React.Fragment>
                            : <svg className="icon" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AddAPhotoIcon"><path d="M3 4V1h2v3h3v2H5v3H3V6H0V4h3zm3 6V7h3V4h7l1.83 2H21c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V10h3zm7 9c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-3.2-5c0 1.77 1.43 3.2 3.2 3.2s3.2-1.43 3.2-3.2-1.43-3.2-3.2-3.2-3.2 1.43-3.2 3.2z"></path></svg>
                        }

                        {isFullscreen ?
                            <div className="video-controls">
                                <button className="control-btn" onClick={() => togglePlay()}>
                                    {varstore.video && varstore.video.paused ? 'Play' : 'Pause'}
                                </button>
                                <button className="control-btn" onClick={() => handleVideoClick()}>
                                    {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                                </button>
                                <div className="playback-rate-container">
                                    <span className="rate-label">Speed:</span>
                                    <button className={`rate-btn ${playbackRate === 1 ? 'active' : ''}`} onClick={() => handlePlaybackRateChange(1)}>
                                        1x
                                    </button>
                                    <button className={`rate-btn ${playbackRate === 1.5 ? 'active' : ''}`} onClick={() => handlePlaybackRateChange(1.5)}>
                                        1.5x
                                    </button>
                                    <button className={`rate-btn ${playbackRate === 2 ? 'active' : ''}`} onClick={() => handlePlaybackRateChange(2)}>
                                        2x
                                    </button>
                                </div>
                            </div> : ""
                        }


                        <input type="file" ref={(elem) => varstore.input = elem} onChange={(e) => handleFileInputChange(e)} />
                    </div>


                </div >

            </div>





            <div className="right" style={{ display: "flex", flexDirection: "column", width: "50%", height: "100%" }}>

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
                    onChange={(e) => setPost({ ...post, desc: e.target.value })}
                    placeholder='discretion'
                />

                {/* <CircularRange currentTime={currentTime}/> */}
                {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
                    <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                </svg> */}
                {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5zm3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5z" />
                </svg> */}

                {state ?
                    <React.Fragment>
                        <div className="d" style={{ height: "10%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", position: "relative" }}>
                            {/* {state === "play" ?
                            <svg xmlns="http://www.w3.org/2000/svg" className='pause' onClick={(e) => videoClick(e, "pause")} style={{ width: "30px", height: "30px" }} fill="currentColor" class="bi bi-pause-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                <path d="M5 6.25a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5zm3.5 0a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5z" />
                            </svg> :
                            <svg xmlns="http://www.w3.org/2000/svg" className='play' onClick={(e) => videoClick(e, "play")} style={{ width: "35px", height: "35px", }} fill="currentColor" class="bi bi-play" viewBox="0 0 16 16">
                                <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" />
                            </svg>
                        } */}

                            {varstore?.video?.paused ?
                                <svg xmlns="http://www.w3.org/2000/svg" className='play' onClick={(e) => videoClick(e, "play")} style={{ width: "35px", height: "35px", }} fill="currentColor"  viewBox="0 0 16 16">
                                    <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" />
                                </svg>
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" className='pause' onClick={(e) => videoClick(e, "pause")} style={{ width: "30px", height: "30px" }} fill="currentColor"  viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path d="M5 6.25a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5zm3.5 0a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5z" />
                                </svg>
                            }

                            <svg xmlns="http://www.w3.org/2000/svg" onClick={(e) => handleVideoClick(e)} style={{ position: "absolute", right: "3%" }} width="16" height="16" fill="currentColor"  viewBox="0 0 16 16">
                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                            </svg>
                        </div>
                        <input
                            style={{ cursor: "pointer", height: "10px" }}
                            type="range"
                            min="0"
                            max={varstore.video && varstore.video.duration}
                            value={currentTime}
                            onChange={handleRangeChange}
                        />
                    </React.Fragment>
                    : ""}

                {/* <div style={{ display: "flex", alignItems: "center", paddingTop: "20px" }} onClick={() => setShowSongs(true)}>
                    <svg className="icon" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AddIcon"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
                    Add Song
                </div> */}

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
            </div>
        </React.Fragment>

    );
}
