const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const recipes = [
  {
    "id": 1,
    "name": "Classic Tomato Pasta",
    "ingredients": ["pasta", "tomato", "garlic", "onion", "olive oil", "basil"],
    "instructions": ["Boil pasta", "Sauté onion and garlic", "Add tomatoes and basil", "Mix with pasta"],
    "cookingTime": 20,
    "difficulty": "Easy",
    "dietary": ["vegetarian"],
    "cuisine": "Italian",
    "servings": 4,
    "nutritionalInfo": { "calories": 450, "protein": 15, "carbs": 65, "fat": 12 },
    "substitutions": { "pasta": ["rice"], "basil": ["oregano"] }
  },
  {
    "id": 2,
    "name": "Chicken Salad",
    "ingredients": ["chicken", "lettuce", "tomato", "cucumber", "olive oil", "lemon"],
    "instructions": ["Grill chicken", "Chop vegetables", "Combine ingredients", "Add dressing"],
    "cookingTime": 25,
    "difficulty": "Easy",
    "dietary": ["gluten-free"],
    "cuisine": "Mediterranean",
    "servings": 2,
    "nutritionalInfo": { "calories": 350, "protein": 30, "carbs": 8, "fat": 18 },
    "substitutions": { "chicken": ["tofu"], "lettuce": ["spinach"] }
  }
];

let userRatings = {};
let userFavorites = {};

app.get('/api/recipes', (req, res) => {
  const { ingredients } = req.query;
  const availableIngredients = ingredients ? ingredients.toLowerCase().split(',').map(i => i.trim()) : [];
  
  if (availableIngredients.length === 0) {
    return res.status(400).json({ message: 'Please provide ingredients.' });
  }

  const filteredRecipes = recipes.map(recipe => {
    let matchCount = 0;
    recipe.ingredients.forEach(ingredient => {
      if (availableIngredients.some(userIng => ingredient.toLowerCase().includes(userIng))) {
        matchCount++;
      }
    });
    const score = (matchCount / recipe.ingredients.length) * 100;
    return { ...recipe, matchScore: score };
  }).filter(recipe => recipe.matchScore > 0);

  res.json(filteredRecipes);
});

app.post('/api/recognize-ingredients', (req, res) => {
  const mockIngredients = ['tomato', 'onion', 'garlic', 'chicken', 'pasta'];
  const detected = mockIngredients.slice(0, Math.floor(Math.random() * 3) + 2);
  
  setTimeout(() => {
    res.json({ ingredients: detected, confidence: 0.85 });
  }, 1500);
});

app.get('/api/recipes/:id', (req, res) => {
  const recipe = recipes.find(r => r.id === parseInt(req.params.id));
  if (!recipe) return res.status(404).json({ message: 'Recipe not found.' });
  res.json(recipe);
});

app.post('/api/recipes/:id/rate', (req, res) => {
  const { rating } = req.body;
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
  }
  res.json({ message: 'Rating saved.' });
});

app.post('/api/recipes/:id/favorite', (req, res) => {
  res.json({ message: 'Favorite updated.', isFavorite: true });
});

app.get('/api/favorites', (req, res) => {
  res.json([]);
});

app.get('/api/recommendations', (req, res) => {
  res.json(recipes.slice(0, 2));
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

module.exports = app;