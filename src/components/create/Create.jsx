import React, { useEffect, useRef, useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, getStorage, uploadBytes } from "firebase/storage";
import { Storage } from '../../firebase';
import { PostRequest } from '../../connector/APIsCommunicator';
import { APIsPath } from '../../connector/APIsPath';
import { ImageTypes, LocalStorageKeys, VideoTypes } from '../../connector/AppConfig';
import { DrawerPopup } from '../drawerpopup/DrawerPopup';
import { Songs } from '../songs/Songs';
import { CreateSong } from '../songs/CreateSong';
import { CreateReels } from '../reels/CreateReels';
import { CreateStickyNotes } from '../stickynotes/CreateStickyNotes';
import { Fileupload2 } from '../../uielements/fileupload/FileUpload';
import { CreateStory } from '../story/CreateStory';

export const Create = props => {

    const varstore = useRef();
    const [isopen, setIsOpen] = useState(true);
    const [count, setCount] = useState(undefined);
    const [file, setFile] = useState({});



    const [post, setPost] = useState({ title: "", body: "", photo: "", video: "", song: {}, location: "", save: false, filename: "", filename: "", type: "" });
    const [progress, setProgress] = useState(0);
    const [showprogress, setShowProgress] = useState(false);
    const [showsongs, setShowSongs] = useState(false);
    const [reload, setReload] = useState(false);

    // ==============================================================

    useEffect(() => {
        setIsOpen(true);
        // setPost({ ...post,  });

    }, [props]);

    useEffect(() => {
        if (post.video || post.photo && post.filename && post.type) {
            onCreatePost();
        }
    }, [post]);
    // ==============================================================


    const onChangeImage = e => {
        setFile(e.target.files[0]);

        // const base64 = await convertToBase64(file);

    }

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
                setPost({ ...post, photo: url, filename: filename, type: "image" })
            })
        })
    }

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
                setPost({ ...post, video: url, filename: filename, type: "video" });
                // Perform any additional actions with the URL, such as saving it to a database
            }).catch((error) => {
                console.error("Error getting download URL:", error);
            });
        }).catch((error) => {
            console.error("Error uploading video:", error);
        });
    }

    const onOuterClick = () => {
        setShowSongs(false);
    }

    // ==============================================================
    // functions

    const onClickCreatePost = () => {
        setShowProgress(true);
        if (VideoTypes.includes(file.type)) {
            onUploadVideo();
        } else if (ImageTypes.includes(file.type)) {
            onUploadImage();
        } else {
            alert("file wrong format");
        }
    }

    const onSelectedSong = (row) => {
        setPost({ ...post, song: row });
        setShowSongs(false);
    }


    // ==============================================================
    // apis

    const onCreatePost = () => {
        console.log("post", post);
        var data = {
            body: post
        };
        if (post !== "") {
            PostRequest(APIsPath.Post + `/?token=${JSON.parse(LocalStorageKeys.token)}`, data, parseCreatePostResponse, parseCreatePostError);
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

    // ==============================================================

    return (
        <div className="create-post-container">
            <CreateStory />
            <Fileupload2 />
            <CreateStickyNotes />
            <CreateReels />

            <CreateSong />
            <div className="create-post">
                <div className='create'>
                    <input
                        ref={(elem) => varstore.title = elem} type="text"
                        value={post.title}
                        placeholder='title'
                        onChange={(e) => setPost({ ...post, title: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" ? varstore.body.focus() : ""} />
                    <input
                        ref={(elem) => varstore.body = elem}
                        type="text"
                        value={post.body}
                        onChange={(e) => setPost({ ...post, body: e.target.value })}
                        placeholder='body'
                    />

                    <div className="icon" onClick={() => varstore.file.click()}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={"svg "} viewBox="0 0 24 24" style={{ height: "30px", width: "30px" }}>
                            <g>
                                <path fill="none" d="M0 0h24v24H0z" />
                                <path d="M21 15v3h3v2h-3v3h-2v-3h-3v-2h3v-3h2zm.008-12c.548 0 .992.445.992.993V13h-2V5H4v13.999L14 9l3 3v2.829l-3-3L6.827 19H14v2H2.992A.993.993 0 0 1 2 20.007V3.993A1 1 0 0 1 2.992 3h18.016zM8 7a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
                            </g>
                        </svg>
                    </div>

                    <input ref={(elem) => varstore.file = elem}
                        type="file" multiple={true}
                        onChange={(e) => onChangeImage(e)}

                    />

                    <button onClick={() => setShowSongs(true)}>add songs</button>
                    <div className="div" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <button
                            className={showprogress ? " activeLoading" : "active"}
                            onClick={() => onClickCreatePost()}
                        >Create <span className="load loading"></span>
                        </button>
                    </div>
                </div>
            </div>

            {showsongs &&
                <DrawerPopup size="default" position="left" isopen={showsongs} className="sample"
                    content={<Songs onSelectedSong={onSelectedSong} />}
                    OuterClick={onOuterClick}
                />
            }

        </div>
        // <DrawerPopup size="full" position="top" isopen={isopen} className="sample" content={onCreate()} />
    )

}

function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result)
        };
        fileReader.onerror = (error) => {
            reject(error)
        }
    })
}


