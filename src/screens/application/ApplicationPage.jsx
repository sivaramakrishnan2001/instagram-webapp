import React, { useContext, useEffect, useState } from 'react';
import { Content } from '../../components/application/Content';
import { LeftMenu } from '../../components/application/LeftMenu';
import { AppScreensKeys, Components, ComponentsKeys, LocalStorageKeys, SessionStorageKeys } from '../../connector/AppConfig';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { GetRequest } from '../../connector/APIsCommunicator';
import { APIsPath } from '../../connector/APIsPath';
import { AuthContext } from '../../comman/Context';
import { Mnavbar } from '../../uielements/mobile/navbar/Mnavbar';

export const ApplicationPage = (props) => {

    const params = useParams();
    const location = useLocation();
    const auth = useContext(AuthContext);
    const [menu, setMenu] = useState(false);
    const navigator = useNavigate();
    const [selected, setSelected] = useState(Components[0]);
    const [mydetails, setMyDetails] = useState({});
    const [reload, setReload] = useState(false);
    const [selectleftmenu, setSelectLeftMenu] = useState({});

    // ==============================================================

    useEffect(() => {
        console.log("auth", auth.auth.width);
        // window.addEventListener("resize", ()=>{
        //     console.log("---------");
        // });


        setMyDetails(JSON.parse(localStorage.getItem("user")));
        if (mydetails._id) {
            getProfileApi();
        }

        if (params.userId) {
            if (location.pathname === AppScreensKeys.Home + "/" + ComponentsKeys.USERPROFILE + "/" + params.userId) {
                navigator(AppScreensKeys.Home + "/" + ComponentsKeys.USERPROFILE + "/" + params.userId);
            }

            // setSelected(obj);
            setSelectLeftMenu(Components.filter((i) => i.id === ComponentsKeys.USERPROFILE)[0]);

            // window.location.replace(AppScreensKeys.Home + "/" + ComponentsKeys.USERPROFILE + "/" + params.userId)
        }

        if (sessionStorage.getItem(SessionStorageKeys.ActiveMenu)) {
            let id = sessionStorage.getItem(SessionStorageKeys.ActiveMenu)[0]?.id;
            let obj = Components.filter((i) => i.id === id);
            setSelectLeftMenu(obj);
            // if (obj.id === "userprofile") {
            // setSelected();
            // navigator(AppScreensKeys.Home + "/" + ComponentsKeys.USERPROFILE + "/" + params.userId);
            // }
        }


    }, []);

    useEffect(() => {
        let obj;

        if (params.userId) {
            if (params.userId === mydetails._id) {
                console.log("true-->");
                obj = Components.filter((i) => i.id === ComponentsKeys.PROFILE)[0];
                obj.userid = params.userId;
                // setSelected(obj);
                setSelectLeftMenu(obj);

            }
            else {

                obj = Components.filter((i) => i.id === ComponentsKeys.USERPROFILE)[0];
                obj.userid = params.userId;

                // setSelected(obj);
                setSelectLeftMenu(obj);
            }
        }
        // if (params.userId) {
        //     if (JSON.parse(localStorage.getItem("user"))?._id === params.userId) {
        //         setSelected(Components.filter((i) => i.id === ComponentsKeys.PROFILE)[0]);
        //     } else {
        //         setSelected(Components.filter((i) => i.id === ComponentsKeys.USERPROFILE)[0]);
        //     }
        // }
        // setReload(ps => !ps);

    }, [params.userId]);


    useEffect(() => {
        if (selected.id === ComponentsKeys.HOME) {
            navigator(AppScreensKeys.Home + "/");
        }
        else if (selected.id === ComponentsKeys.SEARCH) {
            navigator(AppScreensKeys.Home + "/" + ComponentsKeys.SEARCH);
        }
        else if (selected.id === ComponentsKeys.EXPLORE) {
            navigator(AppScreensKeys.Home + "/" + ComponentsKeys.EXPLORE);
        }
        else if (selected.id === ComponentsKeys.REELS) {
            navigator(AppScreensKeys.Home + "/" + ComponentsKeys.REELS);
        }
        else if (selected.id === ComponentsKeys.MESSAGES) {
            navigator(AppScreensKeys.Home + "/" + ComponentsKeys.MESSAGES);
        }
        else if (selected.id === ComponentsKeys.NOTIFICATIONS) {
            navigator(AppScreensKeys.Home + "/" + ComponentsKeys.NOTIFICATIONS);
        }
        else if (selected.id === ComponentsKeys.CREATE) {
            navigator(AppScreensKeys.Home + "/" + ComponentsKeys.CREATE);
        }
        else if (selected.id === ComponentsKeys.PROFILE) {
            navigator(AppScreensKeys.Home + "/" + ComponentsKeys.PROFILE + "/" + JSON.parse(localStorage.getItem("user"))?._id);
        }
        else if (selected.id === ComponentsKeys.USERPROFILE) {
            // navigator(AppScreensKeys.Home + "/" + ComponentsKeys.USERPROFILE + "/" + JSON.parse(localStorage.getItem("user"))?._id);
        }
        console.log("selected.id", selected.id);
        sessionStorage.setItem(SessionStorageKeys.ActiveMenu, selected.id)
        setReload((ps) => !ps);

    }, [selected]);

    const onSelected = (row) => {
        setSelected(row);
    }

    // ==============================================================

    const getProfileApi = () => {
        GetRequest(APIsPath.GetProfile + "/" + mydetails._id, {}, parseGetProfileResponse, parseGetProfileError);
    }

    const parseGetProfileResponse = (resObj) => {
        if (resObj.status) {
            setMyDetails(resObj.data.profile);
            localStorage.setItem("user", JSON.stringify(resObj.data.profile));
        }
    }

    const parseGetProfileError = (err) => {
        console.log("parseGetProfileError", err);
    }

    // ==============================================================

    return (
        <div className='application-page' style={{ width: auth.auth.width <= 500 ? auth.auth.width + "px" : "" }}>
            {auth.auth.width >= 500 ?
                <LeftMenu active={menu} onSelected={(row) => onSelected(row)} selected={selectleftmenu} />
                : ""
            }


            <Content selected={selected} />
            {auth.auth.width <= 500 ?
                <Mnavbar onSelected={(row) => onSelected(row)} selected={selectleftmenu} />
                : ""
            }
        </div>
    )
}
