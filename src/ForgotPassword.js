import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For navigation

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleForgotPassword = async (event) => {
        event.preventDefault();

        try {
            // Send a request to the backend to initiate password reset
            const response = await axios.post('http://127.0.0.1:5000/api/password_reset/request-reset', {
                email
            });

            // Show a success message
            setMessage('Password reset link has been sent to your email.');
            setError('');  // Clear any previous errors

            // Optional: Navigate back to login after a short delay
            setTimeout(() => navigate('/login'), 3000);

        } catch (error) {
            setMessage('');
            setError('Error: ' + (error.response?.data?.message || 'Failed to send reset email.'));
        }
    };

    return (
        <div className="forgot-password-container">
            <h2>Forgot Password?</h2>
            <p>Enter your email below to receive a password reset link.</p>
            <form onSubmit={handleForgotPassword}>
                <div className="input-group">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <button type="submit" className="forgot-password-button">Send Reset Link</button>
            </form>
            {message && <p className="success-message">{message}</p>}  {/* Show success message */}
            {error && <p className="error-message">{error}</p>}        {/* Show error message */}
        </div>
    );
}

export default ForgotPassword;
