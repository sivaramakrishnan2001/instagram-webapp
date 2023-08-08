import React, { useEffect, useState } from 'react';
import { APIsPath } from '../../connector/APIsPath';
import { GetRequest } from '../../connector/APIsCommunicator';
import Music from "../../assets/images/gif/sound.gif";
import { DrawerPopup } from '../drawerpopup/DrawerPopup';
import { StickyNotesMusic } from './StickyNotesMusic';
import { CreateStickyNotes } from './CreateStickyNotes';

export const StickyNotes = () => {

    const [stickynotes, setStickyNotes] = useState([]);
    const [showsongs, setShowSongs] = useState(false);
    const [selectedstickynote, setSelectedStickyNote] = useState({});
    const [reload, setReload] = useState(false);
    const [mydetails, setMyDetails] = useState({});
    const [type, setType] = useState('');


    // ==============================================================

    useEffect(() => {
        setMyDetails(JSON.parse(localStorage.getItem("user")))
        onGetAllStickyNotes();
    }, []);

    const onOuterClick = () => {
        setShowSongs(false);
    }

    const onChange=()=>{
        onGetAllStickyNotes();
        setShowSongs(false);
    }

    // ==============================================================

    const onGetAllStickyNotes = () => {
        var data = {};
        GetRequest(APIsPath.GetAllStickyNotes, data, parseGetAllStickyNotesResponse, parseGetAllStickyNotesError);
    }

    const parseGetAllStickyNotesResponse = (resObj) => {
        let list = resObj.data;
        if (resObj.status) {
            for (let index = 0; index < list.length; index++) {
                const element = list[index];
                if (element.song && element.song.song) {
                    element.audioplay = false;
                }
            }
            setStickyNotes(list);
        }
        console.log("parseGetAllStickyNotesResponse", resObj, list);
    }

    const parseGetAllStickyNotesError = (err) => {
        alert("err");
        console.log("parseGetAllStickyNotesError", err);
    }
    // ==============================================================
    // ==============================================================

    return (
        <div className='stickynotes-container'>
            <div class="story add stickynotes">
                <img alt="profile" src={mydetails?.profile} />
                <svg onClick={() => { setType('create'); setShowSongs(true); }} aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path>
                </svg>
            </div>
            {stickynotes.map((row, key) => {
                return (
                    <div className="stickynotes" key={key}>
                        <img src={row.song.img} />
                        <div className="content" onClick={() => {
                            setSelectedStickyNote(row);
                            setShowSongs(true);
                        }}>
                            <img src={Music} />
                            <div className="title">{row.title}</div>
                        </div>
                    </div>
                )
            })}

            {showsongs &&
                <DrawerPopup size="default" position="right" isopen={showsongs} className="sample"
                    content={type === "create" ? <CreateStickyNotes onChange={() => onChange()} /> : <StickyNotesMusic StickyNote={selectedstickynote} />}
                    OuterClick={() => onOuterClick()}
                />
            }


        </div>
    )
}
