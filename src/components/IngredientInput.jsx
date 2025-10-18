// src/components/IngredientInput.jsx
import { useState } from 'react';

function IngredientInput({ onSearch }) {
  const [input, setInput] = useState('');
  const [ingredientList, setIngredientList] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ingredientList.length === 0 && input.trim()) {
      // Parse comma-separated input
      const ingredients = input
        .split(',')
        .map(item => item.trim())
        .filter(item => item);
      setIngredientList(ingredients);
      onSearch(ingredients);
    } else if (ingredientList.length > 0) {
      onSearch(ingredientList);
    }
  };

  const handleAddIngredient = () => {
    if (input.trim()) {
      setIngredientList([...ingredientList, input.trim()]);
      setInput('');
    }
  };

  const handleRemoveIngredient = (index) => {
    setIngredientList(ingredientList.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        handleAddIngredient();
      }
    }
  };

  const commonIngredients = [
    'chicken', 'rice', 'pasta', 'eggs', 'cheese', 'tomato',
    'onion', 'garlic', 'potato', 'bread', 'milk', 'butter'
  ];

  return (
    <div className="ingredient-input-container">
      <div className="input-section">
        <h2>What's in your pantry?</h2>
        
        <div className="input-wrapper">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type an ingredient (e.g., chicken, rice, pasta)"
            className="ingredient-input"
          />
          <button 
            type="button" 
            onClick={handleAddIngredient}
            className="add-btn"
            disabled={!input.trim()}
          >
            Add
          </button>
        </div>

        {ingredientList.length > 0 && (
          <div className="ingredient-tags">
            {ingredientList.map((ingredient, index) => (
              <span key={index} className="ingredient-tag">
                {ingredient}
                <button 
                  onClick={() => handleRemoveIngredient(index)}
                  className="remove-tag"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <button 
          onClick={handleSubmit}
          disabled={ingredientList.length === 0}
          className="search-btn"
        >
          🔍 Find Recipes ({ingredientList.length} ingredients)
        </button>
      </div>

      <div className="quick-add">
        <p className="quick-add-label">Quick add common items:</p>
        <div className="quick-add-buttons">
          {commonIngredients.map(ing => (
            <button
              key={ing}
              onClick={() => {
                if (!ingredientList.includes(ing)) {
                  setIngredientList([...ingredientList, ing]);
                }
              }}
              className="quick-add-btn"
              disabled={ingredientList.includes(ing)}
            >
              {ing}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default IngredientInput;