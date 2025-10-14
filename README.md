# 🍳 Smart Recipe Generator

A modern web application that suggests recipes based on available ingredients, featuring image recognition, dietary filters, and user feedback systems.

## ✨ Features

### Core Functionality
- **Ingredient Input**: Text input or photo upload for ingredient detection
- **Recipe Matching**: Advanced algorithm matching recipes to available ingredients
- **Dietary Filters**: Vegetarian, vegan, gluten-free options
- **Smart Filtering**: Filter by difficulty, cooking time, and cuisine
- **Recipe Database**: 20+ diverse recipes from various cuisines

### User Experience
- **Mobile Responsive**: Optimized for all device sizes
- **Image Recognition**: Upload photos to detect ingredients (mock implementation)
- **User Ratings**: Rate recipes from 1-5 stars
- **Favorites System**: Save and manage favorite recipes
- **Substitution Suggestions**: Get alternatives for missing ingredients
- **Serving Size Adjustment**: Scale recipes up or down
- **Nutritional Information**: Calories, protein, carbs, and fat per serving

### Technical Features
- **Real-time Search**: Instant recipe matching
- **Error Handling**: Comprehensive error management
- **Loading States**: Smooth user experience with loading indicators
- **Match Scoring**: Percentage-based ingredient matching
- **Missing Ingredients**: Clear indication of what's needed

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd smart-recipe-generator
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the backend server**
   ```bash
   cd ../backend
   npm run dev
   ```

5. **Start the frontend (in a new terminal)**
   ```bash
   cd frontend
   npm start
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Architecture

### Backend (Node.js/Express)
- **Recipe API**: RESTful endpoints for recipe operations
- **Filtering Engine**: Advanced recipe matching algorithm
- **Image Processing**: Mock ingredient recognition endpoint
- **User Management**: Ratings and favorites system
- **Error Handling**: Comprehensive error management

### Frontend (React)
- **Component-Based**: Modular React components
- **State Management**: React hooks for state management
- **Responsive Design**: Mobile-first CSS approach
- **User Interface**: Modern, intuitive design

### Key Algorithms

#### Recipe Matching Logic
```javascript
// Calculate match score based on available ingredients
const matchScore = (matchedIngredients / totalRecipeIngredients) * 100;

// Filter recipes with at least one matching ingredient
const validRecipes = recipes.filter(recipe => recipe.matchScore > 0);

// Sort by best match first
validRecipes.sort((a, b) => b.matchScore - a.matchScore);
```

#### Ingredient Classification
- Fuzzy matching for ingredient names
- Plural/singular normalization
- Common ingredient mappings
- Substitution suggestions based on recipe database

## 📱 API Endpoints

### Recipe Operations
- `GET /api/recipes` - Search recipes with filters
- `GET /api/recipes/:id` - Get recipe details
- `POST /api/recipes/:id/rate` - Rate a recipe
- `POST /api/recipes/:id/favorite` - Toggle favorite status

### User Features
- `GET /api/favorites` - Get user's favorite recipes
- `GET /api/substitutions/:ingredient` - Get substitution suggestions

### Image Processing
- `POST /api/recognize-ingredients` - Process uploaded images

### Health Check
- `GET /health` - Server health status

## 🎨 UI/UX Design

### Design Principles
- **Mobile-First**: Responsive design starting from mobile
- **Accessibility**: WCAG compliant interface
- **Performance**: Optimized loading and interactions
- **Intuitive Navigation**: Clear user flow and feedback

### Color Scheme
- Primary: Linear gradient (#667eea to #764ba2)
- Success: Green gradient for match indicators
- Error: Red tones for error states
- Neutral: Gray scale for secondary information

### Typography
- System fonts for optimal performance
- Hierarchical sizing for clear information structure
- Readable line heights and spacing

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:
```env
PORT=5000
NODE_ENV=development
```

### Frontend Configuration
Update API base URL in `App.js` for production:
```javascript
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.herokuapp.com' 
  : 'http://localhost:5000';
```

## 🚀 Deployment

### Backend (Heroku)
1. Create a Heroku app
2. Connect your GitHub repository
3. Set environment variables in Heroku dashboard
4. Deploy from main branch

### Frontend (Netlify)
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Update API URL in netlify.toml
5. Deploy

### Alternative Deployment Options
- **Vercel**: For both frontend and serverless backend
- **Railway**: For backend deployment
- **GitHub Pages**: For frontend (static hosting)

## 🧪 Testing

### Manual Testing Checklist
- [ ] Recipe search with various ingredients
- [ ] Filter functionality (dietary, difficulty, time, cuisine)
- [ ] Image upload and processing
- [ ] Recipe detail view
- [ ] Rating and favorite systems
- [ ] Mobile responsiveness
- [ ] Error handling scenarios

### Test Scenarios
1. **Empty ingredient search** - Should show error message
2. **No matching recipes** - Should display appropriate message
3. **Server offline** - Should handle connection errors gracefully
4. **Image upload** - Should process and populate ingredients
5. **Filter combinations** - Should work with multiple filters

## 🔍 Error Handling

### Frontend Error Handling
- Network connectivity issues
- Invalid server responses
- Image processing failures
- User input validation

### Backend Error Handling
- Invalid request parameters
- Database connection issues
- File processing errors
- Rate limiting and security

## 📊 Performance Considerations

### Frontend Optimizations
- Component memoization for expensive operations
- Lazy loading for recipe details
- Image optimization and compression
- Efficient state management

### Backend Optimizations
- In-memory caching for recipe data
- Request validation and sanitization
- Efficient filtering algorithms
- Response compression

## 🔮 Future Enhancements

### Planned Features
- **Real Image Recognition**: Integration with Clarifai or Google Vision API
- **User Accounts**: Personal recipe collections and history
- **Shopping Lists**: Generate shopping lists from recipes
- **Meal Planning**: Weekly meal planning functionality
- **Social Features**: Recipe sharing and community ratings
- **Advanced Nutrition**: Detailed nutritional analysis
- **Recipe Creation**: User-generated recipe submissions

### Technical Improvements
- **Database Integration**: PostgreSQL or MongoDB for data persistence
- **Authentication**: JWT-based user authentication
- **Caching**: Redis for improved performance
- **Testing**: Comprehensive unit and integration tests
- **CI/CD**: Automated testing and deployment pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Recipe data curated from various culinary sources
- Icons and emojis for enhanced user experience
- Modern web development best practices
- Responsive design principles

---

**Built with ❤️ for food lovers and cooking enthusiasts**