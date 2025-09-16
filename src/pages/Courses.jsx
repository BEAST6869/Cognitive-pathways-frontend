import { useState, useEffect } from 'react';
import { apiEndpoints } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedStream, setSelectedStream] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const streams = ['All', 'Science', 'Commerce', 'Arts'];
  
  // Mock courses data
  const mockCourses = [
    {
      id: 1,
      name: 'Computer Science Engineering',
      stream: 'Science',
      description: 'Learn programming, algorithms, and software development. Perfect for tech enthusiasts.',
      duration: '4 years',
      level: 'Undergraduate'
    },
    {
      id: 2,
      name: 'Biotechnology',
      stream: 'Science',
      description: 'Combine biology with technology to solve real-world problems in medicine and agriculture.',
      duration: '4 years',
      level: 'Undergraduate'
    },
    {
      id: 3,
      name: 'Business Administration',
      stream: 'Commerce',
      description: 'Develop leadership and management skills for the corporate world.',
      duration: '3 years',
      level: 'Undergraduate'
    },
    {
      id: 4,
      name: 'Chartered Accountancy',
      stream: 'Commerce',
      description: 'Professional course in accounting, taxation, and financial management.',
      duration: '3-5 years',
      level: 'Professional'
    },
    {
      id: 5,
      name: 'Psychology',
      stream: 'Arts',
      description: 'Study human behavior, mental processes, and emotional well-being.',
      duration: '3 years',
      level: 'Undergraduate'
    },
    {
      id: 6,
      name: 'Mass Communication',
      stream: 'Arts',
      description: 'Learn journalism, media production, and communication strategies.',
      duration: '3 years',
      level: 'Undergraduate'
    },
    {
      id: 7,
      name: 'Mechanical Engineering',
      stream: 'Science',
      description: 'Design and build machines, engines, and mechanical systems.',
      duration: '4 years',
      level: 'Undergraduate'
    },
    {
      id: 8,
      name: 'Economics',
      stream: 'Commerce',
      description: 'Analyze market trends, financial systems, and economic policies.',
      duration: '3 years',
      level: 'Undergraduate'
    },
    {
      id: 9,
      name: 'English Literature',
      stream: 'Arts',
      description: 'Explore classic and contemporary literature, writing, and critical analysis.',
      duration: '3 years',
      level: 'Undergraduate'
    }
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, selectedStream, searchTerm]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setCourses(mockCourses);
        setLoading(false);
      }, 1000);
      
      // Uncomment for real API:
      // const response = await apiEndpoints.getCourses();
      // setCourses(response.data);
    } catch (err) {
      setError('Failed to load courses. Please try again.');
      console.error('Courses fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    if (selectedStream !== 'All') {
      filtered = filtered.filter(course => course.stream === selectedStream);
    }

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Courses
          </h1>
          <p className="text-gray-700 dark:text-white text-lg">
            Discover the perfect course for your career journey. Filter by stream or search for specific interests.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900/20 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                Search Courses
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by course name or description..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Stream Filter */}
            <div>
              <label htmlFor="stream" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                Filter by Stream
              </label>
              <div className="flex gap-2">
                {streams.map((stream) => (
                  <Button
                    key={stream}
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedStream(stream)}
                    className={selectedStream === stream ? 'bg-primary-100 dark:bg-primary-900/30 border-primary-600 dark:border-primary-400' : ''}
                  >
                    {stream}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-white">
            Showing {filteredCourses.length} of {courses.length} courses
            {selectedStream !== 'All' && ` in ${selectedStream}`}
          </p>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                title={course.name}
                subtitle={`${course.duration} • ${course.level}`}
                description={course.description}
                badges={[course.stream]}
                className="hover:scale-105 transition-transform"
              >
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" fullWidth>
                    Learn More
                  </Button>
                  <Button variant="outline" size="sm">
                    Save
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-white">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No courses found
              </h3>
              <p className="text-gray-600 dark:text-white mb-4">
                Try adjusting your search or filter criteria.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStream('All');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Need Help Choosing?
          </h2>
          <p className="text-lg mb-6">
            Take our quiz to get personalized course recommendations based on your interests and goals.
          </p>
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.open('/quiz', '_self')}
            className="bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border-white dark:border-gray-600 hover:bg-primary-100 dark:hover:bg-gray-700"
          >
            Take Career Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Courses;
