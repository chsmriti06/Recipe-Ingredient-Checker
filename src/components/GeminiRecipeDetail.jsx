// src/components/GeminiRecipeDetail.jsx

function GeminiRecipeDetail({ recipe, onBack }) {
  return (
    <div className="recipe-detail gemini-detail">
      <button onClick={onBack} className="back-btn">← Back to Results</button>
      
      <div className="gemini-recipe-header">
        <div className="recipe-title-section">
          <h2>{recipe.name}</h2>
          <div className="recipe-badges">
            {/* <span className="ai-badge-large">✨ AI Generated</span> */}
            <span className="difficulty-badge-large">{recipe.difficulty}</span>
          </div>
        </div>

        <div className="recipe-quick-info">
          <div className="quick-info-card">
            <span className="info-icon">⏱️</span>
            <div>
              <p className="info-label">Cooking Time</p>
              <p className="info-value">{recipe.cookingTime}</p>
            </div>
          </div>
          <div className="quick-info-card">
            <span className="info-icon">🍽️</span>
            <div>
              <p className="info-label">Servings</p>
              <p className="info-value">{recipe.servings}</p>
            </div>
          </div>
          <div className="quick-info-card">
            <span className="info-icon">📊</span>
            <div>
              <p className="info-label">Difficulty</p>
              <p className="info-value">{recipe.difficulty}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="recipe-content">
        <section className="ingredients-detail gemini-ingredients">
          <h3>📝 Ingredients</h3>
          <ul className="ingredients-list gemini-list">
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>
                <span className="ingredient-amount">{ing.amount}</span>
                <span className="ingredient-name">{ing.item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="instructions-section gemini-instructions">
          <h3>👨‍🍳 Instructions</h3>
          <div className="instructions-list">
            {recipe.instructions.map((instruction, i) => (
              <div key={i} className="instruction-step gemini-step">
                <span className="step-number">Step {i + 1}</span>
                <p className="step-text">{instruction}</p>
              </div>
            ))}
          </div>
        </section>

        {recipe.proTip && (
          <section className="pro-tip-section">
            <h3>💡 Pro Tip for College Students</h3>
            <div className="pro-tip-content">
              <p>{recipe.proTip}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default GeminiRecipeDetail;