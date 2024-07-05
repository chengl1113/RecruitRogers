"use client"
import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function Profile() {
    const [ user, setUser ] = useState(null);
    const [ profile, setProfile ] = useState(null);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            setUser(codeResponse),
            sessionStorage.setItem('token', codeResponse.access_token)
            },
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect( () => {
        const token = sessionStorage.getItem('token');
        console.log(token);
        if (token) {
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {
                    console.log("yoyoyo")
                    setProfile(res.data);
                })
                .catch((err) => console.log(err));
        }
    }, [ user ]);

    // log out function to log the user out of google and set the profile array to null
    const logOut = () => {
        googleLogout();
        setProfile(null);
        sessionStorage.removeItem('token');
    };

    return (
        <div>
            <h2>Profile</h2>
            <br />
            <br />
            {profile ? (
                <div className='container'>
                    <img src={profile.picture} alt="user image" />
                    <h3>User Logged in</h3>
                    <p>Name: {profile.name}</p>
                    <p>Email Address: {profile.email}</p>
                    <br />
                    <br />
                    <button onClick={logOut}>Log out</button>
                </div>
            ) : (
                <button onClick={() => login()}>Sign in with Google 🚀 </button>
            )}
        </div>
    );
}   

export default Profile;