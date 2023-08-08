import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { PostRequest } from '../../connector/APIsCommunicator';
import { APIsPath } from '../../connector/APIsPath';
import { LocalStorageKeys } from '../../connector/AppConfig';
import { Storage } from '../../firebase';

export const CreateSong = () => {

    const varstore = useRef();
    const [song, setSong] = useState({
        name: "", song: "", desc: "", img: "", movie: "", imgfilename: "", songfilename: ""
    });

    useEffect(() => {
        setSong({ ...song, userid: JSON.parse(LocalStorageKeys.user)?._id });

    }, []);


    const onChangeImage = (e) => {
        const file = e.target.files[0];
        const filename = new Date().getTime() + " " + file.name;
        console.log("file", file);
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
                setSong({ ...song, img: url, imgfilename: filename });
                alert("Successfully upload image")
            })
        })
    }

    const onChangeAudio = e => {
        const file = e.target.files[0];
        console.log("file", file);
        const filename = new Date().getTime() + " " + file.name;
        const images = ref(Storage, `songs/${filename}`);
        const uploadTask = uploadBytesResumable(images, file);
        uploadTask.on("state_changed", (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            console.log("progress ", progress);
        }, (err) => {
            console.log("err", err);
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                console.log("url = ", url, ";");
                setSong({ ...song, song: url, songfilename: filename });
                alert("Successfully upload song")
            })
        })
    }

    const onUploadSong = () => {
        if (song.filename && song.img) {
            var reqObj = {
                body: {
                    song: {
                        userid: song.userid,
                        name: song.name,
                        song: song.song,
                        desc: song.desc,
                        img: song.img,
                        movie: song.movie,
                        imgfilename: song.imgfilename,
                        songfilename: song.songfilename
                    },
                    token: JSON.parse(LocalStorageKeys.token)
                }
            };
            PostRequest(APIsPath.UploadSong, reqObj, parseUploadSongResponse, parseUploadSongError);
        } else {
            if (!song.filename) {
                alert("plase upload song")
            } else {
                alert("plase upload image")
            }
        }

    }

    const parseUploadSongResponse = (resObj) => {
        if (resObj.status) {
        }
        console.log("parseUploadSongResponse", resObj);
    }

    const parseUploadSongError = (err) => {
        console.log("parseUploadSongError", err);
    }

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", width: "400px" }}>
                <input type="text" value={song.name} placeholder='name'
                    onChange={(e) => setSong({ ...song, name: e.target.value.trim() })} />
                <input type="text" value={song.desc} placeholder='desc'
                    onChange={(e) => setSong({ ...song, desc: e.target.value.trim() })} />
                <input type="text" value={song.movie} placeholder='movie'
                    onChange={(e) => setSong({ ...song, movie: e.target.value.trim() })} />

                <input type="file"
                    ref={(elem) => varstore.img = elem}
                    onChange={(e) => onChangeImage(e)}
                    placeholder="image"
                />
                <div className="icon" onClick={() => varstore.img.click()}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={"svg "} viewBox="0 0 24 24" style={{ height: "30px", width: "30px" }}>
                        <g>
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path d="M21 15v3h3v2h-3v3h-2v-3h-3v-2h3v-3h2zm.008-12c.548 0 .992.445.992.993V13h-2V5H4v13.999L14 9l3 3v2.829l-3-3L6.827 19H14v2H2.992A.993.993 0 0 1 2 20.007V3.993A1 1 0 0 1 2.992 3h18.016zM8 7a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
                        </g>
                    </svg>
                </div>

                <input type="file"
                    ref={(elem) => varstore.audio = elem}
                    onChange={(e) => onChangeAudio(e)}
                    placeholder="song"
                />
                <div className="icon" onClick={() => varstore.audio.click()}>
                    <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-1om0hkc" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="LibraryMusicIcon"><path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 5h-3v5.5c0 1.38-1.12 2.5-2.5 2.5S10 13.88 10 12.5s1.12-2.5 2.5-2.5c.57 0 1.08.19 1.5.51V5h4v2zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"></path></svg>
                </div>
                <button onClick={() => onUploadSong()}>upload</button>
            </div>
        </div>
    )
}
