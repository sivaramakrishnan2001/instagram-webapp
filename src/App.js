import React from 'react';
import { Route, Routes } from 'react-router';
import { Application } from './screens/application/Application';
import './App.css';
import { AppScreensKeys } from './connector/AppConfig';

export const App = () => {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<Application />} />
        <Route path="*" element={<div>Not found Error Blank Page</div>} />
      </Routes>
    </React.Fragment>
  );
}


