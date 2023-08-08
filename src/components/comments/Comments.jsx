import React, { useState } from 'react';



export const Comments = (props) => {

    const [message, setMessage] = useState("");

    // ==================================================================

    const onSend = () => {
        if (message) {
            props?.onChange(message);
            setMessage("");
        }
    }

    const keyDown = (event) => {
        console.log("asadas");
        if (event.key === "Enter" || event.charCode === 13) {
            onSend();
        }
    }

    // ==================================================================

    return (
        <div className="chat-box">
            <div className="logo">
                <img src={props.profile} />
            </div>
            <input type="text" placeholder='Add a comment' onKeyDown={(e) => keyDown(e)} value={message} onChange={(e) => setMessage(e.target.value)} />
            <div className="send" onClick={() => onSend()} >
                <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SendIcon"><path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
            </div>

        </div>
    )
}
