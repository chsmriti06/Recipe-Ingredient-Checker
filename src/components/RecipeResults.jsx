// src/components/RecipeResults.jsx
import { getTopCuisines } from '../utils/recipeMatch';

function RecipeResults({ results, onRecipeClick }) {
  const { perfectMatches, almostThere, needFewMore, cuisineGroups, totalMatches } = results;
  const topCuisines = getTopCuisines(cuisineGroups);

  if (totalMatches === 0) {
    return (
      <div className="no-results">
        <h2>😕 No perfect matches found</h2>
        <p>Try adding more common ingredients like rice, pasta, chicken, or eggs!</p>
        {needFewMore.length > 0 && (
          <div>
            <p>But here are some recipes you're close to making:</p>
            <div className="recipe-grid">
              {needFewMore.slice(0, 6).map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} onClick={onRecipeClick} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="results-container">
      <div className="results-summary">
        <h2>🎉 Found {totalMatches} recipes you can make!</h2>
        
        <div className="cuisine-badges">
          <p>Top cuisines:</p>
          {topCuisines.map(({ cuisine, count }) => (
            <span key={cuisine} className="cuisine-badge">
              {cuisine} ({count})
            </span>
          ))}
        </div>
      </div>

      {perfectMatches.length > 0 && (
        <section className="results-section">
          <h3>✅ Perfect Matches - You have everything!</h3>
          <div className="recipe-grid">
            {perfectMatches.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} onClick={onRecipeClick} />
            ))}
          </div>
        </section>
      )}

      {almostThere.length > 0 && (
        <section className="results-section">
          <h3>🔥 Almost There - Just need 1-2 more things</h3>
          <div className="recipe-grid">
            {almostThere.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} onClick={onRecipeClick} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function RecipeCard({ recipe, onClick }) {
  const { cuisine, matchPercentage, matchedCount, ingredients, missingIngredients } = recipe;
  
  return (
    <div className="recipe-card" onClick={() => onClick(recipe)}>
      <div className="recipe-card-header">
        <span className="cuisine-label">{cuisine}</span>
        <span className="match-badge">{matchPercentage}% match</span>
      </div>
      
      <div className="recipe-card-body">
        <p className="ingredient-count">
          {ingredients.length} ingredients total
        </p>
        <p className="matched-info">
          ✓ You have {matchedCount} of them
        </p>
        
        {missingIngredients.length > 0 && (
          <div className="missing-info">
            <p className="missing-label">Need to buy:</p>
            <ul className="missing-list">
              {missingIngredients.slice(0, 3).map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
              {missingIngredients.length > 3 && (
                <li>+ {missingIngredients.length - 3} more</li>
              )}
            </ul>
          </div>
        )}
      </div>
      
      <button className="view-recipe-btn">
        View Full Recipe →
      </button>
    </div>
  );
}

export default RecipeResults;