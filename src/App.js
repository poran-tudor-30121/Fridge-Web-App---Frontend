import React from 'react';
import './css/App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserRegistration from './UserRegistration';
import AddIngredients from './AddIngredients';
import ViewIngredients from './ViewIngredients';
import UserLogin from "./UserLogin";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UserLogin />} />
                <Route path="/login" element={<UserLogin />} />
                <Route path ="/register" element={<UserRegistration />}/>
                <Route path="/add-ingredient" element={<AddIngredients />} />
                <Route path="/view-ingredients" element={<ViewIngredients />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
            </Routes>
        </Router>
    );
}

export default App;
