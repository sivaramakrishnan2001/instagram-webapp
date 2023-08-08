import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIsPath } from '../../connector/APIsPath';
import { AppScreensKeys } from '../../connector/AppConfig';
import { PostRequest } from '../../connector/APIsCommunicator';


export const SignUp = () => {

    const varstore = useRef(null);
    const navigate = useNavigate();

    // ==============================================================

    useEffect(() => {
        varstore.name.focus();
        varstore.name.value = "";
        varstore.email.value = "";
        varstore.password.value = "";

    }, []);

    // ==============================================================
    // onClick

    const onSignUp = () => {
        onSignUpApiCall();

    }

    // ==============================================================
    // APIs

    const onSignUpApiCall = () => {
        var data = {
            body: {
                name: varstore.name.value, email: varstore.email.value, password: varstore.password.value
            }
        };
        PostRequest(APIsPath.SignUp, data, parseSignUpApiCallResponse, parseSignUpApiCallError);
    }

    const parseSignUpApiCallResponse = (res) => {
        if (res.status) {
            alert("updated", res);
            varstore.name.value = "";
            varstore.email.value = "";
            varstore.password.value = "";

            navigate(AppScreensKeys.Login, {
                state: {
                    data: res.data
                }
            });
        }
        console.log("parseSignUpApiCallResponse", res);

    }

    const parseSignUpApiCallError = (err) => {
        alert("err");
        console.log("parseSignUpApiCallError", err);
    }

    // ==============================================================

    return (
        <div className='card'>
            <input
                ref={(elem) => varstore.name = elem} type="text"
                value={varstore.name}
                placeholder='name'
                onKeyDown={(e) => e.key === "Enter" ? varstore.email.focus() : ""} />
            <input
                ref={(elem) => varstore.email = elem}
                type="text"
                value={varstore.email}
                placeholder='email'
                onKeyDown={(e) => e.key === "Enter" ? varstore.password.focus() : ""} />
            <input
                ref={(elem) => varstore.password = elem}
                type="text"
                value={varstore.password}
                placeholder='password'
                onKeyDown={(e) => e.key === "Enter" ? onSignUp() : ""} />
            <button onClick={() => onSignUp()}>signup</button>
        </div>
    )
}


