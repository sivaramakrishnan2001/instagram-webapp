import React, { useState } from 'react';
import './drawerpopup.css';
import { useEffect } from 'react';

export const DrawerPopup = props => {

    // size = "default" , "full" , "auto";
    // position = "left" , "right" , "bottom" ,"top"
    // isopen = true , false
    // content = {<App />}
    // className ="sample"

    // ==============================================================

    return (
        <div className="overlay-modal"
            onClick={() => props.OuterClick()}
            tabIndex={0}
        >
            <div className={
                props.size.toLowerCase() === "default" || "full" || "auto" &&
                    props.position.toLowerCase() === "left" || "right" || "bottom" || "top" &&
                    props.isopen.toLowerCase() === true || false || "true" || "false"
                    ?
                    "drawerpopup-" + props.size.toLowerCase() + " " + "drawerpopup-" + props.position?.toLowerCase() + " " +
                    "drawerpopup-" + props.isopen?.toString().toLowerCase() + " " + props.className
                    : "drawerpopup-defaultsize drawerpopup-right drawerpopup-false"}
                onClick={(e) => e.stopPropagation()}
            >
                {props.content ? props.content : <div>DrawerPopup</div>}
            </div>
        </div>
    )

}


