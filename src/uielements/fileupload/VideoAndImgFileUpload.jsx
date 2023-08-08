import React, { useEffect, useRef, useState } from 'react';
import "./fileupload.css";
import { ImageTypes, VideoTypes } from '../../connector/AppConfig';
import { CircularRange } from '../range/circularrange/CircularRange';

export const VideoAndImgFileUpload = (props) => {

    const varstore = useRef();
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [url, setUrl] = useState("");
    const [state, setState] = useState("");
    const [currentTime, setCurrentTime] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    

    useEffect(() => {
        selectedFile && props.onChange && props.onChange(selectedFile);
    }, [selectedFile])


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
    };

    return (
        <React.Fragment>
            <div className='file-upload-wapper'>
                <div
                    className='ondrop'
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    style={{ borderColor: isDragging ? 'blue' : '#ccc', position: "relative" }}
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
                            <svg xmlns="http://www.w3.org/2000/svg" className='play' onClick={(e) => videoClick(e, "play")} style={{ width: "35px", height: "35px", }} fill="currentColor" class="bi bi-play" viewBox="0 0 16 16">
                                <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" />
                            </svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" className='pause' onClick={(e) => videoClick(e, "pause")} style={{ width: "30px", height: "30px" }} fill="currentColor" class="bi bi-pause-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                <path d="M5 6.25a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5zm3.5 0a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5z" />
                            </svg>
                        }

                        <svg xmlns="http://www.w3.org/2000/svg" onClick={(e) => handleVideoClick(e)} style={{ position: "absolute", right: "3%" }} width="16" height="16" fill="currentColor" class="bi bi-square" viewBox="0 0 16 16">
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

            {/* <CircularRange currentTime={currentTime}/> */}
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
                    <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                </svg> */}
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5zm3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5z" />
                </svg> */}
        </React.Fragment>

    );
}
