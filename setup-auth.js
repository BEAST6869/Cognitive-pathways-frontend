// Frontend Authentication Setup Script
// Run this in your browser console to set up authentication

console.log('🔧 Setting up authentication for Cognitive Pathways frontend...');

// Clear any existing invalid tokens
localStorage.removeItem('token');
localStorage.removeItem('authToken');

// Set the working token
const workingToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGM5OTkxMWExNGFhZjU2ZTkxOGI4OWMiLCJpYXQiOjE3NTgwNDI0MjR9.BbeCmA9NQo3IgsPRSuarxbRWOizCY9RiMVocNQDzW38';
localStorage.setItem('token', workingToken);

console.log('✅ Authentication token set successfully!');
console.log('🎯 You can now use the quiz without "Invalid Token" errors');

// Test the token
console.log('🧪 Testing token...');
fetch('http://localhost:3000/api/quiz/submit-quiz', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${workingToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    quizType: '10th',
    responses: [
      'I enjoy solving mathematical problems',
      'Science subjects are interesting to me',
      'I like conducting experiments'
    ]
  })
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('✅ Test successful! Quiz submission working');
    console.log('🎓 Recommended Stream:', data.suggestions.recommendedStream);
    console.log('🤖 AI Insights:', data.suggestions.aiInsights);
  } else {
    console.log('❌ Test failed:', data.message);
  }
})
.catch(error => {
  console.error('❌ Test error:', error);
});

// Instructions
console.log('');
console.log('📋 NEXT STEPS:');
console.log('1. Make sure your backend is running on http://localhost:3000');
console.log('2. Start your React frontend: npm run dev');
console.log('3. Go to the quiz page and try submitting answers');
console.log('4. The "Invalid Token" error should be resolved!');
console.log('');
console.log('🔍 If you still get errors, open browser DevTools and check:');
console.log('   - Network tab for API requests');
console.log('   - Console for any error messages');
console.log('   - Application > Local Storage to verify token is present');
