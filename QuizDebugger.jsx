import React, { useState } from 'react';
import { apiEndpoints } from './src/services/api.js';

// Simple debug component to test quiz submission
const QuizDebugger = () => {
  const [answers, setAnswers] = useState([
    'I enjoy solving mathematical problems',
    'Science subjects are interesting to me', 
    'I like conducting experiments',
    'Technology fascinates me',
    'I prefer logical thinking'
  ]);
  const [quizType, setQuizType] = useState('10th');
  const [stream, setStream] = useState('Science');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const addAnswer = () => {
    setAnswers([...answers, '']);
  };

  const removeAnswer = (index) => {
    const newAnswers = answers.filter((_, i) => i !== index);
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Filter out empty answers
      const filteredAnswers = answers.filter(a => a && a.trim() !== '');
      
      // Debug: Log what we're sending
      console.log('=== QUIZ DEBUGGER SUBMISSION ===');
      console.log('Quiz Type:', quizType);
      console.log('Stream:', stream);
      console.log('Original Answers:', answers);
      console.log('Filtered Answers:', filteredAnswers);
      console.log('Request Payload:', {
        quizType,
        responses: filteredAnswers,
        stream: quizType === 'career' ? stream : undefined
      });
      console.log('================================');

      // Submit using the unified endpoint
      const response = await apiEndpoints.submitQuiz(
        quizType, 
        filteredAnswers, 
        quizType === 'career' ? stream : null
      );

      console.log('API Response:', response.data);

      if (response.data.success) {
        setResult(response.data.suggestions);
      } else {
        setError(response.data.message || 'Failed to submit quiz');
      }

    } catch (err) {
      console.error('Quiz submission error:', err);
      
      if (err.response?.data?.message) {
        const errorMsg = err.response.data.message;
        if (errorMsg === 'Database error') {
          setError('Failed to save your quiz. Please try again.');
        } else if (errorMsg === 'Gemini error') {
          setError('AI analysis temporarily unavailable. Please try again.');
        } else {
          setError(errorMsg);
        }
      } else {
        setError('Failed to submit quiz. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Quiz Debugger</h1>
      
      {/* Quiz Type Selection */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          <strong>Quiz Type:</strong>
          <select 
            value={quizType} 
            onChange={(e) => setQuizType(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            <option value="10th">Class 10 (10th)</option>
            <option value="career">Career Quiz</option>
          </select>
        </label>
      </div>

      {/* Stream Selection (for career quiz) */}
      {quizType === 'career' && (
        <div style={{ marginBottom: '20px' }}>
          <label>
            <strong>Current Stream:</strong>
            <select 
              value={stream} 
              onChange={(e) => setStream(e.target.value)}
              style={{ marginLeft: '10px', padding: '5px' }}
            >
              <option value="Science">Science</option>
              <option value="Commerce">Commerce</option>
              <option value="Arts">Arts</option>
            </select>
          </label>
        </div>
      )}

      {/* Answers Input */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Quiz Answers:</h3>
        {answers.map((answer, index) => (
          <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '10px', fontWeight: 'bold' }}>Q{index + 1}:</span>
            <input
              type="text"
              value={answer}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              style={{ 
                flex: 1, 
                padding: '8px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                marginRight: '10px'
              }}
              placeholder="Enter your answer..."
            />
            <button 
              onClick={() => removeAnswer(index)}
              style={{ 
                padding: '5px 10px', 
                backgroundColor: '#ff4444', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Remove
            </button>
          </div>
        ))}
        <button 
          onClick={addAnswer}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Add Answer
        </button>
      </div>

      {/* Debug Info */}
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '5px', 
        marginBottom: '20px' 
      }}>
        <h4>Debug Info:</h4>
        <p><strong>Total Answers:</strong> {answers.length}</p>
        <p><strong>Non-empty Answers:</strong> {answers.filter(a => a && a.trim() !== '').length}</p>
        <p><strong>Will Submit:</strong> {JSON.stringify({
          quizType,
          responses: answers.filter(a => a && a.trim() !== ''),
          stream: quizType === 'career' ? stream : 'N/A'
        }, null, 2)}</p>
      </div>

      {/* Submit Button */}
      <button 
        onClick={handleSubmit}
        disabled={loading || answers.filter(a => a && a.trim() !== '').length === 0}
        style={{ 
          padding: '12px 24px', 
          backgroundColor: loading ? '#ccc' : '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px'
        }}
      >
        {loading ? 'Submitting...' : 'Submit Quiz'}
      </button>

      {/* Error Display */}
      {error && (
        <div style={{ 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          padding: '15px', 
          borderRadius: '5px', 
          marginTop: '20px',
          border: '1px solid #e57373'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div style={{ 
          backgroundColor: '#e8f5e8', 
          color: '#2e7d32', 
          padding: '20px', 
          borderRadius: '5px', 
          marginTop: '20px',
          border: '1px solid #81c784'
        }}>
          <h3>🎉 Quiz Results:</h3>
          <p><strong>Recommended Stream:</strong> {result.recommendedStream}</p>
          {result.topCourses && result.topCourses.length > 0 && (
            <div>
              <strong>Top Courses:</strong>
              <ul>
                {result.topCourses.map((course, index) => (
                  <li key={index}>{course}</li>
                ))}
              </ul>
            </div>
          )}
          <div style={{ marginTop: '15px' }}>
            <strong>AI Insights:</strong>
            <p style={{ 
              backgroundColor: 'white', 
              padding: '15px', 
              borderRadius: '5px', 
              marginTop: '10px',
              lineHeight: '1.5'
            }}>
              {result.aiInsights}
            </p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div style={{ 
        backgroundColor: '#fff3cd', 
        color: '#856404', 
        padding: '15px', 
        borderRadius: '5px', 
        marginTop: '30px',
        border: '1px solid #ffeaa7'
      }}>
        <h4>📋 How to Use This Debugger:</h4>
        <ol>
          <li>Make sure your backend server is running on localhost:3000</li>
          <li>Make sure you're logged in (check localStorage for 'token' or 'authToken')</li>
          <li>Select quiz type (10th or career)</li>
          <li>If career quiz, select your stream</li>
          <li>Add/edit quiz answers (at least one non-empty answer required)</li>
          <li>Click Submit Quiz</li>
          <li>Check browser console for detailed logs</li>
          <li>View the result or error message below</li>
        </ol>
      </div>
    </div>
  );
};

export default QuizDebugger;
