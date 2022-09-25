import { Magic } from 'magic-sdk';
export const magic = new Magic(process.env.REACT_APP_MAGIC_PUBLISHABLE_KEY);

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import Loading from './Loading';

export default function Dashboard() {
    const [userMetadata, setUserMetadata] = useState();
    const history = useNavigate();

    useEffect(() => {
        // On mount, we check if a user is logged in.
        // If so, we'll retrieve the authenticated user's profile.
        magic.user.isLoggedIn().then((magicIsLoggedIn) => {
            if (magicIsLoggedIn) {
                magic.user.getMetadata().then(setUserMetadata);
            } else {
                // If no user is logged in, redirect to `/login`
                history('/login');
            }
        });
    }, []);

    /**
     * Perform logout action via Magic.
     */
    const logout = useCallback(() => {
        magic.user.logout().then(() => {
            history('/login');
        });
    }, [history]);

    return userMetadata ? (<div>
        <div className='container'>
            <h1>Current user: {userMetadata.email}</h1>
            <button onClick={logout}>Logout</button>
        </div>
        <div><a
            className="App-link"
            href="http://localhost:3002"
        //rel="noopener noreferrer"
        >
            Go to dashboard!
        </a></div></div>
    ) : (
        <Loading />
    );
}