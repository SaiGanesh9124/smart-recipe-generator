const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const recipes = require('./recipes.json');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// In-memory storage for user ratings and favorites
let userRatings = {};
let userFavorites = {};

// Common ingredient mappings for image recognition
const ingredientMappings = {
  'tomatoes': 'tomato', 'potatoes': 'potato', 'onions': 'onion',
  'carrots': 'carrot', 'peppers': 'bell pepper', 'mushrooms': 'mushroom',
  'lemons': 'lemon', 'limes': 'lime', 'apples': 'apple',
  'bananas': 'banana', 'oranges': 'orange', 'garlic cloves': 'garlic'
};

// Recipe search with advanced filtering
app.get('/api/recipes', (req, res) => {
  try {
    const { ingredients, dietary, difficulty, maxTime, cuisine } = req.query;
    
    const availableIngredients = ingredients
      ? ingredients.toLowerCase().split(',').map(i => i.trim())
      : [];

    if (availableIngredients.length === 0) {
      return res.status(400).json({ message: 'Please provide ingredients.' });
    }

    let filteredRecipes = recipes.map(recipe => {
      let matchCount = 0;
      const missingIngredients = [];
      
      recipe.ingredients.forEach(ingredient => {
        if (availableIngredients.some(userIng => 
          ingredient.toLowerCase().includes(userIng) || userIng.includes(ingredient.toLowerCase())
        )) {
          matchCount++;
        } else {
          missingIngredients.push(ingredient);
        }
      });

      const score = (matchCount / recipe.ingredients.length) * 100;
      return { ...recipe, matchScore: score, missingIngredients };
    })
    .filter(recipe => recipe.matchScore > 0);

    // Apply filters
    if (dietary) {
      const dietaryFilters = dietary.split(',').map(d => d.trim().toLowerCase());
      filteredRecipes = filteredRecipes.filter(recipe => 
        dietaryFilters.some(filter => 
          recipe.dietary.some(d => d.toLowerCase().includes(filter))
        )
      );
    }

    if (difficulty) {
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    }

    if (maxTime) {
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.cookingTime <= parseInt(maxTime)
      );
    }

    if (cuisine) {
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.cuisine.toLowerCase().includes(cuisine.toLowerCase())
      );
    }

    // Sort by match score
    filteredRecipes.sort((a, b) => b.matchScore - a.matchScore);

    res.json(filteredRecipes);
  } catch (error) {
    res.status(500).json({ message: 'Server error occurred.' });
  }
});

// Image recognition endpoint (mock implementation)
app.post('/api/recognize-ingredients', (req, res) => {
  try {
    const { imageData } = req.body;
    
    if (!imageData) {
      return res.status(400).json({ message: 'No image data provided.' });
    }

    // Mock ingredient detection with varied results
    const possibleIngredients = [
      'tomato', 'onion', 'garlic', 'bell pepper', 'carrot', 'broccoli',
      'chicken', 'beef', 'fish', 'eggs', 'cheese', 'milk', 'butter',
      'potato', 'spinach', 'mushroom', 'lemon', 'lime', 'basil',
      'rice', 'pasta', 'bread', 'olive oil', 'salt', 'pepper'
    ];
    
    // Randomly select 3-6 ingredients to simulate realistic detection
    const numIngredients = Math.floor(Math.random() * 4) + 3; // 3-6 ingredients
    const shuffled = possibleIngredients.sort(() => 0.5 - Math.random());
    const mockDetectedIngredients = shuffled.slice(0, numIngredients);
    
    // Simulate processing delay (1-3 seconds)
    const delay = Math.floor(Math.random() * 2000) + 1000;
    
    setTimeout(() => {
      res.json({ 
        ingredients: mockDetectedIngredients,
        confidence: Math.round((Math.random() * 0.3 + 0.7) * 100) / 100, // 0.7-1.0
        message: `Detected ${mockDetectedIngredients.length} ingredients with ${Math.round((Math.random() * 0.3 + 0.7) * 100)}% confidence`
      });
    }, delay);
  } catch (error) {
    res.status(500).json({ message: 'Image processing failed.' });
  }
});

