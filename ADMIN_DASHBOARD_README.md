# Admin Dashboard - Firebase CRUD Operations

## Overview
The AdminDashboard is a comprehensive page that provides full CRUD (Create, Read, Update, Delete) operations for your crowdfunding platform's data entities. It's built with React, Firebase Firestore, and styled with Tailwind CSS.

## Features

### 🔐 **Multi-Entity Management**
- **Creators**: Manage project creators with name, phone, email, and password
- **Projects**: Handle crowdfunding projects with title, balance, funding goals, description, and status
- **Users**: Manage platform users with their backed projects
- **Admins**: Control admin accounts and permissions

### 🚀 **Full CRUD Operations**
- **Create**: Add new entities with dynamic forms
- **Read**: View all data in organized tables with sorting
- **Update**: Edit existing entities inline
- **Delete**: Remove entities with confirmation

### 🎨 **Modern UI/UX**
- Responsive design that works on all devices
- Tab-based navigation between different entity types
- Clean, professional interface using Tailwind CSS
- Loading states and error handling
- Form validation and user feedback

## How to Use

### 1. **Access the Dashboard**
Navigate to `/admin` in your application to access the Admin Dashboard.

### 2. **Switch Between Entities**
Use the tabs at the top to switch between managing:
- Creators
- Projects  
- Users
- Admins

### 3. **Add New Items**
1. Select the appropriate tab
2. Fill out the form on the left side
3. Click "Add" to create a new entry
4. The table will automatically refresh

### 4. **Edit Existing Items**
1. Click the "Edit" button next to any item in the table
2. The form will populate with existing data
3. Make your changes
4. Click "Update" to save changes
5. Click "Cancel" to discard changes

### 5. **Delete Items**
1. Click the "Delete" button next to any item
2. Confirm the deletion in the popup
3. The item will be permanently removed

### 6. **Refresh Data**
Click the "Refresh" button to reload data from Firebase.

## Firebase Collections

The dashboard automatically creates and manages these Firestore collections:

- `creators` - Project creators
- `projects` - Crowdfunding projects
- `users` - Platform users
- `admins` - Admin accounts

## Data Structure

### Creators
```javascript
{
  name: string,
  phone: string,
  email: string,
  password: string
}
```

### Projects
```javascript
{
  projectTitle: string,
  balance: number,
  fundGoal: number,
  description: string,
  projectStatus: 'pending' | 'approved' | 'rejected' | 'completed',
  creatorId: string
}
```

### Users
```javascript
{
  name: string,
  email: string,
  phone: string,
  password: string,
  backedProjects: string[]
}
```

### Admins
```javascript
{
  adminName: string,
  password: string
}
```

## Security Considerations

⚠️ **Important**: This dashboard provides full access to your Firebase data. In production:

1. **Implement Authentication**: Add user authentication before allowing access
2. **Role-Based Access**: Restrict access to admin users only
3. **Firebase Security Rules**: Configure proper Firestore security rules
4. **Environment Variables**: Ensure Firebase config is properly secured

## Customization

### Adding New Fields
To add new fields to any entity:

1. Update the `formSchemas` object in `AdminDashboard.jsx`
2. Add the field to the appropriate schema
3. The form and table will automatically update

### Modifying Validation
Customize form validation by modifying the `handleInputChange` function and adding validation logic.

### Styling Changes
The dashboard uses Tailwind CSS classes. Modify the className attributes to change the appearance.

## Troubleshooting

### Common Issues

1. **Firebase Connection Error**
   - Check your Firebase configuration
   - Ensure environment variables are set correctly
   - Verify Firebase project permissions

2. **Data Not Loading**
   - Check browser console for errors
   - Verify Firestore rules allow read operations
   - Ensure collections exist in Firebase

3. **Form Submission Errors**
   - Check required fields are filled
   - Verify data types match expected format
   - Check Firestore rules for write permissions

## Dependencies

- React 19+
- Firebase 12+
- React Router DOM 7+
- Tailwind CSS 4+

## Support

For issues or questions about the Admin Dashboard, check:
1. Firebase console for data and permissions
2. Browser console for JavaScript errors
3. Network tab for API request issues
