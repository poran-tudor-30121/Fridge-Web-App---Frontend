import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/Login.css';  // Import your styles
import FridgeImage from './pictures/DesignLogin.png';  // Fridge image
import LeftImage from './pictures/FloatingFridge.png';  // Floating images for design
import RightImage from './pictures/FloatingFridge.png';
function UserRegistration() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:5000/api/auth/register', {
                username,
                email,
                password
            });
            setMessage(response.data.message);
            navigate('/login');
        } catch (error) {
            setMessage('Error: ' + error.response.data.message);
        }
    };

    return (
     <div className="login-container">
            {/* Floating decorative images */}
            <img src={LeftImage} alt="Floating Left" className="floating-image left" />
            <img src={RightImage} alt="Floating Right" className="floating-image right" />
         <div className="login-box">
             {/* Fridge image */}
             <img src={FridgeImage} alt="Cute Fridge" className="fridge-image" />

             <h2>Fill up your FWIDGE!</h2>
        <div>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                </div>
                <div className="input-group">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                </div>
                <div className="input-group">
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                </div>
                <button type="submit" className="register-button" >Register</button>
            </form>
            <p>{message}</p>
        </div>
         </div>
     </div>
    );
}

export default UserRegistration;
