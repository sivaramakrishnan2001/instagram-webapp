import React, { useState } from 'react';

export const MessageBox = (props) => {

    const [message, setMessage] = useState("");
    const [url, setUrl] = useState("");

    // ==============================================================

    const onMessageChange = (e) => {
        setMessage(e.target.value);
    }

    // ==============================================================

    const onSend = () => {
        if (!props.onSend) return;
        if (url) {
            props.onSend(url);
        } else {
            props.onSend(message);
            setMessage("");
        }
    }

    // ==============================================================

    return (
        <div>
            <div className="emoji"></div>
            <input type="text"
                value={message}
                placeholder='message...'
                onChange={(e) => onMessageChange(e)}
            />
            {message ?
                <button onClick={() => onSend()}>Send</button> :
                <div className="camera">

                </div>
            }
        </div>
    )
}
