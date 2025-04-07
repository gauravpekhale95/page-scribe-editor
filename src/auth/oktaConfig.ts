
// Okta configuration
export const oktaConfig = {
  clientId: '0oa268b9dhxaIQcIe0h8',
  issuer: `https://exprealty.oktapreview.com/oauth2/default`,
  redirectUri: 'http://localhost:8080/redirect',
  scopes: ['openid', 'profile', 'email'],
  pkce: true,
  disableHttpsCheck: false,
};

export const ORCHESTRATOR_BASE_URL = "https://dev-document-ai-orchestrator.exprealty.com";
