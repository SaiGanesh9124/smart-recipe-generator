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

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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
}