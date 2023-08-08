import React, { useState } from 'react';
import { DeleteRequest } from '../../../connector/APIsCommunicator';
import { APIsPath } from '../../../connector/APIsPath';
import { AppScreensKeys, ComponentsKeys, LocalStorageKeys } from '../../../connector/AppConfig';
import { deleteObject, getStorage, ref } from 'firebase/storage';

export const MoreOptions = props => {

    const options = [
        { id: "unfollow", icon: "", name: "Unfollow" },
        { id: "addtofavorites", icon: "", name: "Add to favorites" },
        { id: "gotopost", icon: "", name: "Go to post" },
        { id: "delete", icon: "", name: "Delete" },
        { id: "edit", icon: "", name: "Edit info" },
        { id: "share", icon: "", name: "Share to..." },
        { id: "copylink", icon: "", name: "Copy link" },
        { id: "cancel", icon: "", name: "Cancel" },
    ]
    const [isCopied, setIsCopied] = useState(false);

    // ==================================================================

    const onOptionClick = (row) => {
        switch (row.id) {
            case "delete": onDeletePostFileFireBaseStorage();
            case "copylink": handleCopy(row._id);


            default:
                break;
        }

    }

    const handleCopy = (id) => {
        const textToCopy = AppScreensKeys.Home + "/" + ComponentsKeys.POSTS + "/" + props.selectedpost._id;
        console.log("textToCopy", textToCopy);
        // Create a temporary textarea element
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);

        // Select and copy the text
        textarea.select();
        document.execCommand('copy');

        // Clean up
        document.body.removeChild(textarea);

        setIsCopied(true);
    };

    // ==================================================================

    const onDeletePostFileFireBaseStorage = () => {
        const storage = getStorage();
        // Create a reference to the file to delete

        const desertRef = ref(storage, `${props.selectedpost.type === "video" ? 'videos' : 'images'}/${props.selectedpost.filename}`);

        // Delete the file
        deleteObject(desertRef).then((resObj) => {
            // File deleted successfully
            console.log("resObj", resObj);
            if (props.type === "video") {
                onDeleteReels();
            } else {
                onDeletePost();
            }
        }).catch((error) => {
            console.log("error", error);
            // Uh-oh, an error occurred!
        });
    }

    // ==================================================================

    const onDeletePost = () => {
        var reqObj = {
            body: {
                postid: props.selectedpost._id,
            }
        };
        console.log("reqObj", reqObj);
        DeleteRequest(APIsPath.DeletePost, reqObj, parseDeletePostResponse, parseDeletePostError);
    }

    const parseDeletePostResponse = (resObj) => {
        if (resObj.status) {
            alert(resObj.message)
        }
        console.log("parseDeletePostResponse", resObj);
    }

    const parseDeletePostError = (err) => {
        console.log("parseDeletePostError", err);
    }

    // ==================================================================
    // delete reels

    const onDeleteReels = () => {
        var reqObj = {
            body: {
                reelsid: props.selectedpost._id,
            }
        };
        console.log("reqObj", reqObj);
        DeleteRequest(APIsPath.DeleteReels, reqObj, parseDeleteReelsResponse, parseDeleteReelsError);
    }

    const parseDeleteReelsResponse = (resObj) => {
        if (resObj.status) {
            alert(resObj.message)
        }
        console.log("parseDeleteReelsResponse", resObj);
    }

    const parseDeleteReelsError = (err) => {
        console.log("parseDeleteReelsError", err);
    }

    // ==================================================================

    return (
        <div className='more-options-container'  >
            <div className="more-options" tabIndex={1} onClick={(e) => e.stopPropagation()}>
                {isCopied && <span>Text copied to clipboard!</span>}
                {options?.map((row, key) => {
                    return (
                        <div className="option" key={key} onClick={() => onOptionClick(row)}>
                            <div className="icon">{row.icon} </div>
                            <div className="name">{row.name}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
