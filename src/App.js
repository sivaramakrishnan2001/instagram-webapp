import React, { useEffect, useState } from 'react';
import {
    Routes,
    Route,
} from "react-router-dom";
import { Test } from './components/test/Test';
import { ApplicationPage } from './screens/application/ApplicationPage';
import { LoginPage } from './screens/authentication/login/LoginPage';
import { SignUpPage } from './screens/authentication/signup/SignUpPage';
import { AppScreensKeys, ComponentsKeys } from './connector/AppConfig';
// import { getTokenFromFirebase } from './firebase';
// import './firebase';
import "./messaging_init_in_sw";
import { AuthContext } from './comman/Context';
import { Mnavbar } from './uielements/mobile/navbar/Mnavbar';


export const App = () => {

    const [state, setState] = useState({
        width: 0
    });

    useEffect(() => {
        const handleWindowResize = () => {
            setState({ ...state, width: window.innerWidth });
        };

        window.addEventListener('resize', handleWindowResize);
        setState({ ...state, width: window.innerWidth, token: JSON.parse(localStorage.getItem("token")) });

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };

    }, []);

    if (state.width === 0) return;

    return (
        <React.Fragment>
            <AuthContext.Provider value={{ auth: state }}>
                <Routes>
                    <Route exact path="/" element={<LoginPage />} />
                    <Route exact path="/signup" element={<SignUpPage />} />
                    <Route exact path="/login" element={<LoginPage />} />
                    <Route exact path={AppScreensKeys.Home} element={<ApplicationPage />} />
                    <Route exact path={AppScreensKeys.Home + "/" + ComponentsKeys.STORYS} element={<ApplicationPage />} />
                    <Route exact path={AppScreensKeys.Home + "/" + ComponentsKeys.SEARCH} element={<ApplicationPage />} />
                    <Route exact path={AppScreensKeys.Home + "/" + ComponentsKeys.EXPLORE} element={<ApplicationPage />} />
                    <Route exact path={AppScreensKeys.Home + "/" + ComponentsKeys.REELS} element={<ApplicationPage />} />
                    <Route exact path={AppScreensKeys.Home + "/" + ComponentsKeys.MESSAGES} element={<ApplicationPage />} />
                    <Route exact path={AppScreensKeys.Home + "/" + ComponentsKeys.NOTIFICATIONS} element={<ApplicationPage />} />
                    <Route exact path={AppScreensKeys.Home + "/" + ComponentsKeys.PROFILE + "/:userId"} element={<ApplicationPage />} />
                    <Route exact path={AppScreensKeys.Home + "/" + ComponentsKeys.CREATE} element={<ApplicationPage />} />
                    <Route exact path={AppScreensKeys.Home + "/" + ComponentsKeys.USERPROFILE + "/:userId"} element={
                        <ApplicationPage currentpage="userprofile" />
                    } />
                    <Route exact path="/test" element={<Test />} />
                    <Route path="*" element={<div>Not found Error Blank Page</div>} />
                </Routes>

            </AuthContext.Provider>
        </React.Fragment>
    )
}



