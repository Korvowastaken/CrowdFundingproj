import React, { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase/firebase-config';

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('creators');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form schemas for different entities
  const formSchemas = {
    creators: {
      name: '',
      phone: '',
      email: '',
      password: ''
    },
    projects: {
      projectTitle: '',
      balance: 0,
      fundGoal: 0,
      description: '',
      projectStatus: 'pending',
      creatorId: ''
    },
    users: {
      name: '',
      email: '',
      phone: '',
      password: '',
      backedProjects: []
    },
    admins: {
      adminName: '',
      password: ''
    }
  };

  // Initialize form data
  useEffect(() => {
    setFormData(formSchemas[activeTab]);
  }, [activeTab]);

  // Fetch data based on active tab
  const fetchData = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(query(collection(db, activeTab), orderBy('name' || 'projectTitle' || 'adminName')));
      const dataArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setData(dataArray);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        // Update existing document
        await updateDoc(doc(db, activeTab, editingId), formData);
        setIsEditing(false);
        setEditingId(null);
      } else {
        // Add new document
        await addDoc(collection(db, activeTab), formData);
      }
      
      setFormData(formSchemas[activeTab]);
      fetchData();
      alert(isEditing ? 'Updated successfully!' : 'Added successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (item) => {
    setIsEditing(true);
    setEditingId(item.id);
    setFormData(item);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteDoc(doc(db, activeTab, id));
        fetchData();
        alert('Deleted successfully!');
      } catch (error) {
        console.error('Error deleting data:', error);
        alert('Error deleting data');
      }
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData(formSchemas[activeTab]);
  };

  // Render form fields based on active tab
  const renderFormFields = () => {
    const schema = formSchemas[activeTab];
    
    return Object.entries(schema).map(([key, value]) => {
      if (key === 'id') return null;
      
      let inputType = 'text';
      if (key === 'balance' || key === 'fundGoal') inputType = 'number';
      if (key === 'password') inputType = 'password';
      if (key === 'email') inputType = 'email';
      if (key === 'phone') inputType = 'tel';
      if (key === 'description') inputType = 'textarea';
      if (key === 'projectStatus') inputType = 'select';
      if (key === 'backedProjects') inputType = 'array';

      if (inputType === 'textarea') {
        return (
          <div key={key} className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
            </label>
            <textarea
              name={key}
              value={formData[key] || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
              rows="3"
            />
          </div>
        );
      }

      if (inputType === 'select') {
        return (
          <div key={key} className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
            </label>
            <select
              name={key}
              value={formData[key] || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm bg-white"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        );
      }

      if (inputType === 'array') {
        return (
          <div key={key} className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              type="text"
              name={key}
              value={Array.isArray(formData[key]) ? formData[key].join(', ') : ''}
              onChange={(e) => {
                const arrayValue = e.target.value.split(',').map(item => item.trim()).filter(item => item);
                setFormData(prev => ({ ...prev, [key]: arrayValue }));
              }}
              placeholder="Enter comma-separated values"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
            />
          </div>
        );
      }

      return (
        <div key={key} className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
          </label>
          <input
            type={inputType}
            name={key}
            value={formData[key] || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
            placeholder={`Enter ${key}`}
          />
        </div>
      );
    });
  };

  // Render data table
  const renderDataTable = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-500">Loading data...</p>
          </div>
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeTab} found</h3>
          <p className="text-gray-500">Get started by adding your first {activeTab.slice(0, -1)}.</p>
        </div>
      );
    }

    const columns = Object.keys(data[0]).filter(key => key !== 'id');

    return (
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              {columns.map(column => (
                <th key={column} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {column.charAt(0).toUpperCase() + column.slice(1).replace(/([A-Z])/g, ' $1')}
                </th>
              ))}
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={item.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                {columns.map(column => (
                  <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {Array.isArray(item[column]) 
                      ? item[column].join(', ') 
                      : typeof item[column] === 'object' 
                        ? JSON.stringify(item[column]) 
                        : String(item[column] || '')}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-lg text-gray-600">
                Manage your crowdfunding platform data with full CRUD operations
              </p>
            </div>
            <button
              onClick={onLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <nav className="-mb-px flex space-x-8 px-8">
              {['creators', 'projects', 'users', 'admins'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="flex items-center">
                    {tab === 'creators' && '👥'}
                    {tab === 'projects' && '🚀'}
                    {tab === 'users' && '👤'}
                    {tab === 'admins' && '🔐'}
                    <span className="ml-2">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {/* Form Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8 border border-blue-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-3">
                  {isEditing ? '✏️' : '➕'}
                </span>
                {isEditing ? 'Edit' : 'Add New'} {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).slice(0, -1)}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderFormFields()}
                <div className="md:col-span-2 flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isEditing ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      <>
                        {isEditing ? '✏️ Update' : '➕ Add'}
                      </>
                    )}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      ❌ Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Data Table Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="mr-3">📊</span>
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} List
                </h2>
                <button
                  onClick={fetchData}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
              {renderDataTable()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
