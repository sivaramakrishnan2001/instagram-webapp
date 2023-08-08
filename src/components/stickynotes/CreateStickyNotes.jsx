import React, { useRef, useState } from 'react';
import { DrawerPopup } from '../drawerpopup/DrawerPopup';
import { Songs } from '../songs/Songs';
import { PostRequest } from '../../connector/APIsCommunicator';
import { APIsPath } from '../../connector/APIsPath';

export const CreateStickyNotes = (props) => {

    const varstore = useRef();
    const [stickynotes, setStickyNotes] = useState({
        title: "",
        song: {},
    });
    const [showsongs, setShowSongs] = useState(false);
    const [reload, setReload] = useState(false);

    // ==============================================================

    const onSelectedSong = (row) => {
        setStickyNotes({ ...stickynotes, song: row });
        setShowSongs(false);
    }

    // ==============================================================

    const onOuterClick = () => {
        setShowSongs(false);
    }

    const onClickCreateStickyNote = () => {
        onCreateStickyNote();
    }

    // ==============================================================

    const onCreateStickyNote = () => {
        var data = {
            body: stickynotes
        };
        if (data.body.song.song) {
            PostRequest(APIsPath.CreateStickyNotes, data, parseCreateStickyNoteResponse, parseCreateStickyNoteError);
        }
    }

    const parseCreateStickyNoteResponse = (resObj) => {
        if (resObj.status) {
            alert("updated");
            props.onChange();
        }
        console.log("parseCreateStickyNoteResponse", resObj);
    }

    const parseCreateStickyNoteError = (err) => {
        alert("err");
    }

    // ==============================================================

    return (

        <React.Fragment>
            <div className="createstickynotes">
            
                <div className='content'>
                
                    <input
                        ref={(elem) => varstore.title = elem} type="text"
                        value={stickynotes.title}
                        placeholder='title'
                        onChange={(e) => setStickyNotes({ ...stickynotes, title: e.target.value })}
                    />

                    <button onClick={() => setShowSongs(true)}>add songs</button>
                    <button onClick={() => onClickCreateStickyNote()}>CreateStickyNotes</button>
                </div>
            </div>

            {showsongs &&
                <DrawerPopup size="default" position="left" isopen={showsongs} className="sample"
                    content={<Songs onSelectedSong={(row) => onSelectedSong(row)} />}
                    OuterClick={onOuterClick}
                />
            }
        </React.Fragment>
    )
}
