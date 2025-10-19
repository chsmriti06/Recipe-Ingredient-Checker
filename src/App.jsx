// src/App.jsx
import { useState } from 'react';
import { generateRecipes } from './utils/geminiService';
import IngredientInput from './components/IngredientInput';
import GeminiRecipeResults from './components/GeminiRecipeResults';
import GeminiRecipeDetail from './components/GeminiRecipeDetail';
import './App.css';

import { FaHome, FaUserAlt, FaSearch, FaBell, FaHeart, FaBars } from "react-icons/fa";


function TopBar() {
  return (
    <div className="top-bar">
      <FaHome className="icon" />
      <FaUserAlt className="icon" />
      <FaSearch className="icon" />
      <FaHeart className="icon"/>
      <FaBell className="icon"/>
      <FaBars className="icon"/>
    </div>
  );
}
  
function App() {
  const [recipes, setRecipes] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (ingredients) => {
    setLoading(true);
    setError(null);
    setSelectedRecipe(null);
    setRecipes(null);
    
    try {
      const generatedRecipes = await generateRecipes(ingredients);
      setRecipes({
        recipes: generatedRecipes,
        ingredients: ingredients
      });
    } catch (err) {
      console.error('Error generating recipes:', err);
      setError('Failed to generate recipes. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleBack = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="app">

      <div className="top-bar">
        <div className="left-side">
         <FaSearch className="icon" />
         <FaHome className="icon" />
        </div>
        <div className="right-side">
         <FaHeart className ="icon"/>
         <FaBars className ="icon"/>
        </div>
        <div className="center">
          <p>collegerecipes@cravings.com</p>
        </div>
      </div>
      <div className="top-section">
       <div className="overlay">
         <h1>College Recipe Finder</h1>
       </div>

           {/* Move the zigzag divider inside the top-section */}
       <div className="zigzag-divider">
         <svg viewBox="0 0 1200 100" preserveAspectRatio="none">
           <path d="M0,0 50,50 100,0 150,50 200,0 250,50 300,0 350,50 400,0 450,50 500,0 550,50 600,0 650,50 700,0 750,50 800,0 850,50 900,0 950,50 1000,0 1050,50 1100,0 1150,50 1200,0 V100 H0 Z" />
         </svg>
       </div>
     </div>

      <main className="main-content">
        <IngredientInput onSearch={handleSearch} />

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            {/* <p>✨ AI is creating custom recipes for you...</p> */}
          </div>
        )}

        {error && (
          <div className="error-message">
            <h3>⚠️ Oops!</h3>
            <p>{error}</p>
            <p className="error-hint">Make sure you added VITE_GEMINI_API_KEY to your .env file</p>
          </div>
        )}

        {!loading && !error && recipes && !selectedRecipe && (
          <GeminiRecipeResults 
            recipes={recipes.recipes}
            ingredients={recipes.ingredients}
            onRecipeClick={handleRecipeClick}
          />
        )}

        {selectedRecipe && (
          <GeminiRecipeDetail 
            recipe={selectedRecipe} 
            onBack={handleBack}
          />
        )}
      </main>
    </div>
  );
}

export default App;