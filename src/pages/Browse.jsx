import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase-config';
import { FiSearch, FiFilter, FiClock, FiTrendingUp, FiLoader } from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from "../components/NavBar";

// Project discovery page with search/filter/sort controls and animated cards
const Browse = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch approved projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const projectsRef = collection(db, 'projects');
        const q = query(projectsRef, where('status', '==', 'Approved'));
        const querySnapshot = await getDocs(q);
        const projectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(projectsData);
        setFilteredProjects(projectsData);
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

  // Filter and sort projects
  useEffect(() => {
    let filtered = [...projects];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.createdBy.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt?.seconds * 1000) - new Date(a.createdAt?.seconds * 1000));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt?.seconds * 1000) - new Date(b.createdAt?.seconds * 1000));
        break;
      case 'most_funded':
        filtered.sort((a, b) => (b.fundedMoney || 0) - (a.fundedMoney || 0));
        break;
      case 'least_funded':
        filtered.sort((a, b) => (a.fundedMoney || 0) - (b.fundedMoney || 0));
        break;
      case 'ending_soon':
        filtered.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
        break;
      default:
        break;
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedCategory, sortBy]);

  // Guard against divide-by-zero while computing progress
  const calculateFundingPercentage = (fundedMoney, fundingGoal) => {
    if (!fundedMoney || !fundingGoal || fundingGoal === 0) return 0;
    return Math.min((fundedMoney / fundingGoal) * 100, 100);
  };

  // Format amounts as USD currency strings
  const formatFunding = (amount) => {
    return amount?.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }) || '$0';
  };

  if (loading) return (
    <div className="min-h-screen bg-white pt-20 flex justify-center items-center">
      <div className="text-center">
        <FiLoader className="w-12 h-12 text-color-b animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading projects...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-white pt-20 flex justify-center items-center">
      <div className="text-center max-w-md">
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="text-color-b hover:underline font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  const categories = ['all', 'cars', 'cloth', 'books'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'most_funded', label: 'Most Funded' },
    { value: 'least_funded', label: 'Least Funded' },
    { value: 'ending_soon', label: 'Ending Soon' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Header */}
      <div className="pt-24 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Projects</h1>
          <p className="text-gray-600">{projects.length} projects available</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:border-color-b focus:ring-1 focus:ring-color-b transition-all text-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:border-color-b focus:ring-1 focus:ring-color-b transition-all text-sm bg-white"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 mb-4">No projects found</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="text-color-b hover:underline text-sm font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => {
              const fundedPercentage = calculateFundingPercentage(project.fundedMoney, project.fundingGoal);
              const isFullyFunded = fundedPercentage >= 100;
              const daysLeft = project.endDate ? Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24)) : 0;

              return (
                <Link 
                  to={`/projectDet/${project.id}`} 
                  key={project.id} 
                  className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-900 transition-all duration-200"
                >
                  {/* Project Image */}
                  <div className="relative overflow-hidden aspect-video">
                    <img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      className="w-full h-full object-cover"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3'; }} 
                    />
                  </div>

                  {/* Project Content */}
                  <div className="p-4">
                    {/* Title */}
                    <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                      {project.title || 'Untitled Project'}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {project.shortDescription || 'No description available'}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-blue-500 transition-all"
                          style={{ width: `${fundedPercentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{formatFunding(project.fundedMoney || 0)}</span>
                        <span>{Math.round(fundedPercentage)}%</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{project.backers || 0} backers</span>
                      {daysLeft > 0 && (
                        <span className="flex items-center gap-1">
                          <FiClock className="w-3 h-3" />
                          {daysLeft}d left
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Browse;
