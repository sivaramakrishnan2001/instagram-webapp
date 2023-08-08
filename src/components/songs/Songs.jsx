import React, { useEffect, useState } from 'react'
import { GetRequest } from '../../connector/APIsCommunicator';
import { APIsPath } from '../../connector/APIsPath';
import { DropdownWithInputSearch } from '../../uielements/DropdownWithSearchInput/DropdownWithInputSearch';

export const Songs = (props) => {

    const [songs, setSongs] = useState([]);

    // ==============================================================

    useEffect(() => {
        onGetAllSongs();

    }, []);

    // const songs = [
    //     { name: "vue" },
    //     { name: "element" },
    //     { name: "cooking" },
    //     { name: "mint-ui" },
    //     { name: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ratione," },
    //     { name: "vuex" },
    //     { name: "vue-router" },
    //     { name: "babel" },
    //     { name: "vue js  reactjs" },
    //     { name: "layout" },
    //     { name: "dropdown  draganddrop" },
    //     { name: "design" },
    // ]

    // ==============================================================

    const onSelectedValue = (selectedValue) => {
        console.log("selectedValue", selectedValue);

    }

    // ==============================================================

    const onGetAllSongs = () => {
        var reqObj = {};
        GetRequest(APIsPath.GetAllSongs, reqObj, parseGetAllSongsResponse, parseGetAllSongsError);

    }

    const parseGetAllSongsResponse = (resObj) => {
        if (resObj.status) {
            setSongs(resObj.data);
        }
        console.log("parseGetAllSongsResponse", resObj);

    }

    const parseGetAllSongsError = (err) => {
        console.log("parseGetAllSongsError", err);

    }

    // ==============================================================

    return (
        <div className='songs-container' onClick={(e) => e.stopPropagation()}>
            <div className="header">
                <DropdownWithInputSearch
                    className="sample"
                    placeholder="Search Songs"
                    isEnableRotation={true}
                    list={songs}
                    selectedValue={onSelectedValue}
                />
            </div>
            <div className='songs'>
                {songs?.map((row, key) => {
                    return (
                        <div className="song" key={key}>
                            <div className="song-card">
                                <img src={row.img} />
                                <audio controls id="beep" >
                                    <source src={row.song} type="audio/mp3"  />
                                </audio>
                            </div>
                            <button onClick={() => props.onSelectedSong(row, key)}>add</button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
