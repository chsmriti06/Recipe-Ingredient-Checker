// src/utils/recipeMatch.js

/**
 * Find recipes that match user's ingredients
 * @param {Array} userIngredients - List of ingredients the user has
 * @param {Array} recipes - Full recipe dataset from Kaggle
 * @returns {Object} - Categorized results
 */
export function findMatchingRecipes(userIngredients, recipes) {
  // Normalize user ingredients (lowercase, trim)
  const normalizedUserIngredients = userIngredients.map(ing => 
    ing.toLowerCase().trim()
  );

  const results = recipes.map(recipe => {
    // Count how many ingredients match
    const matchedIngredients = recipe.ingredients.filter(recipeIng =>
      normalizedUserIngredients.some(userIng =>
        recipeIng.toLowerCase().includes(userIng) || 
        userIng.includes(recipeIng.toLowerCase())
      )
    );

    // Find missing ingredients
    const missingIngredients = recipe.ingredients.filter(recipeIng =>
      !normalizedUserIngredients.some(userIng =>
        recipeIng.toLowerCase().includes(userIng) || 
        userIng.includes(recipeIng.toLowerCase())
      )
    );

    const matchPercentage = (matchedIngredients.length / recipe.ingredients.length) * 100;

    return {
      ...recipe,
      matchedCount: matchedIngredients.length,
      matchPercentage: Math.round(matchPercentage),
      missingIngredients,
      missingCount: missingIngredients.length
    };
  });

  // Categorize results
  const perfectMatches = results.filter(r => r.matchPercentage === 100);
  const almostThere = results.filter(r => r.matchPercentage >= 70 && r.matchPercentage < 100);
  const needFewMore = results.filter(r => r.matchPercentage >= 50 && r.matchPercentage < 70);

  // Sort by match percentage
  perfectMatches.sort((a, b) => a.ingredients.length - b.ingredients.length);
  almostThere.sort((a, b) => b.matchPercentage - a.matchPercentage);
  needFewMore.sort((a, b) => b.matchPercentage - a.matchPercentage);

  // Group by cuisine
  const cuisineGroups = {};
  [...perfectMatches, ...almostThere].forEach(recipe => {
    if (!cuisineGroups[recipe.cuisine]) {
      cuisineGroups[recipe.cuisine] = [];
    }
    cuisineGroups[recipe.cuisine].push(recipe);
  });

  return {
    perfectMatches: perfectMatches.slice(0, 10),
    almostThere: almostThere.slice(0, 15),
    needFewMore: needFewMore.slice(0, 10),
    cuisineGroups,
    totalMatches: perfectMatches.length + almostThere.length
  };
}

/**
 * Get top cuisines user can make
 */
export function getTopCuisines(cuisineGroups) {
  return Object.entries(cuisineGroups)
    .map(([cuisine, recipes]) => ({
      cuisine,
      count: recipes.length,
      avgMatch: Math.round(
        recipes.reduce((sum, r) => sum + r.matchPercentage, 0) / recipes.length
      )
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}