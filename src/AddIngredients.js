import React, { useState } from 'react';
import axios from 'axios';

function AddIngredients({ onIngredientAdded }) {
    const [username, setUsername] = useState('');
    const [ingredientName, setIngredientName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');
    const [message, setMessage] = useState('');
    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('token'); // Retrieve JWT token from localStorage

        if (!token) {
            setMessage('Error: You must be logged in first.');
            return;
        }

        try {
            const response = await axios.post(
                'http://127.0.0.1:5000/api/fridge/add-ingredient',
                {
                    ingredientName,
                    quantity,
                    unit
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`  // Send the JWT token in the Authorization header
                    }
                }
            );
            setMessage(response.data.message);

            setIngredientName('');
            setQuantity('');
            setUnit('');

            // Trigger the ingredients refresh by calling the callback function
            onIngredientAdded();

        } catch (error) {
            setMessage('Error: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Ingredient Name"
                    value={ingredientName}
                    onChange={(e) => setIngredientName(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Unit (e.g., kg, liters)"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    required
                />
                <button type="submit" class="btn">Add Ingredient</button>
            </form>
            <p>{message}</p>
        </div>
    );
}

export default AddIngredients;
