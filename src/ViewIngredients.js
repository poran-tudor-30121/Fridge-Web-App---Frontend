import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import AddIngredients from './AddIngredients';
import { useNavigate } from 'react-router-dom';
import './css/ViewIngredients.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

function ViewIngredients() {
    const [ingredients, setIngredients] = useState([]);
    const [message, setMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [activeRecipeIndex, setActiveRecipeIndex] = useState(null);
    const [showIngredients, setShowIngredients] = useState(false);
    const navigate = useNavigate();
    const [hasFetchedIngredients, setHasFetchedIngredients] = useState(false); // Track if ingredients are fetched
    const UNSPLASH_ACCESS_KEY = 'jZGBroXW0ZgT-pwuPDWZQgLzNv-y6Shs1t-rsxnQW3o'; // Replace with your actual Unsplash API key

    useEffect(() => {
        // Automatically trigger handleButtonClick when the component is mounted
        handleButtonClick();
    }, []); // Empty dependency array ensures this runs only once after the component mou


    const getIngredients = (recipe) => {
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = recipe[`strIngredient${i}`];
            if (ingredient && ingredient.trim() !== "") {
                ingredients.push(ingredient);
            }
        }
        return ingredients;
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('Error: No token found. Please log in.');
                return;
            }
            const response = await axios.get('http://127.0.0.1:5000/api/fridge/get-ingredients', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const ingredientsWithImages = await Promise.all(
                response.data.ingredients.map(async (ingredient) => {
                    const imageUrl = await fetchIngredientImage(ingredient.ingredientName);
                    return { ...ingredient, imageUrl };
                })
            );
            setIngredients(ingredientsWithImages);
        } catch (error) {
            setMessage('Error: ' + (error.response ? error.response.data.message : 'Unable to fetch ingredients'));
        }
    };

    const fetchIngredientImage = async (ingredientName) => {
        try {
            const response = await axios.get(
                `https://api.unsplash.com/search/photos`,
                {
                    params: {
                        query: ingredientName,
                        client_id: UNSPLASH_ACCESS_KEY,
                        per_page: 1
                    }
                }
            );
            return response.data.results[0]?.urls?.small || '';
        } catch (error) {
            console.error('Error fetching image:', error);
            return '';
        }
    };

    const fetchIngredientImage1 = async (ingredientName) => {
        try {
            // Format the ingredient name by replacing spaces with underscores
            const formattedIngredientName = ingredientName.replace(/\s+/g, '%20');

            // Construct the image URL using TheMealDB image URL structure
            const imageUrl = `https://www.themealdb.com/images/ingredients/${formattedIngredientName}.png`;

            // Optionally, you can perform a fetch to check if the image exists, or simply return the URL
            // Here we assume the URL will exist and return it directly
            return imageUrl;
        } catch (error) {
            console.error('Error generating image URL:', error);
            return '';
        }
    };

    const handleFindRecipes = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('Error: No token found. Please log in.');
                return;
            }
            const response = await axios.get('http://127.0.0.1:5000/api/fridge/find-recipes', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRecipes(response.data);
            console.log(response.data);

        } catch (error) {
            setMessage('Error: ' + (error.response ? error.response.data.message : 'Unable to fetch recipes'));
        }
    };

    const handleButtonClick = async (event) => {
        // Only call event.preventDefault if this function is triggered by a button click event
        if (event) event.preventDefault();

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('Error: No token found. Please log in.');
                return;
            }

            // Fetch ingredients from API
            const response = await axios.get('http://127.0.0.1:5000/api/fridge/get-ingredients', {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Fetch image URLs for ingredients
            const ingredientsWithImages = await Promise.all(
                response.data.ingredients.map(async (ingredient) => {
                    const imageUrl = await fetchIngredientImage1(ingredient.ingredientName);
                    return { ...ingredient, imageUrl };
                })
            );

            setIngredients(ingredientsWithImages);
            setHasFetchedIngredients(true); // Set the flag to true after fetching ingredients

            // Only toggle visibility if ingredients have been fetched
            setShowIngredients(true); // Show ingredients directly since it's on page load

        } catch (error) {
            setMessage('Error: ' + (error.response ? error.response.data.message : 'Unable to fetch ingredients'));
        }
    };

    const toggleRecipeDetails = (index) => {
        setActiveRecipeIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleDelete = async (index) => {
        const ingredient = ingredients[index]; // Get the ingredient to delete by index
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('Error: No token found. Please log in.');
                return;
            }

            const response = await axios.delete('http://127.0.0.1:5000/api/fridge/delete-ingredient', {
                headers: { Authorization: `Bearer ${token}` },
                data: { ingredientName: ingredient.ingredientName } // Send the ingredient name to delete
            });

            if (response.status === 200) {
                // If deletion is successful, remove the ingredient from the UI
                setIngredients(ingredients.filter((_, i) => i !== index));
                setMessage('Ingredient deleted successfully');
            }
        } catch (error) {
            setMessage('Error: ' + (error.response ? error.response.data.message : 'Unable to delete ingredient'));
        }
    };

    return (
        <div className="view-ingredients-container">
            <div className="menu-bar">
                <button onClick={handleLogout} className="btn logout-btn">Logout</button>
            </div>
            <div className="content">
                {/* Ingredients Section */}
                <div className="ingredients-section">
                    <h2>Ingredients</h2>
                    <button onClick={openModal} className="btn add-ingredient-btn">Add Ingredient</button>
                    {message && <p className="message">{message}</p>}
                    <div className="ingredients-list">
                        {ingredients.length > 0 ? (
                            ingredients.map((ingredient, index) => (
                                <div key={index} className="ingredient-card">
                                    <div className="image-container">
                                        <img src={ingredient.imageUrl} alt={ingredient.ingredientName} className="ingredient-image" />
                                        <div className="hover-details">
                                            <p>{ingredient.ingredientName}</p>
                                            <p>{ingredient.quantity} {ingredient.unit}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(index)}
                                        className="delete-btn"
                                    >
                                        X
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No ingredients found.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Recipes Section */}
            <div className="recipes-section">
                <h2>Recipes</h2>
                <button onClick={handleFindRecipes} className="btn find-recipes-btn">Find Recipes</button>
                {recipes.length > 0 && (
                    <>
                        <div className="recipes-list-container">
                            {recipes.map((recipe, index) => {
                                // Assuming ingredients are stored as separate fields in recipe object
                                const totalIngredients = recipe.total_ingredients;
                                console.log(totalIngredients); // Now you can access it as a number
                                // Calculate how many ingredients are missing
                                const missingIngredients = recipe.missing_ingredients.length;
                                const availableIngredients = totalIngredients - missingIngredients;

                                const percentage = (availableIngredients / totalIngredients) * 100;

                                return (
                                    <div
                                        key={index}
                                        className={`recipe-card ${activeRecipeIndex === index ? 'active' : ''}`}
                                        style={{
                                            display: activeRecipeIndex === null || activeRecipeIndex === index ? 'block' : 'none'
                                        }}
                                    >
                                        <h3>{recipe.recipe}</h3>
                                        <img src={recipe.image} alt={recipe.name} className="recipe-image"/>

                                        {/* Segmented Circle to show ingredient availability */}
                                        <div className="ingredient-progress">
                                            <CircularProgressbar
                                                value={percentage}
                                                text={`${availableIngredients}/${totalIngredients}`}
                                                styles={buildStyles({
                                                    textSize: '16px',
                                                    pathColor: `rgba(160, 216, 241, ${percentage / 25})`,
                                                    textColor: '#333',
                                                    trailColor: '#d6d6d6',
                                                })}
                                            />
                                        </div>

                                        {activeRecipeIndex === index && (
                                            <>
                                                <p><strong>Missing Ingredients:</strong></p>
                                                <ul>
                                                    {recipe.missing_ingredients.map((ingredient, i) => (
                                                        <li key={i}>{ingredient}</li>
                                                    ))}
                                                </ul>
                                                <p><strong>Instructions:</strong> {recipe.instructions}</p>
                                            </>
                                        )}
                                        <button
                                            onClick={() => toggleRecipeDetails(index)}
                                            className="btn details-btn"
                                        >
                                            {activeRecipeIndex === index ? 'Hide Details' : 'Show Details'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Add Ingredient"
                className="modal"
                overlayClassName="modal-overlay"
            >
                <h2>Add Ingredient</h2>
                <AddIngredients />
                <button onClick={closeModal} className="btn">Close</button>
            </Modal>
        </div>
    );
}

export default ViewIngredients;