// Get recipe details
app.get('/api/recipes/:id', (req, res) => {
  try {
    const recipe = recipes.find(r => r.id === parseInt(req.params.id));
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Server error occurred.' });
  }
});

// Rate recipe
app.post('/api/recipes/:id/rate', (req, res) => {
  try {
    const { rating, userId = 'default' } = req.body;
    const recipeId = req.params.id;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    if (!userRatings[userId]) userRatings[userId] = {};
    userRatings[userId][recipeId] = rating;
    
    res.json({ message: 'Rating saved successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save rating.' });
  }
});

// Toggle favorite
app.post('/api/recipes/:id/favorite', (req, res) => {
  try {
    const { userId = 'default' } = req.body;
    const recipeId = req.params.id;
    
    if (!userFavorites[userId]) userFavorites[userId] = [];
    
    const index = userFavorites[userId].indexOf(recipeId);
    if (index > -1) {
      userFavorites[userId].splice(index, 1);
    } else {
      userFavorites[userId].push(recipeId);
    }
    
    res.json({ 
      message: 'Favorite updated.',
      isFavorite: userFavorites[userId].includes(recipeId)
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update favorite.' });
  }
});

// Get user favorites
app.get('/api/favorites', (req, res) => {
  try {
    const { userId = 'default' } = req.query;
    const favoriteIds = userFavorites[userId] || [];
    const favoriteRecipes = recipes.filter(r => favoriteIds.includes(r.id.toString()));
    res.json(favoriteRecipes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get favorites.' });
  }
});

// Get substitution suggestions
app.get('/api/substitutions/:ingredient', (req, res) => {
  try {
    const ingredient = req.params.ingredient.toLowerCase();
    const recipe = recipes.find(r => 
      r.substitutions && r.substitutions[ingredient]
    );
    
    if (recipe && recipe.substitutions[ingredient]) {
      res.json({ substitutions: recipe.substitutions[ingredient] });
    } else {
      res.json({ substitutions: [] });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to get substitutions.' });
  }
});

// Get recipe recommendations based on user ratings
app.get('/api/recommendations', (req, res) => {
  try {
    const { userId = 'default' } = req.query;
    const userRating = userRatings[userId] || {};
    const userFavs = userFavorites[userId] || [];
    
    // Get highly rated recipes (4+ stars)
    const highlyRated = Object.entries(userRating)
      .filter(([_, rating]) => rating >= 4)
      .map(([recipeId]) => parseInt(recipeId));
    
    // Find similar recipes based on cuisine and dietary preferences
    const likedRecipes = recipes.filter(r => 
      highlyRated.includes(r.id) || userFavs.includes(r.id.toString())
    );
    
    if (likedRecipes.length === 0) {
      return res.json(recipes.slice(0, 5)); // Return top 5 if no preferences
    }
    
    // Get cuisines and dietary preferences from liked recipes
    const preferredCuisines = [...new Set(likedRecipes.map(r => r.cuisine))];
    const preferredDietary = [...new Set(likedRecipes.flatMap(r => r.dietary))];
    
    // Find similar recipes
    const recommendations = recipes
      .filter(recipe => 
        !highlyRated.includes(recipe.id) && 
        !userFavs.includes(recipe.id.toString())
      )
      .map(recipe => {
        let score = 0;
        if (preferredCuisines.includes(recipe.cuisine)) score += 2;
        if (recipe.dietary.some(d => preferredDietary.includes(d))) score += 1;
        if (recipe.difficulty === 'Easy') score += 0.5;
        return { ...recipe, recommendationScore: score };
      })
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, 8);
    
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get recommendations.' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Smart Recipe Generator API running on port ${PORT}`);
});