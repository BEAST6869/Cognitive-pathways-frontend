// Example: How to use the new unified submitQuiz endpoint in your React components

import { apiEndpoints } from './src/services/api.js';

// Example 1: Class 10 Quiz Submission
export async function submitClass10Quiz(answers) {
  try {
    const response = await apiEndpoints.submitQuiz('10th', answers);
    
    // Handle successful response
    if (response.data.success) {
      const { suggestions } = response.data;
      
      // Display Gemini's suggestions to the user
      console.log('Recommended Stream:', suggestions.recommendedStream);
      console.log('AI Insights:', suggestions.aiInsights);
      
      // Update UI with suggestions
      return {
        success: true,
        recommendedStream: suggestions.recommendedStream,
        insights: suggestions.aiInsights,
        message: response.data.message
      };
    }
    
  } catch (error) {
    console.error('Class 10 Quiz submission failed:', error);
    
    // Handle different error types
    if (error.response?.data?.message === 'Database error') {
      return {
        success: false,
        message: 'Failed to save your quiz. Please try again.'
      };
    } else if (error.response?.data?.message === 'Gemini error') {
      return {
        success: false,
        message: 'AI analysis temporarily unavailable. Your quiz was saved.'
      };
    } else {
      return {
        success: false,
        message: 'Something went wrong. Please try again.'
      };
    }
  }
}

// Example 2: Career Quiz Submission
export async function submitCareerQuiz(answers, currentStream) {
  try {
    const response = await apiEndpoints.submitQuiz('career', answers, currentStream);
    
    // Handle successful response
    if (response.data.success) {
      const { suggestions } = response.data;
      
      // Display Gemini's career recommendations
      console.log('Recommended Stream/Field:', suggestions.recommendedStream);
      console.log('Top Courses:', suggestions.topCourses);
      console.log('AI Career Insights:', suggestions.aiInsights);
      
      // Update UI with career suggestions
      return {
        success: true,
        recommendedStream: suggestions.recommendedStream,
        topCourses: suggestions.topCourses || [],
        insights: suggestions.aiInsights,
        message: response.data.message
      };
    }
    
  } catch (error) {
    console.error('Career Quiz submission failed:', error);
    
    // Handle different error types
    if (error.response?.data?.message === 'Database error') {
      return {
        success: false,
        message: 'Failed to save your career quiz. Please try again.'
      };
    } else if (error.response?.data?.message === 'Gemini error') {
      return {
        success: false,
        message: 'AI career analysis temporarily unavailable. Your quiz was saved.'
      };
    } else {
      return {
        success: false,
        message: 'Something went wrong. Please try again.'
      };
    }
  }
}

// Example 3: React Component Usage
export function QuizSubmissionExample() {
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleQuizSubmit = async (quizType, answers, stream = null) => {
    setLoading(true);
    
    try {
      let result;
      
      if (quizType === '10th') {
        result = await submitClass10Quiz(answers);
      } else if (quizType === 'career') {
        result = await submitCareerQuiz(answers, stream);
      }
      
      if (result.success) {
        // Show AI suggestions instead of just success message
        setQuizResult({
          type: quizType,
          recommendedStream: result.recommendedStream,
          topCourses: result.topCourses,
          insights: result.insights,
          message: result.message
        });
      } else {
        // Show error message
        alert(result.message);
      }
      
    } catch (error) {
      console.error('Quiz submission error:', error);
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      {loading && <div>Processing your quiz with AI...</div>}
      
      {quizResult && (
        <div className="quiz-results">
          <h2>Your Personalized Recommendations</h2>
          
          <div className="recommendation">
            <h3>Recommended {quizResult.type === '10th' ? 'Stream' : 'Career Path'}:</h3>
            <p className="recommended-stream">{quizResult.recommendedStream}</p>
          </div>
          
          {quizResult.topCourses && quizResult.topCourses.length > 0 && (
            <div className="top-courses">
              <h3>Top Course Recommendations:</h3>
              <ul>
                {quizResult.topCourses.map((course, index) => (
                  <li key={index}>{course}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="ai-insights">
            <h3>AI Insights & Guidance:</h3>
            <p>{quizResult.insights}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Example 4: Error Handling Examples
export const handleQuizErrors = {
  // Network/Timeout errors
  networkError: (error) => {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return 'Request timed out. Please check your connection and try again.';
    }
    if (error.message === 'Network Error') {
      return 'Network error. Please check your internet connection.';
    }
    return 'Connection failed. Please try again.';
  },
  
  // Validation errors
  validationError: (error) => {
    if (error.response?.data?.errors) {
      return error.response.data.errors.map(err => err.message).join(', ');
    }
    return error.response?.data?.message || 'Invalid quiz data.';
  },
  
  // Server errors
  serverError: (error) => {
    const message = error.response?.data?.message;
    switch (message) {
      case 'Database error':
        return 'Failed to save your quiz responses. Please try again.';
      case 'Gemini error':
        return 'AI analysis is temporarily unavailable. Your quiz was saved, but recommendations may not be available.';
      default:
        return 'Server error occurred. Please try again later.';
    }
  }
};

// Example request/response formats:

/* 
REQUEST FORMAT for Class 10:
{
  "quizType": "10th",
  "responses": [
    "I enjoy solving mathematical problems",
    "Science subjects are interesting to me",
    "I like conducting experiments"
  ]
}

RESPONSE FORMAT for Class 10:
{
  "success": true,
  "message": "Class 10 quiz processed successfully",
  "suggestions": {
    "recommendedStream": "Science",
    "aiInsights": "Based on your responses, you show strong analytical thinking and interest in STEM subjects. Science stream would be ideal for you, offering pathways to engineering, medical sciences, and research careers. Consider exploring different branches of science to find your specific passion."
  }
}

REQUEST FORMAT for Career Quiz:
{
  "quizType": "career",
  "responses": [
    "I am good at programming",
    "I enjoy working with computers",
    "Problem solving is my strength"
  ],
  "stream": "Science"
}

RESPONSE FORMAT for Career Quiz:
{
  "success": true,
  "message": "Career quiz processed successfully",
  "suggestions": {
    "recommendedStream": "Computer Science Engineering",
    "topCourses": [
      "Computer Science Engineering",
      "Information Technology",
      "Software Engineering",
      "Data Science",
      "Artificial Intelligence"
    ],
    "aiInsights": "Your responses indicate strong technical aptitude and problem-solving skills. Computer Science Engineering would be an excellent choice, offering diverse career opportunities in software development, AI, cybersecurity, and more. Focus on building strong programming fundamentals and exploring different tech domains to find your specialty."
  }
}

ERROR RESPONSE FORMAT:
{
  "success": false,
  "message": "Database error" // or "Gemini error" or "Invalid request body"
}
*/
