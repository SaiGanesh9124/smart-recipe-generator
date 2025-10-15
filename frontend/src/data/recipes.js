export const recipes = [
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
  },
  {
    "id": 3,
    "name": "Vegetable Stir Fry",
    "ingredients": ["broccoli", "carrot", "bell pepper", "soy sauce", "garlic", "ginger", "rice"],
    "instructions": ["Heat oil", "Add garlic and ginger", "Stir-fry vegetables", "Serve over rice"],
    "cookingTime": 15,
    "difficulty": "Easy",
    "dietary": ["vegetarian", "vegan"],
    "cuisine": "Asian",
    "servings": 3,
    "nutritionalInfo": { "calories": 280, "protein": 8, "carbs": 45, "fat": 6 },
    "substitutions": { "soy sauce": ["tamari"], "rice": ["quinoa"] }
  },
  {
    "id": 4,
    "name": "Greek Salad",
    "ingredients": ["cucumber", "tomato", "red onion", "feta cheese", "olives", "olive oil"],
    "instructions": ["Chop vegetables", "Add olives and feta", "Drizzle with olive oil"],
    "cookingTime": 10,
    "difficulty": "Easy",
    "dietary": ["vegetarian", "gluten-free"],
    "cuisine": "Greek",
    "servings": 2,
    "nutritionalInfo": { "calories": 220, "protein": 8, "carbs": 12, "fat": 16 },
    "substitutions": { "feta cheese": ["goat cheese"], "olives": ["capers"] }
  },
  {
    "id": 5,
    "name": "Beef Tacos",
    "ingredients": ["ground beef", "tortilla", "onion", "tomato", "lettuce", "cheese"],
    "instructions": ["Brown beef with onion", "Warm tortillas", "Fill with beef", "Add toppings"],
    "cookingTime": 20,
    "difficulty": "Easy",
    "dietary": [],
    "cuisine": "Mexican",
    "servings": 4,
    "nutritionalInfo": { "calories": 420, "protein": 25, "carbs": 30, "fat": 22 },
    "substitutions": { "ground beef": ["ground turkey"], "cheese": ["avocado"] }
  }
];

export const mockImageRecognition = () => {
  const ingredients = ['tomato', 'onion', 'garlic', 'chicken', 'pasta', 'carrot', 'bell pepper'];
  const count = Math.floor(Math.random() * 4) + 2;
  return ingredients.sort(() => 0.5 - Math.random()).slice(0, count);
};