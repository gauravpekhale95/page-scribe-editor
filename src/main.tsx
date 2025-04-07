
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Security } from '@okta/okta-react'
import { OktaAuth } from '@okta/okta-auth-js'
import App from './App'
import './index.css'
import { Toaster } from 'sonner'
import { oktaConfig } from './auth/oktaConfig'

// Create an instance of OktaAuth
const oktaAuth = new OktaAuth(oktaConfig);

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

createRoot(rootElement).render(
  <React.StrictMode>
    <Security oktaAuth={oktaAuth} restoreOriginalUri={() => window.location.href = '/'}>
      <App />
      <Toaster position="top-right" richColors />
    </Security>
  </React.StrictMode>
)
