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
    // Proteins
    'chicken', 'beef', 'pork', 'fish', 'salmon', 'shrimp', 'eggs', 'tofu', 'lamb', 'mutton',
    // Dairy
    'milk', 'cheese', 'butter', 'cream', 'yogurt', 'mozzarella', 'parmesan',
    // Vegetables
    'tomato', 'onion', 'garlic', 'potato', 'carrot', 'broccoli', 'spinach',
    'bell pepper', 'mushroom', 'cucumber', 'lettuce', 'avocado', 'corn', 'zucchini',
    'eggplant', 'celery', 'ginger', 'cilantro', 'basil', 'oregano',
    // Grains & Starches
    'rice', 'pasta', 'bread', 'flour', 'quinoa', 'couscous', 'noodles',
    // Pantry Staples
    'olive oil', 'soy sauce', 'salt', 'pepper', 'lemon', 'lime', 'honey',
    'vinegar', 'coconut milk', 'black beans', 'chickpeas', 'lentils'
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
      
      // Enhanced matching algorithm with fuzzy matching and ingredient variations
      const normalizeIngredient = (ing) => {
        return ing.toLowerCase()
          .replace(/s$/, '') // Remove plural 's'
          .replace(/es$/, '') // Remove plural 'es'
          .replace(/ies$/, 'y') // Replace 'ies' with 'y'
          .trim();
      };
      
      const ingredientSynonyms = {
        'tomato': ['tomatoes', 'cherry tomato', 'roma tomato', 'tomato sauce'],
        'onion': ['onions', 'yellow onion', 'white onion', 'red onion'],
        'bell pepper': ['peppers', 'capsicum', 'red pepper', 'green pepper'],
        'chicken': ['chicken breast', 'chicken thigh', 'poultry', 'ground chicken'],
        'beef': ['ground beef', 'beef steak', 'steak', 'beef strips'],
        'mutton': ['lamb', 'goat meat', 'sheep meat'],
        'lamb': ['mutton', 'lamb chops', 'ground lamb'],
        'cheese': ['cheddar', 'mozzarella', 'parmesan', 'feta cheese'],
        'pasta': ['spaghetti', 'penne', 'noodles', 'egg noodles'],
        'rice': ['white rice', 'brown rice', 'jasmine rice', 'arborio rice'],
        'oil': ['olive oil', 'vegetable oil', 'cooking oil', 'sesame oil'],
        'milk': ['coconut milk', 'almond milk', 'whole milk'],
        'beans': ['black beans', 'kidney beans', 'chickpeas', 'lentils'],
        'fish': ['salmon', 'white fish', 'tuna', 'cod'],
        'egg': ['eggs', 'egg whites'],
        'garlic': ['garlic cloves', 'minced garlic'],
        'ginger': ['fresh ginger', 'ground ginger'],
        'potato': ['potatoes', 'sweet potato'],
        'carrot': ['carrots'],
        'mushroom': ['mushrooms', 'button mushroom', 'shiitake']
      };
      
      const findIngredientMatch = (userIng, recipeIng) => {
        const normalizedUser = normalizeIngredient(userIng);
        const normalizedRecipe = normalizeIngredient(recipeIng);
        
        // Direct exact match
        if (normalizedUser === normalizedRecipe) {
          return true;
        }
        
        // Check if user ingredient is contained in recipe ingredient (e.g., "tomato" matches "tomato sauce")
        if (normalizedRecipe.includes(normalizedUser) && normalizedUser.length >= 3) {
          return true;
        }
        
        // Synonym matching - only if both ingredients map to the same base
        for (const [base, synonyms] of Object.entries(ingredientSynonyms)) {
          const userMatchesBase = normalizedUser === base || synonyms.some(s => normalizeIngredient(s) === normalizedUser);
          const recipeMatchesBase = normalizedRecipe === base || synonyms.some(s => normalizeIngredient(s) === normalizedRecipe);
          
          if (userMatchesBase && recipeMatchesBase) {
            return true;
          }
        }
        
        return false;
      };
      
      let filteredRecipes = recipeData.map(recipe => {
        let matchCount = 0;
        const missingIngredients = [];
        const matchedIngredients = [];
        
        recipe.ingredients.forEach(ingredient => {
          let found = false;
          for (const userIng of availableIngredients) {
            if (findIngredientMatch(userIng, ingredient)) {
              matchCount++;
              matchedIngredients.push(ingredient);
              found = true;
              break;
            }
          }
          if (!found) {
            missingIngredients.push(ingredient);
          }
        });

        // Enhanced scoring: bonus for more matches, penalty for missing ingredients
        let score = (matchCount / recipe.ingredients.length) * 100;
        
        // Only proceed if we have at least 1 matching ingredient
        if (matchCount === 0) {
          score = 0;
        } else {
          // Bonus for having many matching ingredients
          if (matchCount >= 3) score += 15;
          if (matchCount >= 5) score += 25;
          
          // Bonus for high match percentage
          const matchPercentage = (matchCount / recipe.ingredients.length);
          if (matchPercentage >= 0.7) score += 20;
          if (matchPercentage >= 0.5) score += 10;
          
          // Slight bonus for recipes with fewer total ingredients (easier to make)
          if (recipe.ingredients.length <= 6) score += 5;
          
          // Bonus for recipes where user has most ingredients
          if (missingIngredients.length <= 2) score += 15;
        }
        
        return { 
          ...recipe, 
          matchScore: Math.min(score, 100), 
          missingIngredients,
          matchedIngredients,
          matchCount 
        };
      }).filter(recipe => {
        // Only show recipes that have at least one matching ingredient
        return recipe.matchScore > 0 && recipe.matchCount > 0;
      });

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

      // Enhanced sorting: prioritize match score, then match count, then fewer missing ingredients
      filteredRecipes.sort((a, b) => {
        if (Math.abs(a.matchScore - b.matchScore) < 5) {
          // If scores are close, prefer more matched ingredients
          if (a.matchCount !== b.matchCount) {
            return b.matchCount - a.matchCount;
          }
          // Then prefer fewer missing ingredients
          return a.missingIngredients.length - b.missingIngredients.length;
        }
        return b.matchScore - a.matchScore;
      });
      
      // Limit to top 12 results for better performance
      filteredRecipes = filteredRecipes.slice(0, 12);
      
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
    // Get recipes based on user ratings - prefer highly rated recipes and similar ones
    const ratedRecipes = Object.keys(userRatings).map(id => ({
      id: parseInt(id),
      rating: userRatings[id]
    }));
    
    if (ratedRecipes.length === 0) {
      // If no ratings, show popular recipes (shorter cooking time, easy difficulty)
      const recommended = recipeData
        .filter(r => r.difficulty === 'Easy' && r.cookingTime <= 30)
        .slice(0, 6);
      setRecipes(recommended);
      return;
    }
    
    // Get highly rated recipes (4+ stars) and find similar cuisines
    const highlyRated = ratedRecipes.filter(r => r.rating >= 4);
    const preferredCuisines = highlyRated.map(r => {
      const recipe = recipeData.find(rec => rec.id === r.id);
      return recipe?.cuisine;
    }).filter(Boolean);
    
    // Recommend recipes from preferred cuisines that user hasn't rated
    const recommended = recipeData
      .filter(recipe => 
        !userRatings[recipe.id] && 
        (preferredCuisines.includes(recipe.cuisine) || recipe.difficulty === 'Easy')
      )
      .slice(0, 8);
    
    setRecipes(recommended);
  };

  const loadAllRecipes = () => {
    setRecipes([...recipeData]);
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
              <span className="rating-label">Rate this recipe:</span>
              {[1,2,3,4,5].map(star => {
                const userRating = userRatings[selectedRecipe.id];
                let className = '';
                if (userRating >= star) {
                  className = `rated-${userRating}`;
                }
                return (
                  <button 
                    key={star} 
                    className={className}
                    onClick={() => rateRecipe(selectedRecipe.id, star)}
                  >
                    ⭐
                  </button>
                );
              })}
              {userRatings[selectedRecipe.id] && (
                <span style={{marginLeft: '1rem', color: '#666', fontSize: '0.9rem'}}>
                  ({userRatings[selectedRecipe.id]}/5 stars)
                </span>
              )}
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
          <button 
            className={currentView === 'browse' ? 'active' : ''}
            onClick={() => { setCurrentView('browse'); loadAllRecipes(); }}
          >
            📚 Browse All
          </button>
        </div>
      </header>
      
      <main>
        {currentView === 'search' && (
          <div className="search-section">
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
          </div>
        )}

        {currentView === 'favorites' && (
          <div className="favorites-section">
            <h2>❤️ Your Favorite Recipes</h2>
            {recipes.length === 0 ? (
              <div className="no-favorites">
                <h3>No favorites yet!</h3>
                <p>Start exploring recipes and click the ❤️ button to save your favorites here.</p>
              </div>
            ) : (
              <p style={{color: '#555', marginBottom: '2rem', fontSize: '1.1rem'}}>
                You have {recipes.length} favorite recipe{recipes.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}

        {currentView === 'recommendations' && (
          <div className="recommendations-section">
            <h2>⭐ Recommended For You</h2>
            <p>Discover new recipes based on your ratings and preferences</p>
            {recipes.length === 0 ? (
              <div className="no-recommendations">
                <h3>No recommendations yet!</h3>
                <p>Rate some recipes to get personalized recommendations tailored just for you.</p>
              </div>
            ) : (
              <p style={{color: '#555', marginBottom: '2rem', fontSize: '1.1rem'}}>
                Here are {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} we think you'll love
              </p>
            )}
          </div>
        )}

        {currentView === 'browse' && (
          <div className="browse-section">
            <h2>📚 Browse All Recipes</h2>
            <p>Explore our complete collection of {recipeData.length} delicious recipes</p>
            <div className="recipe-stats">
              <div className="stat-item">
                <span className="stat-number">{recipeData.filter(r => r.difficulty === 'Easy').length}</span>
                <span className="stat-label">Easy Recipes</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{new Set(recipeData.map(r => r.cuisine)).size}</span>
                <span className="stat-label">Cuisines</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{recipeData.filter(r => r.cookingTime <= 30).length}</span>
                <span className="stat-label">Quick Meals</span>
              </div>
            </div>
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
                <span className="time-badge">🕒 {recipe.cookingTime} min</span>
                <span className={`difficulty-badge difficulty-${recipe.difficulty.toLowerCase()}`}>👨🍳 {recipe.difficulty}</span>
                <span className="cuisine-badge">🌍 {recipe.cuisine}</span>
                {recipe.dietary && recipe.dietary.length > 0 && (
                  <span className="dietary-badge">🌱 {recipe.dietary[0]}</span>
                )}
              </div>
              
              {currentView === 'search' && recipe.matchScore && (
                <div className="match-score">
                  <div className="match-info">
                    <span className="match-percentage">{Math.round(recipe.matchScore)}% match</span>
                    <span className="match-details">({recipe.matchCount}/{recipe.ingredients.length} ingredients)</span>
                  </div>
                  <div className="match-bar">
                    <div 
                      className="match-fill" 
                      style={{ width: `${recipe.matchScore}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <div className="nutrition-preview">
                <span>{recipe.nutritionalInfo.calories} cal</span>
                <span>{recipe.nutritionalInfo.protein}g protein</span>
              </div>
              
              {currentView === 'search' && (
                <div className="ingredient-status">
                  {recipe.matchedIngredients?.length > 0 && (
                    <div className="matched-ingredients">
                      <small>✅ Have: {recipe.matchedIngredients.slice(0, 3).join(', ')}
                        {recipe.matchedIngredients.length > 3 && ` +${recipe.matchedIngredients.length - 3} more`}
                      </small>
                    </div>
                  )}
                  {recipe.missingIngredients?.length > 0 && (
                    <div className="missing-ingredients">
                      <small>❌ Need: {recipe.missingIngredients.slice(0, 3).join(', ')}
                        {recipe.missingIngredients.length > 3 && ` +${recipe.missingIngredients.length - 3} more`}
                      </small>
                    </div>
                  )}
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