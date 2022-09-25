import React from 'react';
import logo from '../../assets/img/dframe.png';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';

const Login = () => {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} alt="logo" />
                <h2>
                    Welcome to Dframe
                </h2>

            </header>
            <a
                className="App-link"
                href="http://localhost:3002"
            //rel="noopener noreferrer"
            >
                Start!
            </a>
        </div>
    );
};

export default Login;
