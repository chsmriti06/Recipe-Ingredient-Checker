// src/utils/recipeMatch.js

/**
 * Normalize ingredient name for better matching
 */
function normalizeIngredient(ingredient) {
  return ingredient
    .toLowerCase()
    .trim()
    .replace(/[^a-z\s]/g, '') // Remove numbers and special chars
    .replace(/\s+/g, ' '); // Normalize spaces
}

/**
 * Check if user ingredient matches recipe ingredient
 * More strict matching to avoid false positives
 */
function ingredientsMatch(userIng, recipeIng) {
  const normalizedUser = normalizeIngredient(userIng);
  const normalizedRecipe = normalizeIngredient(recipeIng);
  
  // Split into words for partial matching
  const userWords = normalizedUser.split(' ');
  const recipeWords = normalizedRecipe.split(' ');
  
  // Check if main ingredient words match
  // At least one significant word must match (not 'salt', 'fresh', etc.)
  const commonWords = new Set(['salt', 'pepper', 'fresh', 'dried', 'ground', 'chopped']);
  
  const userMainWords = userWords.filter(w => w.length > 2 && !commonWords.has(w));
  const recipeMainWords = recipeWords.filter(w => w.length > 2 && !commonWords.has(w));
  
  // Check if any main word from user matches any main word from recipe
  return userMainWords.some(userWord => 
    recipeMainWords.some(recipeWord => 
      recipeWord.includes(userWord) || userWord.includes(recipeWord)
    )
  );
}

/**
 * Find recipes that match user's ingredients
 * @param {Array} userIngredients - List of ingredients the user has
 * @param {Array} recipes - Full recipe dataset from Kaggle
 * @returns {Object} - Categorized results
 */
export function findMatchingRecipes(userIngredients, recipes) {
  const results = recipes.map(recipe => {
    // Count how many ingredients match
    const matchedIngredients = recipe.ingredients.filter(recipeIng =>
      userIngredients.some(userIng =>
        ingredientsMatch(userIng, recipeIng)
      )
    );

    // Find missing ingredients
    const missingIngredients = recipe.ingredients.filter(recipeIng =>
      !userIngredients.some(userIng =>
        ingredientsMatch(userIng, recipeIng)
      )
    );

    const matchPercentage = (matchedIngredients.length / recipe.ingredients.length) * 100;

    return {
      ...recipe,
      matchedCount: matchedIngredients.length,
      matchPercentage: Math.round(matchPercentage),
      missingIngredients,
      missingCount: missingIngredients.length,
      matchedIngredients // Include matched ingredients for debugging
    };
  });

  // Only show recipes with at least 2 matching ingredients (or 1 if recipe only has 2-3 total)
  const validResults = results.filter(r => 
    r.matchedCount >= 2 || (r.ingredients.length <= 3 && r.matchedCount >= 1)
  );

  // Categorize results with stricter thresholds
  const perfectMatches = validResults.filter(r => r.matchPercentage === 100);
  const almostThere = validResults.filter(r => r.matchPercentage >= 75 && r.matchPercentage < 100);
  const needFewMore = validResults.filter(r => r.matchPercentage >= 50 && r.matchPercentage < 75);

  // Sort by match percentage and ingredient count
  perfectMatches.sort((a, b) => a.ingredients.length - b.ingredients.length);
  almostThere.sort((a, b) => b.matchPercentage - a.matchPercentage || a.missingCount - b.missingCount);
  needFewMore.sort((a, b) => b.matchPercentage - a.matchPercentage || a.missingCount - b.missingCount);

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