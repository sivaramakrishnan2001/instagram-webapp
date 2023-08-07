import React from 'react';
import { Route, Routes } from 'react-router';

export const Application = () => {
    return (
        <div>
            Application
            <Routes>
                <Route path="/app/reels" element={<div>reels</div>} />
            </Routes>
        </div>
    )
};
