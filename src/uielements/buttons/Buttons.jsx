import React from 'react';

export const GoogleSignInButton = (props) => {
    return (
        <div className='g-sign-in-button'>
            <div className="content-wrapper" onClick={(e) => props.onClick(e)}>
                <div className='logo-wrapper'>
                    <img src='https://developers.google.com/identity/images/g-logo.png' />
                </div>
                <span className='text-container'>
                    <span>Sign in with Google</span>
                </span>
            </div>
        </div>
    )
}
