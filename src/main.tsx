import React from 'react'
import { createRoot } from 'react-dom/client'
import { Security } from '@okta/okta-react'
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js'
import App from './App'
import './index.css'
import { Toaster } from 'sonner'
import { EnvConfig } from './envConfig'

// Initialize Okta
const envConfig = new EnvConfig();
const oktaAuth = new OktaAuth({
  issuer: envConfig.OKTA_BASE_URL + envConfig.endpoints.oktaIssuerEndpoint,
  clientId: envConfig.OKTA_APP_ID,
  redirectUri: window.location.origin + '/login/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true
});

// Called when the user is redirected from Okta login
const restoreOriginalUri = (_oktaAuth: OktaAuth, originalUri: string) => {
  window.location.replace(toRelativeUrl(originalUri || '/', window.location.origin));
};

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

createRoot(rootElement).render(
  <React.StrictMode>
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      <App />
      <Toaster position="top-right" richColors />
    </Security>
  </React.StrictMode>
)