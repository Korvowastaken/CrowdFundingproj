import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import { Clock, Calendar, DollarSign, Tag, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Browse = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'projects'));
        
        const projectsData = [];
        querySnapshot.forEach((doc) => {
          // Use the document ID if available, otherwise generate a unique ID
          const projectData = {
            id: doc.id || generateUniqueId(),
            ...doc.data()
          };
          projectsData.push(projectData);
        });
        
        setProjects(projectsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Generate a simple unique ID if needed
  const generateUniqueId = () => {
    return 'proj-' + Math.random().toString(36).substr(2, 9);
  };

  // Calculate funding percentage
  const calculateFundingPercentage = (fundedMoney, fundingGoal) => {
    if (!fundedMoney || !fundingGoal || fundingGoal === 0) return 0;
    const percentage = (fundedMoney / fundingGoal) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  // Format funding goal with commas
  const formatFunding = (amount) => {
    return amount?.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }) || '$0';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 pt-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading amazing projects...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 pt-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center bg-white rounded-2xl p-8 shadow-lg max-w-md">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <div className="container mx-auto px-4 pt-12 pb-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Discover Amazing Projects
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Support innovative ideas and bring creative projects to life
          </p>
          <div className="mt-6 bg-white rounded-full px-4 py-2 inline-flex items-center shadow-md">
            <span className="text-green-600 font-semibold mr-2">●</span>
            <span className="text-gray-700">{projects.length} projects livee</span>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container mx-auto px-4 pb-16">
        {projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl p-12 shadow-lg max-w-md mx-auto">
              <div className="text-6xl mb-4">🌱</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Projects Yet</h2>
              <p className="text-gray-600 mb-6">Be the first to launch an amazing project!</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-colors">
                Create Project
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const fundedPercentage = calculateFundingPercentage(project.fundedMoney, project.fundingGoal);
              const isFullyFunded = fundedPercentage >= 100;
              
              return (
                <div 
                  key={project.id} 
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group border border-gray-100"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80';
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-blue-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                        <Tag size={14} className="mr-1" />
                        {project.category || 'General'}
                      </span>
                    </div>
                    {isFullyFunded && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          🎉 Fully Funded!
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {project.title || 'Untitled Project'}
                    </h3>

                    {/* Short Description */}
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {project.shortDescription || 'No description available'}
                    </p>

                    {/* Funding Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-700 mb-2">
                        <div className="flex items-center">
                          <DollarSign size={16} className="mr-1 text-green-600" />
                          <span className="font-semibold">{formatFunding(project.fundedMoney || 0)} raised</span>
                        </div>
                        <div className="flex items-center">
                          <Target size={16} className="mr-1 text-blue-600" />
                          <span className="font-semibold">of {formatFunding(project.fundingGoal)}</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-1000 ${
                            isFullyFunded ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                          }`}
                          style={{ width: `${fundedPercentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{Math.round(fundedPercentage)}% funded</span>
                        <span>{project.fundingGoal - (project.fundedMoney || 0) > 0 ? 
                          formatFunding(project.fundingGoal - (project.fundedMoney || 0)) + ' to go' : 
                          'Goal reached!'
                        }</span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock size={16} className="mr-2 text-blue-600" />
                        <span>{project.duration || 'N/A'} days left</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar size={16} className="mr-2 text-cyan-600" />
                        <span>Ends: {project.endDate || 'TBD'}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button 
                      onClick={() => navigate(`/project/${project.id}`)}
                      className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                        isFullyFunded 
                          ? 'bg-green-500 hover:bg-green-600 text-white' 
                          : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white'
                      }`}
                    >
                      {isFullyFunded ? 'View Project' : 'Support Now'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      {projects.length > 0 && (
        <div className="bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to launch your own project?
              </h2>
              <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105">
                Start Your Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Browse;