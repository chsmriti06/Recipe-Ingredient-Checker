// src/components/RecipeDetail.jsx
import { useState, useEffect } from 'react';

function RecipeDetail({ recipe, onBack }) {
  const [mealDetails, setMealDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchRecipeFromAPI();
  }, [recipe]);

  const fetchRecipeFromAPI = async () => {
    setLoading(true);
    setError(false);

    try {
      // Search TheMealDB by first ingredient
      const mainIngredient = recipe.ingredients[0];
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${mainIngredient}`
      );
      const data = await response.json();

      if (data.meals && data.meals.length > 0) {
        // Get full details of first matching meal
        const mealId = data.meals[0].idMeal;
        const detailResponse = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
        );
        const detailData = await detailResponse.json();
        
        if (detailData.meals && detailData.meals.length > 0) {
          setMealDetails(detailData.meals[0]);
        } else {
          setError(true);
        }
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Error fetching recipe:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="recipe-detail">
        <button onClick={onBack} className="back-btn">← Back to Results</button>
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading full recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !mealDetails) {
    return (
      <div className="recipe-detail">
        <button onClick={onBack} className="back-btn">← Back to Results</button>
        <div className="recipe-fallback">
          <h2>Recipe Preview</h2>
          <div className="cuisine-tag">{recipe.cuisine} cuisine</div>
          
          <div className="ingredients-section">
            <h3>Ingredients Needed:</h3>
            <div className="ingredient-columns">
              <div className="have-ingredients">
                <h4>✅ You Have:</h4>
                <ul>
                  {recipe.ingredients.filter(ing => 
                    !recipe.missingIngredients.includes(ing)
                  ).map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </div>
              
              {recipe.missingIngredients.length > 0 && (
                <div className="missing-ingredients">
                  <h4>🛒 Need to Buy:</h4>
                  <ul>
                    {recipe.missingIngredients.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="tips-section">
            <h3>💡 Cooking Tips:</h3>
            <ul>
              <li>Start with the main protein or carb</li>
              <li>Prep all ingredients before cooking</li>
              <li>Season to taste - don't be afraid to adjust!</li>
              <li>Check online for specific {recipe.cuisine} recipe instructions</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Parse ingredients from TheMealDB format
  const apiIngredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = mealDetails[`strIngredient${i}`];
    const measure = mealDetails[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      apiIngredients.push({
        name: ingredient,
        measure: measure || ''
      });
    }
  }

  return (
    <div className="recipe-detail">
      <button onClick={onBack} className="back-btn">← Back to Results</button>
      
      <div className="recipe-header">
        <img 
          src={mealDetails.strMealThumb} 
          alt={mealDetails.strMeal}
          className="recipe-image"
        />
        <div className="recipe-info">
          <h2>{mealDetails.strMeal}</h2>
          <div className="recipe-meta">
            <span className="cuisine-tag">{mealDetails.strArea} cuisine</span>
            <span className="category-tag">{mealDetails.strCategory}</span>
          </div>
          <div className="match-info-detail">
            <p>✅ {recipe.matchPercentage}% ingredient match with what you have</p>
          </div>
        </div>
      </div>

      <div className="recipe-content">
        <section className="ingredients-detail">
          <h3>📝 Ingredients:</h3>
          <ul className="ingredients-list">
            {apiIngredients.map((ing, i) => (
              <li key={i}>
                <span className="measure">{ing.measure}</span>
                <span className="ingredient-name">{ing.name}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="instructions-section">
          <h3>👨‍🍳 Instructions:</h3>
          <div className="instructions">
            {mealDetails.strInstructions.split('\n').map((step, i) => {
              if (step.trim()) {
                return <p key={i} className="instruction-step">{step}</p>;
              }
              return null;
            })}
          </div>
        </section>

        {mealDetails.strYoutube && (
          <section className="video-section">
            <h3>📹 Video Tutorial:</h3>
            <a 
              href={mealDetails.strYoutube} 
              target="_blank" 
              rel="noopener noreferrer"
              className="video-link"
            >
              Watch on YouTube →
            </a>
          </section>
        )}
      </div>
    </div>
  );
}

export default RecipeDetail;