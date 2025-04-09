// // src/components/auth/ProtectedRoute.tsx - Updated version
// import React, { JSX } from 'react';
// import { useLocation } from 'react-router-dom';
// import { useAuth } from './AuthProvider';
// import AuthMessage from '../common/AuthMessage';

// interface ProtectedRouteProps {
//   children: JSX.Element;
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   const { isAuthenticated, isLoading, login } = useAuth();
//   const location = useLocation();

//   if (isLoading) {
//     return <AuthMessage message="Checking authentication status..." />;
//   }

//   if (!isAuthenticated) {
//     // Store the current full path (including search params)
//     const currentPath = location.pathname + location.search;
    
//     // Initiate login with current path
//     setTimeout(() => {
//       login(currentPath);
//     }, 1500); // Small delay to show the animation
    
//     // Return the login screen while redirecting
//     return <AuthMessage message="Preparing secure login..." />;
//   }

//   return children;
// };

// export default ProtectedRoute;