import React, { useEffect, useState } from 'react';
import { GetRequest } from '../../connector/APIsCommunicator';
import { APIsPath } from '../../connector/APIsPath';

export const LeftSilder = (props) => {

    const [users, setUsers] = useState([]);

    // ==============================================================

    useEffect(() => {
        getUsers();

    }, []);

    // ==============================================================
    // onClick

    const onClickUser = (row) => {
        props.onClick && props.onClick(row);
    }

    // ==============================================================
    // API Call Funcions

    const getUsers = () => {
        GetRequest(APIsPath.GetUsers, {}, parseGetUsersResponse, parseGetUsersError);
    }

    const parseGetUsersResponse = (resObj) => {
        if (!resObj.status) return;
        setUsers(resObj.data);
    }

    const parseGetUsersError = (err) => {
        alert(err.message);
    }

    // ==============================================================
    if (!users) return "loading...";
    return (
        <div className='users'>
            {users.map((row, key) => {
                return (
                    <div className='user' key={key} onClick={() => onClickUser(row)}>
                        <div className="profile">
                            <img src={row.profile} alt="" />
                        </div>
                        <div className="name">{row.name}</div>
                    </div>
                )
            })}
        </div>
    )
}
