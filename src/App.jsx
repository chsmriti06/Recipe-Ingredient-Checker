// src/App.jsx
import { useState } from 'react';
import { generateRecipes } from './utils/geminiService';
import IngredientInput from './components/IngredientInput';
import GeminiRecipeResults from './components/GeminiRecipeResults';
import GeminiRecipeDetail from './components/GeminiRecipeDetail';
import './App.css';

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
      <header className="header">
        <h1>🍜 College Recipe Finder</h1>
        {/* <p className="tagline">AI-powered recipes from what you've got</p> */}
      </header>

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