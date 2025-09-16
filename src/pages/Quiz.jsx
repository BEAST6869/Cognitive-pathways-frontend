import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiEndpoints } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Loader from '../components/Loader';
import AuthModal from '../components/AuthModal';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [quizType, setQuizType] = useState(null); // 'class10' or 'class12'
  const [stream, setStream] = useState(''); // For Class 12
  const [pendingQuizType, setPendingQuizType] = useState(null); // store selection when auth needed
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const fetchQuiz = async (selectedQuizType) => {
    if (!isAuthenticated) {
      setPendingQuizType(selectedQuizType);
      setShowAuthModal(true);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await apiEndpoints.getQuizQuestions(selectedQuizType);
      setQuestions(response.data.questions);
      setAnswers(new Array(response.data.questions.length).fill(''));
      setQuizType(selectedQuizType);
    } catch (err) {
      setError('Failed to load quiz questions. Please try again.');
      console.error('Quiz fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError('');
      
      // Filter out empty answers
      const filteredAnswers = answers.filter(a => a && a.trim() !== '');
      
      // Debug: Log the answers being submitted
      console.log('=== QUIZ SUBMISSION DEBUG ===');
      console.log('Quiz Type:', quizType);
      console.log('Stream:', stream);
      console.log('All Answers:', answers);
      console.log('Filtered Answers:', filteredAnswers);
      console.log('Answers count:', filteredAnswers.length);
      console.log('=============================');
      
      if (filteredAnswers.length === 0) {
        setError('Please answer at least one question');
        setSubmitting(false);
        return;
      }
      
      // Determine quiz type for API
      let apiQuizType;
      if (quizType === 'class10') {
        apiQuizType = '10th';
      } else if (quizType === 'class12') {
        apiQuizType = 'career';
        if (!stream) {
          setError('Please select your current stream');
          setSubmitting(false);
          return;
        }
      }
      
      // Use the unified submit-quiz endpoint
      const response = await apiEndpoints.submitQuiz(apiQuizType, filteredAnswers, stream);
      
      console.log('API Response:', response.data);
      
      // Handle success response
      if (response.data.success) {
        setResults({
          ...response.data.suggestions,
          message: response.data.message
        });
      } else {
        setError(response.data.message || 'Failed to submit quiz');
      }
      
    } catch (err) {
      console.error('Quiz submit error:', err);
      
      // Handle different error types
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
        setError('Failed to submit quiz. Please check your connection and try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isQuizComplete = () => {
    return questions.length > 0 && answers.filter(a => a).length === questions.length;
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="max-w-md">
          <div className="text-center">
            <p className="text-red-600 dark:text-white mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </Card>
        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onAuthSuccess={async () => {
              setIsAuthenticated(true);
              setShowAuthModal(false);
              if (pendingQuizType) {
                const typeToLoad = pendingQuizType;
                setPendingQuizType(null);
                await fetchQuiz(typeToLoad);
              }
            }}
          />
        )}
      </div>
    );
  }

  if (results) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Quiz Results
            </h1>
            <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">
                Recommended Stream: {results.recommendedStream}
              </h2>
            </div>
          </div>

          {results.topCourses && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Top Course Recommendations
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {results.topCourses.map((course, index) => (
                  <Card
                    key={index}
                    title={course}
                    badges={[results.recommendedStream]}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              AI Insights
            </h3>
            <Card>
              <p className="text-gray-700 leading-relaxed">
                {results.aiInsights}
              </p>
            </Card>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/courses')}
            >
              Explore All Courses
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/colleges')}
            >
              Find Colleges
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                setResults(null);
                setQuizType(null);
                setQuestions([]);
                setCurrentQuestion(0);
                setAnswers([]);
                setStream('');
              }}
            >
              Take Another Quiz
            </Button>
          </div>
        </div>
        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onAuthSuccess={async () => {
              setIsAuthenticated(true);
              setShowAuthModal(false);
              if (pendingQuizType) {
                const typeToLoad = pendingQuizType;
                setPendingQuizType(null);
                await fetchQuiz(typeToLoad);
              }
            }}
          />
        )}
      </div>
    );
  }

  // Quiz type selection screen
  if (!quizType) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Career Assessment Quiz
              </h1>
            <p className="text-xl text-gray-600 dark:text-white">
                Discover your ideal career path with AI-powered recommendations
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary-500"
                    onClick={() => fetchQuiz('class10')}>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Class 10 Quiz
                  </h3>
                  <p className="text-gray-600 dark:text-white mb-6">
                    Discover your ideal stream for Class 11 & 12. Get personalized recommendations for Science, Commerce, or Arts based on your interests and strengths.
                  </p>
                  <Button variant="outline" size="lg" className="w-full">
                    Start Class 10 Quiz
                  </Button>
                </div>
              </Card>

              <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary-500"
                    onClick={() => fetchQuiz('class12')}>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-accent-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Class 12 Quiz
                  </h3>
                  <p className="text-gray-600 dark:text-white mb-6">
                    Find perfect courses and career paths after Class 12. Get AI-powered recommendations for your next academic journey.
                  </p>
                  <Button variant="outline" size="lg" className="w-full">
                    Start Class 12 Quiz
                  </Button>
                </div>
              </Card>
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-600 dark:text-white">
                Powered by Google Gemini AI for intelligent career guidance
              </p>
            </div>
          </div>
        </div>
        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onAuthSuccess={async () => {
              setIsAuthenticated(true);
              setShowAuthModal(false);
              if (pendingQuizType) {
                const typeToLoad = pendingQuizType;
                setPendingQuizType(null);
                await fetchQuiz(typeToLoad);
              }
            }}
          />
        )}
      </>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {quizType === 'class10' ? 'Class 10' : 'Class 12'} Career Quiz
            </h1>
            <span className="text-sm text-gray-600 dark:text-white">
              {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Stream Selection for Class 12 */}
        {quizType === 'class12' && currentQuestion === 0 && (
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Your current stream:
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {['Science', 'Commerce', 'Arts'].map((streamOption) => (
                <button
                  key={streamOption}
                  onClick={() => setStream(streamOption)}
                  className={`p-4 border rounded-lg transition-colors ${
                    stream === streamOption
                      ? 'border-primary-500 bg-primary-50 dark:bg-white/20 text-primary-700 dark:text-white'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-900 dark:text-white'
                  }`}
                >
                  {streamOption}
                </button>
              ))}
            </div>
            {!stream && (
              <p className="text-red-600 dark:text-white text-sm mt-2">
                Please select your current stream to continue
              </p>
            )}
          </Card>
        )}

        <Card className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {currentQ.question}
          </h2>
          
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  answers[currentQuestion] === option
                    ? 'border-primary-500 bg-primary-50 dark:bg-white/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={option}
                  checked={answers[currentQuestion] === option}
                  onChange={() => handleAnswerSelect(option)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  answers[currentQuestion] === option
                    ? 'border-primary-600 bg-primary-600'
                    : 'border-gray-300'
                }`}>
                  {answers[currentQuestion] === option && (
                    <div className="w-full h-full bg-white rounded-full scale-50"></div>
                  )}
                </div>
                <span className="text-gray-800 dark:text-white">{option}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* Debug: Show selected answers */}
        {answers.some(a => a) && (
          <Card className="mb-4 bg-blue-50 border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Your Selected Answers:</h4>
            <div className="space-y-1 text-xs text-blue-700">
              {answers.map((answer, index) => (
                <div key={index} className="flex">
                  <span className="font-medium w-8">Q{index + 1}:</span>
                  <span className={answer ? 'text-blue-800' : 'text-gray-400'}>
                    {answer || 'Not answered'}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          
          {currentQuestion === questions.length - 1 ? (
            <Button
              variant="outline"
              onClick={handleSubmit}
              disabled={!answers[currentQuestion] || submitting || (quizType === 'class12' && !stream)}
            >
              {submitting ? (
                <>
                  <Loader size="sm" className="mr-2" />
                  Analyzing...
                </>
              ) : (
                'Submit Quiz'
              )}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={!answers[currentQuestion] || (quizType === 'class12' && currentQuestion === 0 && !stream)}
            >
              Next
            </Button>
          )}
        </div>
      </div>
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={async () => {
            setIsAuthenticated(true);
            setShowAuthModal(false);
            if (pendingQuizType) {
              const typeToLoad = pendingQuizType;
              setPendingQuizType(null);
              await fetchQuiz(typeToLoad);
            }
          }}
        />
      )}
    </div>
  );
};

export default Quiz;
