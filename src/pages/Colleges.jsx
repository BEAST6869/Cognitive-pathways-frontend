import { useState, useEffect } from 'react';
import { apiEndpoints } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';

const Colleges = () => {
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock colleges data
  const mockColleges = [
    {
      id: 1,
      name: 'Indian Institute of Technology Delhi',
      location: 'New Delhi, Delhi',
      type: 'Government',
      programs: ['Computer Science', 'Mechanical Engineering', 'Electrical Engineering'],
      rating: 4.8,
      established: 1961
    },
    {
      id: 2,
      name: 'All India Institute of Medical Sciences',
      location: 'New Delhi, Delhi',
      type: 'Government',
      programs: ['MBBS', 'Nursing', 'Biotechnology'],
      rating: 4.9,
      established: 1956
    },
    {
      id: 3,
      name: 'University of Mumbai',
      location: 'Mumbai, Maharashtra',
      type: 'Government',
      programs: ['Commerce', 'Arts', 'Science', 'Law'],
      rating: 4.2,
      established: 1857
    },
    {
      id: 4,
      name: 'Shri Ram College of Commerce',
      location: 'New Delhi, Delhi',
      type: 'Government',
      programs: ['Commerce', 'Economics', 'Business Administration'],
      rating: 4.6,
      established: 1926
    },
    {
      id: 5,
      name: 'Lady Shri Ram College',
      location: 'New Delhi, Delhi',
      type: 'Government',
      programs: ['Psychology', 'English Literature', 'Economics'],
      rating: 4.7,
      established: 1956
    },
    {
      id: 6,
      name: 'National Institute of Technology Trichy',
      location: 'Tiruchirappalli, Tamil Nadu',
      type: 'Government',
      programs: ['Computer Science', 'Mechanical Engineering', 'Civil Engineering'],
      rating: 4.5,
      established: 1964
    },
    {
      id: 7,
      name: 'Christ University',
      location: 'Bangalore, Karnataka',
      type: 'Private',
      programs: ['Commerce', 'Arts', 'Engineering', 'Management'],
      rating: 4.3,
      established: 1969
    },
    {
      id: 8,
      name: 'Jadavpur University',
      location: 'Kolkata, West Bengal',
      type: 'Government',
      programs: ['Engineering', 'Arts', 'Science'],
      rating: 4.4,
      established: 1955
    }
  ];

  useEffect(() => {
    fetchColleges();
  }, []);

  useEffect(() => {
    filterColleges();
  }, [colleges, searchLocation]);

  const fetchColleges = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setColleges(mockColleges);
        setLoading(false);
      }, 1000);
      
      // Uncomment for real API:
      // const response = await apiEndpoints.getColleges();
      // setColleges(response.data);
    } catch (err) {
      setError('Failed to load colleges. Please try again.');
      console.error('Colleges fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterColleges = () => {
    let filtered = colleges;

    if (searchLocation) {
      filtered = filtered.filter(college =>
        college.location.toLowerCase().includes(searchLocation.toLowerCase()) ||
        college.name.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    setFilteredColleges(filtered);
  };

  const getPopularLocations = () => {
    const locations = colleges.map(college => {
      const city = college.location.split(',')[0];
      return city;
    });
    const uniqueLocations = [...new Set(locations)];
    return uniqueLocations.slice(0, 6);
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
            Find Your Perfect College
          </h1>
          <p className="text-gray-700 dark:text-white text-lg">
            Discover top colleges and universities across India. Search by location to find institutions near you.
          </p>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900/20 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Location Search */}
            <div className="flex-1">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                Search by Location or College Name
              </label>
              <input
                type="text"
                id="location"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Enter city, state, or college name..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => setSearchLocation('')}
                variant="outline"
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Popular Locations */}
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-white mb-2">Popular Locations:</p>
            <div className="flex flex-wrap gap-2">
              {getPopularLocations().map((location) => (
                <Button
                  key={location}
                  size="sm"
                  variant="outline"
                  onClick={() => setSearchLocation(location)}
                  className="text-xs"
                >
                  {location}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-white">
            Showing {filteredColleges.length} of {colleges.length} colleges
            {searchLocation && ` for "${searchLocation}"`}
          </p>
        </div>

        {/* Colleges Grid */}
        {filteredColleges.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredColleges.map((college) => (
              <Card
                key={college.id}
                title={college.name}
                subtitle={college.location}
                description={`Established in ${college.established} • ${college.type} Institution`}
                badges={[college.type, `★ ${college.rating}`]}
                className="hover:scale-105 transition-transform"
              >
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Programs Offered:</h4>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {college.programs.map((program, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-accent-100 dark:bg-white/20 text-accent-800 dark:text-white"
                      >
                        {program}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" fullWidth>
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Save
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-white">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No colleges found
              </h3>
              <p className="text-gray-600 dark:text-white mb-4">
                Try adjusting your search criteria or browse all colleges.
              </p>
              <Button
                variant="outline"
                onClick={() => setSearchLocation('')}
              >
                Show All Colleges
              </Button>
            </div>
          </div>
        )}

        {/* College Stats */}
        <div className="mt-12 grid md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900/20 text-center">
            <div className="text-2xl font-bold text-primary-600 dark:text-white mb-2">
              {colleges.filter(c => c.type === 'Government').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-white">Government Colleges</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900/20 text-center">
            <div className="text-2xl font-bold text-accent-600 dark:text-white mb-2">
              {colleges.filter(c => c.type === 'Private').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-white">Private Colleges</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900/20 text-center">
            <div className="text-2xl font-bold text-primary-600 dark:text-white mb-2">
              {getPopularLocations().length}
            </div>
            <div className="text-sm text-gray-600 dark:text-white">Cities Covered</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900/20 text-center">
            <div className="text-2xl font-bold text-accent-600 dark:text-white mb-2">
              {Math.round((colleges.reduce((sum, c) => sum + c.rating, 0) / colleges.length) * 10) / 10}
            </div>
            <div className="text-sm text-gray-600 dark:text-white">Average Rating</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Find Your Dream College
          </h2>
          <p className="text-lg mb-6">
            Need help choosing the right college? Take our quiz to get personalized recommendations.
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

export default Colleges;
