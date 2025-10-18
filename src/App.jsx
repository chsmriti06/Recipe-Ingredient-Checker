// src/App.jsx
import { useState } from 'react';
import recipeData from './data/train.json';
import { findMatchingRecipes, getTopCuisines } from './utils/recipeMatch';
import IngredientInput from './components/IngredientInput';
import RecipeResults from './components/RecipeResults';
import RecipeDetail from './components/RecipeDetail';
import './App.css';

function App() {
  const [searchResults, setSearchResults] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = (ingredients) => {
    setLoading(true);
    setSelectedRecipe(null);
    
    // Simulate slight delay for better UX
    setTimeout(() => {
      const results = findMatchingRecipes(ingredients, recipeData);
      setSearchResults(results);
      setLoading(false);
    }, 500);
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
        <p className="tagline">Easy meals with what you've got</p>
      </header>

      <main className="main-content">
        <IngredientInput onSearch={handleSearch} />

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Finding recipes...</p>
          </div>
        )}

        {!loading && searchResults && !selectedRecipe && (
          <RecipeResults 
            results={searchResults} 
            onRecipeClick={handleRecipeClick}
          />
        )}

        {selectedRecipe && (
          <RecipeDetail 
            recipe={selectedRecipe} 
            onBack={handleBack}
          />
        )}
      </main>
    </div>
  );
}

export default App;