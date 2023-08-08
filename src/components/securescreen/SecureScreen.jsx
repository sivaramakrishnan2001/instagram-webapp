import React, { useEffect } from 'react'
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { AppScreensKeys, LocalStorageKeys } from '../../connector/AppConfig';

export const SecureScreen = ({ children }) => {
  const param = useParams();
  const location = useLocation();

  useEffect(() => {
    console.log("SecureScreen param ", param);
  }, []);

  if (!LocalStorageKeys.token && !location.state) {
    // not logged in so redirect to login page with the return url
    return <Navigate to={AppScreensKeys.Login} />
  }

  // authorized so return child components
  return children;
}
