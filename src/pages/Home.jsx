import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Discover Your
            <span className="text-primary-600 dark:text-white"> Academic Path</span>
          </h1>
          <p className="text-xl text-gray-700 dark:text-white max-w-3xl mx-auto mb-8 leading-relaxed">
            Take our comprehensive quiz to discover the perfect academic stream for you, 
            explore relevant courses, and find the best colleges to achieve your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              size="xl"
              onClick={() => navigate('/quiz')}
              className="transform hover:scale-105 transition-transform"
            >
              Start Your Journey
            </Button>
            <Button
              variant="outline"
              size="xl"
              onClick={() => navigate('/courses')}
            >
              Explore Courses
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg dark:shadow-gray-900/20 transform transition-all duration-300 ease-in-out will-change-transform hover:scale-105 hover:shadow-md cursor-pointer">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary-600 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Smart Quiz</h3>
            <p className="text-gray-600 dark:text-white">
              Answer 10 carefully crafted questions to discover your ideal academic stream based on your interests and strengths.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg dark:shadow-gray-900/20 transform transition-all duration-300 ease-in-out will-change-transform hover:scale-105 hover:shadow-md cursor-pointer">
            <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-accent-600 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Course Explorer</h3>
            <p className="text-gray-600 dark:text-white">
              Browse through hundreds of courses across Science, Commerce, and Arts streams with detailed descriptions.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg dark:shadow-gray-900/20 transform transition-all duration-300 ease-in-out will-change-transform hover:scale-105 hover:shadow-md cursor-pointer">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary-600 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">College Finder</h3>
            <p className="text-gray-600 dark:text-white">
              Find the perfect colleges and universities that offer your preferred courses with location-based search.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/20 p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Find Your Path?
          </h2>
          <p className="text-gray-700 dark:text-white text-lg mb-6">
            Join thousands of students who have discovered their perfect academic journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/quiz')}
            >
              Take the Quiz Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/colleges')}
            >
              Browse Colleges
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
