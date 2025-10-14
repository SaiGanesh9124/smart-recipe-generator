// Simple test script to verify the setup
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Smart Recipe Generator Setup...\n');

// Check if all required files exist
const requiredFiles = [
  'backend/server.js',
  'backend/recipes.json',
  'backend/package.json',
  'frontend/src/App.js',
  'frontend/src/App.css',
  'frontend/package.json',
  'README.md',
  'Procfile',
  'netlify.toml'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} - Found`);
  } else {
    console.log(`❌ ${file} - Missing`);
    allFilesExist = false;
  }
});

// Check recipe database
try {
  const recipes = require('./backend/recipes.json');
  console.log(`\n📊 Recipe Database: ${recipes.length} recipes loaded`);
  
  if (recipes.length >= 20) {
    console.log('✅ Recipe requirement met (20+ recipes)');
  } else {
    console.log('❌ Need at least 20 recipes');
  }
  
  // Check recipe structure
  const sampleRecipe = recipes[0];
  const requiredFields = ['id', 'name', 'ingredients', 'instructions', 'cookingTime', 'difficulty', 'dietary', 'cuisine', 'nutritionalInfo'];
  
  const hasAllFields = requiredFields.every(field => sampleRecipe.hasOwnProperty(field));
  
  if (hasAllFields) {
    console.log('✅ Recipe structure is correct');
  } else {
    console.log('❌ Recipe structure missing required fields');
  }
  
} catch (error) {
  console.log('❌ Error loading recipe database:', error.message);
  allFilesExist = false;
}

// Summary
console.log('\n' + '='.repeat(50));
if (allFilesExist) {
  console.log('🎉 Setup Complete! Your Smart Recipe Generator is ready.');
  console.log('\nNext steps:');
  console.log('1. cd backend && npm install');
  console.log('2. cd ../frontend && npm install');
  console.log('3. Start backend: cd ../backend && npm start');
  console.log('4. Start frontend: cd ../frontend && npm start');
  console.log('5. Open http://localhost:3000');
} else {
  console.log('❌ Setup incomplete. Please check missing files.');
}
console.log('='.repeat(50));