import React, { useState } from 'react';
import axios from 'axios';
import './css/Login.css';  // Import your styles
import { useNavigate } from 'react-router-dom';  // To redirect the user after login
import FridgeImage from './pictures/DesignLogin.png';  // Fridge image
import LeftImage from './pictures/FloatingFridge.png';  // Floating images for design
import RightImage from './pictures/FloatingFridge.png';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();  // To navigate to a different page after successful login

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:5000/api/auth/login', {
                email,
                password
            });

            // Save the token in localStorage (or sessionStorage)
            localStorage.setItem('token', response.data.token);
            navigate('/view-ingredients');

        } catch (error) {
            setMessage('Error: ' + (error.response?.data?.message || 'Invalid credentials'));
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

                <h2>Welcome to Fwidge!</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
                <div className="extra-links">
                    <a href="/forgot-password">Forgot password? </a>
                    <a href="/register">Create an account</a>
                </div>
                {message && <p className="error-message">{message}</p>}  {/* Display error message */}
            </div>
        </div>
    );
}


export default Login;
