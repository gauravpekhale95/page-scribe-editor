// src/components/auth/LoginScreen.tsx
import React from 'react';
import './LoginScreen.css'; // We'll create this CSS file next

interface LoginScreenProps {
  message?: string;
  headerNote?:string;
}

const AuthMessage: React.FC<LoginScreenProps> = ({ 
  message = "Redirecting to secure login...",
  headerNote = "Secure Authentication"
}) => {
  return (
    <div className="login-screen">
      <div className="login-container">
        <div className="logo-container">
          <div className="app-logo">
            <svg viewBox="0 0 100 100" width="80" height="80">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#4f46e5" strokeWidth="8" />
              <path d="M 30 50 L 45 65 L 70 35" stroke="#4f46e5" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        
        <h1>{headerNote}</h1>
        
        <p className="login-message">{message}</p>
        
        <div className="loading-animation">
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
        </div>
        
        <p className="security-note">
          Hold on You'll be redirected to our secure login page.
          <br />
          After authentication, you'll return to your previous page.
        </p>
      </div>
    </div>
  );
};

export default AuthMessage;