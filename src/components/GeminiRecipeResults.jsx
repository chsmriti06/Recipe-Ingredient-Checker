// src/components/GeminiRecipeResults.jsx

function GeminiRecipeResults({ recipes, ingredients, onRecipeClick }) {
  if (!recipes || recipes.length === 0) {
    return (
      <div className="no-results">
        <h2>😕 No recipes generated</h2>
        <p>Try adding more ingredients or check your API key.</p>
      </div>
    );
  }

  return (
    <div className="results-container">
      <div className="results-summary">
        <h2>🎉 Generated {recipes.length} custom recipes!</h2>
        <div className="ingredient-summary">
          <p>Using your ingredients:</p>
          <div className="ingredient-badges">
            {ingredients.map((ing, i) => (
              <span key={i} className="ingredient-badge">{ing}</span>
            ))}
          </div>
        </div>
      </div>

      <section className="results-section">
        {/* <h3>✨ AI-Generated Recipes</h3> */}
        <div className="recipe-grid">
          {recipes.map((recipe, index) => (
            <GeminiRecipeCard 
              key={index} 
              recipe={recipe} 
              onClick={onRecipeClick}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function GeminiRecipeCard({ recipe, onClick }) {
  return (
    <div className="recipe-card gemini-card" onClick={() => onClick(recipe)}>
      <div className="recipe-card-header">
        {/* <span className="ai-badge">✨ AI Generated</span> */}
        <span className="difficulty-badge">{recipe.difficulty}</span>
      </div>
      
      <div className="recipe-card-body">
        <h3 className="recipe-name">{recipe.name}</h3>
        
        <div className="recipe-meta-info">
          <div className="meta-item">
            <span className="meta-icon">⏱️</span>
            <span>{recipe.cookingTime}</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">🍽️</span>
            <span>{recipe.servings} servings</span>
          </div>
        </div>

        <div className="ingredients-preview">
          <p className="ingredients-label">Ingredients needed:</p>
          <div className="ingredient-count-badge">
            {recipe.ingredients.length} items
          </div>
        </div>

        {recipe.proTip && (
          <div className="pro-tip-preview">
            <span className="tip-icon">💡</span>
            <span className="tip-text">{recipe.proTip.slice(0, 60)}...</span>
          </div>
        )}
      </div>
      
      <button className="view-recipe-btn gemini-btn">
        View Full Recipe →
      </button>
    </div>
  );
}

export default GeminiRecipeResults;