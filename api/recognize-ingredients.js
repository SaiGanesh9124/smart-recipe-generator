export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const mockIngredients = ['tomato', 'onion', 'garlic', 'chicken', 'pasta', 'carrot', 'bell pepper'];
  const detected = mockIngredients.slice(0, Math.floor(Math.random() * 4) + 2);
  
  setTimeout(() => {
    res.json({ 
      ingredients: detected, 
      confidence: 0.85,
      message: `Detected ${detected.length} ingredients`
    });
  }, 1500);
}