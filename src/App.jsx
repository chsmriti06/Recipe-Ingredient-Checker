// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
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