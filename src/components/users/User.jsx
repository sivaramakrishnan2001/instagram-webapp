import React from 'react'
import { GetRequest } from '../../connector/APIsCommunicator';
import { APIsPath } from '../../connector/APIsPath';

export const User = () => {

    const getProfileApi = () => {
        GetRequest(APIsPath.GetUser`/${'63b9bbdbaa47ab551992e409'}`, parseGetProfileResponse, parseGetProfileError);

    }

    const parseGetProfileResponse = (resObj) => {
        console.log("resObj", resObj);
        if (resObj.status) {

        }
    }

    const parseGetProfileError = (err) => {
        console.log("parseGetProfileError", err);
    }

    return (
        <div>User</div>
    )
}
