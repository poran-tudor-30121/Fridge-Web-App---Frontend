import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';  // To access the reset token from the URL
import axios from 'axios';
import LeftImage from "./pictures/FloatingFridge.png";
import RightImage from "./pictures/FloatingFridge.png";

function ResetPassword() {
    const { resetToken } = useParams();  // Get the token from the URL
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handlePasswordReset = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            // Send the new password to the backend
            const response = await axios.post(`http://127.0.0.1:5000/api/password_reset/reset-password/${resetToken}`, {
                password
            });

            setMessage('Password has been successfully reset!');
            setError('');

            // Optionally, navigate to the login page after a short delay
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            setError('Error: ' + (error.response?.data?.message || 'Failed to reset password.'));
        }
    };

    return (
        <div className="login-container">
            <img src={LeftImage} alt="Floating Left" className="floating-image left" />
            <img src={RightImage} alt="Floating Right" className="floating-image right" />
        <div className="login-box">
            <h2>Reset Password</h2>
            <form onSubmit={handlePasswordReset}>
                <div className="input-group">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                    />
                </div>
                <button type="submit" className="login-button">Reset Password</button>
            </form>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
        </div>
    );
}

export default ResetPassword;
