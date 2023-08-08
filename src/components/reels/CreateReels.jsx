import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import React, { useRef, useState } from 'react'
import { DrawerPopup } from '../drawerpopup/DrawerPopup';
import { Songs } from '../songs/Songs';
import { PostRequest } from '../../connector/APIsCommunicator';
import { APIsPath } from '../../connector/APIsPath';
import { LocalStorageKeys } from '../../connector/AppConfig';

export const CreateReels = () => {

    const varstore = useRef();
    const [video, setVideo] = useState({
        url: "", desc: "", song: {}, location: "", filename: ""
    });
    const [showsongs, setShowSongs] = useState(false);

    // =================================================================
    // onChange

    const onChangeVideoFile = async (e) => {
        const file = e.target.files[0];
        const filename = '' + new Date().getTime() + " " + file.name;
        console.log("filename",filename);
        const storage = getStorage();
        const storageRef = ref(storage, `videos/${filename}`);
        uploadBytes(storageRef, file).then((snapshot) => {
            console.log("snapshot", snapshot);
            console.log("Video uploaded successfully!");
            // Get the download URL of the uploaded file
            getDownloadURL(storageRef).then((url) => {
                console.log("Download URL:", url);

                setVideo({ ...video, url: url, filename: filename });
                alert("video successfully uploaded")
                // Perform any additional actions with the URL, such as saving it to a database
            }).catch((error) => {
                console.error("Error getting download URL:", error);
            });
        }).catch((error) => {
            console.error("Error uploading video:", error);
        });
    }

    const onChangeDesc = (e) => {
        setVideo({ ...video, desc: e.target.value });
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

    // ==============================================================
    // apis

    const onCreatePost = () => {
        if (video.filename) {
            var data = {
                body: video
            };
            if (video !== "") {
                PostRequest(APIsPath.CreateReels + `/?token=${JSON.parse(LocalStorageKeys.token)}`, data, parseCreateReelsResponse, parseCreateReelsError);
            }
        } else {
            alert("please upload file");
        }

    }

    const parseCreateReelsResponse = (resObj) => {
        if (resObj.status) {
            alert("updated");
        }
        console.log("parseCreateReelsResponse", resObj);
    }

    const parseCreateReelsError = (err) => {
        console.log("parseCreatePostError", err);
    }

    // =================================================================

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", width: "400px" }}>
                <input type="file" ref={(elem) => varstore.file = elem}
                    // accept="video/mp4,video/x-m4v,video/*" 
                    onChange={(e) => onChangeVideoFile(e)} />
                <input type="text" placeholder='desc' onChange={(e) => onChangeDesc(e)} />
                <div className="icon" onClick={() => varstore.file.click()}>
                    <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="VideoLibraryIcon" tabIndex="-1" title="VideoLibrary"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z"></path></svg>
                </div>
                <button onClick={() => setShowSongs(true)}>add songs</button>
                <button onClick={() => onCreatePost()}>upload</button>
                {showsongs &&
                    <DrawerPopup size="default" position="left" isopen={showsongs} className="sample"
                        content={<Songs onSelectedSong={onSelectedSong} />}
                        OuterClick={onOuterClick}
                    />
                }
            </div>
        </div>
    )
}
