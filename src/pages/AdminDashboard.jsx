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

const AdminDashboard = () => {
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
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
            </label>
            <textarea
              name={key}
              value={formData[key] || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>
        );
      }

      if (inputType === 'select') {
        return (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
            </label>
            <select
              name={key}
              value={formData[key] || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
      }

      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
          </label>
          <input
            type={inputType}
            name={key}
            value={formData[key] || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No {activeTab} found. Add some to get started!
        </div>
      );
    }

    const columns = Object.keys(data[0]).filter(key => key !== 'id');

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              {columns.map(column => (
                <th key={column} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  {column.charAt(0).toUpperCase() + column.slice(1).replace(/([A-Z])/g, ' $1')}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {columns.map(column => (
                  <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                    {Array.isArray(item[column]) 
                      ? item[column].join(', ') 
                      : typeof item[column] === 'object' 
                        ? JSON.stringify(item[column]) 
                        : String(item[column] || '')}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border-b">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your crowdfunding platform data with full CRUD operations
            </p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {['creators', 'projects', 'users', 'admins'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Form Section */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {isEditing ? 'Edit' : 'Add New'} {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).slice(0, -1)}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderFormFields()}
                <div className="md:col-span-2 flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (isEditing ? 'Update' : 'Add')}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Data Table Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} List
                </h2>
                <button
                  onClick={fetchData}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
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
