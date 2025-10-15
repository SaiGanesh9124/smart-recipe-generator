import React, { useState, useRef } from 'react';
import './App.css';
import { recipes as recipeData, mockImageRecognition } from './data/recipes';

function App() {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [filters, setFilters] = useState({
    dietary: '',
    difficulty: '',
    maxTime: '',
    cuisine: ''
  });
  const [imageProcessing, setImageProcessing] = useState(false);
  const [currentView, setCurrentView] = useState('search');
  const [servings, setServings] = useState(4);
  const [showIngredientList, setShowIngredientList] = useState(false);
  const fileInputRef = useRef(null);

  const commonIngredients = [
    'chicken', 'beef', 'pork', 'fish', 'eggs', 'milk', 'cheese', 'butter',
    'tomato', 'onion', 'garlic', 'potato', 'carrot', 'broccoli', 'spinach',
    'rice', 'pasta', 'bread', 'flour', 'olive oil', 'salt', 'pepper',
    'basil', 'oregano', 'lemon', 'lime', 'bell pepper', 'mushroom'
  ];

  // Local data - no API needed
  const [userRatings, setUserRatings] = useState({});
  const [userFavorites, setUserFavorites] = useState([]);

  const handleSearch = () => {
    setError('');
    setRecipes([]);

    if (!ingredients.trim()) {
      setError('Please enter some ingredients.');
      return;
    }
    setLoading(true);

    setTimeout(() => {
      const availableIngredients = ingredients.toLowerCase().split(',').map(i => i.trim());
      
      let filteredRecipes = recipeData.map(recipe => {
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
      }).filter(recipe => recipe.matchScore > 0);

      // Apply filters
      if (filters.dietary) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.dietary.some(d => d.toLowerCase().includes(filters.dietary.toLowerCase()))
        );
      }

      if (filters.difficulty) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.difficulty.toLowerCase() === filters.difficulty.toLowerCase()
        );
      }

      if (filters.maxTime) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.cookingTime <= parseInt(filters.maxTime)
        );
      }

      if (filters.cuisine) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.cuisine.toLowerCase().includes(filters.cuisine.toLowerCase())
        );
      }

      filteredRecipes.sort((a, b) => b.matchScore - a.matchScore);
      
      if (filteredRecipes.length === 0) {
        setError('No recipes found. Try different ingredients or filters.');
      }
      
      setRecipes(filteredRecipes);
      setLoading(false);
    }, 500);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImageProcessing(true);
    setError('📸 Analyzing your image... This may take a moment.');

    setTimeout(() => {
      const detected = mockImageRecognition();
      const current = ingredients.split(',').map(i => i.trim()).filter(i => i);
      const newIngredients = detected.filter(ing => !current.includes(ing));
      const combined = [...current, ...newIngredients];
      
      setIngredients(combined.join(', '));
      setError(`✅ Found ${newIngredients.length} new ingredients: ${newIngredients.join(', ')}`);
      
      setTimeout(() => setError(''), 3000);
      setImageProcessing(false);
    }, 2000);
  };

  const viewRecipe = (recipeId) => {
    const recipe = recipeData.find(r => r.id === recipeId);
    if (recipe) {
      setSelectedRecipe(recipe);
      setServings(recipe.servings);
    }
  };

  const toggleFavorite = (recipeId) => {
    if (userFavorites.includes(recipeId)) {
      setUserFavorites(userFavorites.filter(id => id !== recipeId));
    } else {
      setUserFavorites([...userFavorites, recipeId]);
    }
  };

  const rateRecipe = (recipeId, rating) => {
    setUserRatings({ ...userRatings, [recipeId]: rating });
  };

  const adjustServings = (recipe, newServings) => {
    const ratio = newServings / recipe.servings;
    return {
      ...recipe,
      servings: newServings,
      nutritionalInfo: {
        calories: Math.round(recipe.nutritionalInfo.calories * ratio),
        protein: Math.round(recipe.nutritionalInfo.protein * ratio),
        carbs: Math.round(recipe.nutritionalInfo.carbs * ratio),
        fat: Math.round(recipe.nutritionalInfo.fat * ratio)
      }
    };
  };

  const loadFavorites = () => {
    const favoriteRecipes = recipeData.filter(r => userFavorites.includes(r.id));
    setRecipes(favoriteRecipes);
  };

  const loadRecommendations = () => {
    const recommended = recipeData.slice(0, 3);
    setRecipes(recommended);
  };

  const addIngredient = (ingredient) => {
    const current = ingredients.split(',').map(i => i.trim()).filter(i => i);
    if (!current.includes(ingredient)) {
      setIngredients([...current, ingredient].join(', '));
    }
  };

  const removeIngredient = (ingredient) => {
    const current = ingredients.split(',').map(i => i.trim()).filter(i => i);
    const updated = current.filter(i => i !== ingredient);
    setIngredients(updated.join(', '));
  };

  const getSelectedIngredients = () => {
    return ingredients.split(',').map(i => i.trim()).filter(i => i);
  };

  if (selectedRecipe) {
    const adjustedRecipe = adjustServings(selectedRecipe, servings);
    return (
      <div className="App">
        <div className="recipe-detail">
          <button className="back-btn" onClick={() => setSelectedRecipe(null)}>← Back</button>
          <h1>{selectedRecipe.name}</h1>
          <div className="recipe-meta">
            <span>🕒 {selectedRecipe.cookingTime} min</span>
            <span>👨🍳 {selectedRecipe.difficulty}</span>
            <span>🍽️ {adjustedRecipe.servings} servings</span>
            <span>🌍 {selectedRecipe.cuisine}</span>
          </div>
          
          <div className="serving-adjuster">
            <label>Servings: </label>
            <button onClick={() => setServings(Math.max(1, servings - 1))}>-</button>
            <span>{servings}</span>
            <button onClick={() => setServings(servings + 1)}>+</button>
          </div>
          
          <div className="recipe-content">
            <div className="ingredients-section">
              <h3>Ingredients</h3>
              <ul>
                {selectedRecipe.ingredients.map((ing, idx) => (
                  <li key={idx}>{ing}</li>
                ))}
              </ul>
            </div>
            
            <div className="instructions-section">
              <h3>Instructions</h3>
              <ol>
                {selectedRecipe.instructions.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
            
            <div className="nutrition-section">
              <h3>Nutrition (per serving)</h3>
              <div className="nutrition-grid">
                <div>Calories: {adjustedRecipe.nutritionalInfo.calories}</div>
                <div>Protein: {adjustedRecipe.nutritionalInfo.protein}g</div>
                <div>Carbs: {adjustedRecipe.nutritionalInfo.carbs}g</div>
                <div>Fat: {adjustedRecipe.nutritionalInfo.fat}g</div>
              </div>
            </div>
            
            {selectedRecipe.substitutions && (
              <div className="substitutions-section">
                <h3>Ingredient Substitutions</h3>
                <div className="substitutions-list">
                  {Object.entries(selectedRecipe.substitutions).map(([ingredient, subs]) => (
                    <div key={ingredient} className="substitution-item">
                      <strong>{ingredient}:</strong> {subs.join(', ')}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="recipe-actions">
            <button 
              className={`favorite-btn ${userFavorites.includes(selectedRecipe.id) ? 'favorited' : ''}`}
              onClick={() => toggleFavorite(selectedRecipe.id)}
            >
              {userFavorites.includes(selectedRecipe.id) ? '❤️' : '🤍'} Favorite
            </button>
            
            <div className="rating">
              {[1,2,3,4,5].map(star => (
                <button key={star} onClick={() => rateRecipe(selectedRecipe.id, star)}>⭐</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🍳 Smart Recipe Generator</h1>
        <p>Find recipes from your ingredients or upload a photo!</p>
        <div className="nav-tabs">
          <button 
            className={currentView === 'search' ? 'active' : ''}
            onClick={() => setCurrentView('search')}
          >
            🔍 Search
          </button>
          <button 
            className={currentView === 'favorites' ? 'active' : ''}
            onClick={() => { setCurrentView('favorites'); loadFavorites(); }}
          >
            ❤️ Favorites
          </button>
          <button 
            className={currentView === 'recommendations' ? 'active' : ''}
            onClick={() => { setCurrentView('recommendations'); loadRecommendations(); }}
          >
            ⭐ For You
          </button>
        </div>
      </header>
      
      <main>
        {currentView === 'search' && (
          <>
            <div className="input-section">
              <div className="search-container">
                <input
                  type="text"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="e.g., chicken, tomato, pasta"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button onClick={handleSearch} disabled={loading || imageProcessing}>
                  {loading ? 'Searching...' : 'Find Recipes'}
                </button>
                <button 
                  className="ingredient-list-btn"
                  onClick={() => setShowIngredientList(!showIngredientList)}
                >
                  📝 Select Ingredients
                </button>
              </div>
              
              {showIngredientList && (
                <div className="ingredient-selector">
                  <div className="selector-header">
                    <h4>Select Ingredients:</h4>
                    <button 
                      className="close-selector"
                      onClick={() => setShowIngredientList(false)}
                    >
                      ✕
                    </button>
                  </div>
                  
                  {getSelectedIngredients().length > 0 && (
                    <div className="selected-ingredients">
                      <h5>Selected ({getSelectedIngredients().length}):</h5>
                      <div className="selected-list">
                        {getSelectedIngredients().map(ingredient => (
                          <span key={ingredient} className="selected-ingredient">
                            {ingredient}
                            <button onClick={() => removeIngredient(ingredient)}>×</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="ingredient-grid">
                    {commonIngredients.map(ingredient => {
                      const isSelected = getSelectedIngredients().includes(ingredient);
                      return (
                        <button
                          key={ingredient}
                          className={`ingredient-btn ${isSelected ? 'selected' : ''}`}
                          onClick={() => isSelected ? removeIngredient(ingredient) : addIngredient(ingredient)}
                        >
                          {isSelected && '✓ '}{ingredient}
                        </button>
                      );
                    })}
                  </div>
                  
                  <div className="selector-actions">
                    <button 
                      className="clear-all-btn"
                      onClick={() => setIngredients('')}
                    >
                      Clear All
                    </button>
                    <button 
                      className="done-btn"
                      onClick={() => setShowIngredientList(false)}
                    >
                      Done ({getSelectedIngredients().length})
                    </button>
                  </div>
                </div>
              )}
              
              <div className="image-upload">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imageProcessing}
                  className="upload-btn"
                >
                  {imageProcessing ? 'Processing...' : '📷 Upload Photo'}
                </button>
              </div>
            </div>

            <div className="filters">
              <select 
                value={filters.dietary} 
                onChange={(e) => setFilters({...filters, dietary: e.target.value})}
              >
                <option value="">Any Diet</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="gluten-free">Gluten-Free</option>
              </select>
              
              <select 
                value={filters.difficulty} 
                onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
              >
                <option value="">Any Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              
              <select 
                value={filters.maxTime} 
                onChange={(e) => setFilters({...filters, maxTime: e.target.value})}
              >
                <option value="">Any Time</option>
                <option value="15">Under 15 min</option>
                <option value="30">Under 30 min</option>
                <option value="60">Under 1 hour</option>
              </select>
              
              <select 
                value={filters.cuisine} 
                onChange={(e) => setFilters({...filters, cuisine: e.target.value})}
              >
                <option value="">Any Cuisine</option>
                <option value="Italian">Italian</option>
                <option value="Asian">Asian</option>
                <option value="Mexican">Mexican</option>
                <option value="American">American</option>
                <option value="Mediterranean">Mediterranean</option>
              </select>
            </div>
          </>
        )}

        {currentView === 'favorites' && (
          <div className="favorites-section">
            <h2>Your Favorite Recipes</h2>
            {recipes.length === 0 && (
              <p className="no-favorites">No favorites yet. Start exploring recipes!</p>
            )}
          </div>
        )}

        {currentView === 'recommendations' && (
          <div className="recommendations-section">
            <h2>Recommended For You</h2>
            <p>Based on your ratings and preferences</p>
            {recipes.length === 0 && (
              <p className="no-recommendations">Rate some recipes to get personalized recommendations!</p>
            )}
          </div>
        )}

        {loading && <div className="loading">🔍 Finding the best recipes for you...</div>}
        {imageProcessing && <div className="loading">🤖 Analyzing your image... Please wait...</div>}
        {error && <div className={`message ${error.includes('✅') ? 'success-message' : 'error-message'}`}>{error}</div>}

        <div className="recipe-list">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <div className="recipe-header">
                <h3>{recipe.name}</h3>
                <button 
                  className={`favorite-btn ${userFavorites.includes(recipe.id) ? 'favorited' : ''}`}
                  onClick={() => toggleFavorite(recipe.id)}
                >
                  {userFavorites.includes(recipe.id) ? '❤️' : '🤍'}
                </button>
              </div>
              
              <div className="recipe-info">
                <span>🕒 {recipe.cookingTime} min</span>
                <span>👨🍳 {recipe.difficulty}</span>
                <span>🌍 {recipe.cuisine}</span>
              </div>
              
              {currentView === 'search' && recipe.matchScore && (
                <div className="match-score">
                  <div className="match-bar">
                    <div 
                      className="match-fill" 
                      style={{ width: `${recipe.matchScore}%` }}
                    ></div>
                  </div>
                  <span>{Math.round(recipe.matchScore)}% match</span>
                </div>
              )}
              
              <div className="nutrition-preview">
                <span>{recipe.nutritionalInfo.calories} cal</span>
                <span>{recipe.nutritionalInfo.protein}g protein</span>
              </div>
              
              {recipe.missingIngredients?.length > 0 && (
                <div className="missing-ingredients">
                  <small>Missing: {recipe.missingIngredients.slice(0, 3).join(', ')}
                    {recipe.missingIngredients.length > 3 && '...'}
                  </small>
                </div>
              )}
              
              <button 
                className="view-recipe-btn"
                onClick={() => viewRecipe(recipe.id)}
              >
                View Recipe
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;