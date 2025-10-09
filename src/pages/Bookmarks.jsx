import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import { getAuth } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { FiBookmark, FiClock, FiLoader } from 'react-icons/fi';

const Bookmarks = () => {
  const [bookmarkedProjects, setBookmarkedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchBookmarkedProjects = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Get user's bookmarked project IDs
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const bookmarkIds = userDoc.data().bookmarkedProjects || [];

          if (bookmarkIds.length === 0) {
            setBookmarkedProjects([]);
            setLoading(false);
            return;
          }


          const projectsPromises = bookmarkIds.map(async (projectId) => {
          try {
            const projectDoc = await getDoc(doc(db, 'projects', projectId));
            if (projectDoc.exists()) {
              return { id: projectDoc.id, ...projectDoc.data() };
            }
            return null;
          } catch (err) {
            console.error(`Error fetching project ${projectId}:`, err);
            return null;
          }
        });
        //this helps us get the states like resolved fullfiled and pending from all the promises
        const project = await Promise.allSettled(projectsPromises);

        // Keep only fulfilled + non-null results
        const validProjects = project
          .filter(p => p.status === 'fulfilled' && p.value !== null)
          .map(p => p.value);

        setBookmarkedProjects(validProjects);
        }
      } catch (err) {
        console.error('Error fetching bookmarked projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedProjects();
  }, [user]);

  const calculateFundingPercentage = (fundedMoney, fundingGoal) => {
    if (!fundedMoney || !fundingGoal || fundingGoal === 0) return 0;
    return Math.min((fundedMoney / fundingGoal) * 100, 100);
  };

  const formatFunding = (amount) => {
    return amount?.toLocaleString('en-US', { style: 'currency', currency: 'ETB', minimumFractionDigits: 0 }) || '$0';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <FiLoader className="w-12 h-12 text-color-b animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading bookmarks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookmarks</h1>
          <p className="text-gray-600">{bookmarkedProjects.length} saved projects</p>
        </div>

        {/* Bookmarked Projects Grid */}
        {bookmarkedProjects.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiBookmark className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Bookmarks Yet</h3>
            <p className="text-gray-600 mb-6">Start bookmarking projects you're interested in!</p>
            <Link 
              to="/browse" 
              className="inline-block text-color-b hover:underline text-sm font-medium"
            >
              Browse Projects
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedProjects.map((project) => {
              const fundedPercentage = calculateFundingPercentage(project.fundedMoney, project.fundingGoal);
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
                          className="h-1.5 rounded-full bg-gray-900 transition-all"
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
  );
};

export default Bookmarks;
